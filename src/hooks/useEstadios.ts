import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Estadio } from '../types/database';

export function useEstadios() {
  const [estadios, setEstadios] = useState<Estadio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstadios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('estadios')
      .select('*')
      .order('data_visita', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setEstadios(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEstadios();
  }, []);

  return { estadios, loading, error, refetch: fetchEstadios };
}
