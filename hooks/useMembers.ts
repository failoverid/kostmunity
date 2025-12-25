import { useState, useEffect } from 'react';
import { MemberInfo } from '@/models';
import { 
  getMemberById, 
  getAllMembers, 
  getMembersByKostId,
  getActiveMembers 
} from '@/services';

/**
 * Hook to fetch a single member by ID
 */
export function useMember(memberId: string | null) {
  const [member, setMember] = useState<MemberInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!memberId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchMember = async () => {
      try {
        setLoading(true);
        const data = await getMemberById(memberId);
        if (isMounted) {
          setMember(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMember();

    return () => {
      isMounted = false;
    };
  }, [memberId]);

  return { member, loading, error };
}

/**
 * Hook to fetch members by kost ID
 */
export function useMembers(kostId?: string, activeOnly: boolean = false) {
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      let data: MemberInfo[];
      
      if (activeOnly) {
        data = await getActiveMembers(kostId);
      } else if (kostId) {
        data = await getMembersByKostId(kostId);
      } else {
        data = await getAllMembers();
      }
      
      setMembers(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [kostId, activeOnly]);

  return { members, loading, error, refetch };
}
