import { useState, useEffect } from 'react';
import { Ad } from '@/models';
import { getActiveAds, getAllAds } from '@/services';

/**
 * Hook to fetch ads
 */
export function useAds(activeOnly: boolean = true) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      const data = activeOnly ? await getActiveAds() : await getAllAds();
      setAds(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [activeOnly]);

  return { ads, loading, error, refetch };
}
