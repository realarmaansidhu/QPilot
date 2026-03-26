'use client';

import { useCallback, useEffect, useState } from 'react';
import { getStock } from '@/lib/api';
import type { StockProfile } from '@/types/stock';

/** Hook to fetch stock data for a given ticker */
export function useStockData(ticker: string) {
  const [stock, setStock] = useState<StockProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!ticker) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getStock(ticker.toUpperCase());
      setStock(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  }, [ticker]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stock, loading, error, refetch: fetchData };
}
