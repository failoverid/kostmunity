import { useState, useEffect } from 'react';
import { KostProfile } from '@/models';
import { 
  getKostById, 
  getKostByOwnerId, 
  getAllKosts 
} from '@/services';

/**
 * Hook to fetch kost by ID
 */
export function useKost(kostId: string | null) {
  const [kost, setKost] = useState<KostProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!kostId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchKost = async () => {
      try {
        setLoading(true);
        const data = await getKostById(kostId);
        if (isMounted) {
          setKost(data);
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

    fetchKost();

    return () => {
      isMounted = false;
    };
  }, [kostId]);

  return { kost, loading, error };
}

/**
 * Hook to fetch kosts by owner
 */
export function useKostsByOwner(ownerId?: string) {
  const [kosts, setKosts] = useState<KostProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      const data = ownerId 
        ? await getKostByOwnerId(ownerId)
        : await getAllKosts();
      setKosts(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [ownerId]);

  return { kosts, loading, error, refetch };
}
