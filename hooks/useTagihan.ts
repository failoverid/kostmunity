import { useState, useEffect } from 'react';
import { Tagihan } from '@/models';
import { 
  getTagihanById,
  getAllTagihan,
  getTagihanByMemberId,
  getTagihanByKostId,
  getUnpaidTagihan,
  getTagihanSummary 
} from '@/services';

/**
 * Hook to fetch tagihan by ID
 */
export function useTagihan(tagihanId: string | null) {
  const [tagihan, setTagihan] = useState<Tagihan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tagihanId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchTagihan = async () => {
      try {
        setLoading(true);
        const data = await getTagihanById(tagihanId);
        if (isMounted) {
          setTagihan(data);
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

    fetchTagihan();

    return () => {
      isMounted = false;
    };
  }, [tagihanId]);

  return { tagihan, loading, error };
}

/**
 * Hook to fetch tagihan list
 */
export function useTagihanList(
  filter?: 'all' | 'unpaid' | 'member' | 'kost',
  filterId?: string
) {
  const [tagihan, setTagihan] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      let data: Tagihan[];

      switch (filter) {
        case 'unpaid':
          data = await getUnpaidTagihan(filterId);
          break;
        case 'member':
          data = filterId ? await getTagihanByMemberId(filterId) : [];
          break;
        case 'kost':
          data = filterId ? await getTagihanByKostId(filterId) : [];
          break;
        default:
          data = await getAllTagihan();
      }

      setTagihan(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [filter, filterId]);

  return { tagihan, loading, error, refetch };
}

/**
 * Hook to fetch tagihan summary for dashboard
 */
export function useTagihanSummary(kostId?: string) {
  const [summary, setSummary] = useState({
    total: 0,
    lunas: 0,
    belumLunas: 0,
    terlambat: 0,
    totalAmount: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      const data = await getTagihanSummary(kostId);
      setSummary(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [kostId]);

  return { summary, loading, error, refetch };
}
