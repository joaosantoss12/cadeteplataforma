import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { AnaliseDia, AnalisePremium } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

export function useAnaliseDia() {
  const [analise, setAnalise] = useState<AnaliseDia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnaliseHoje = async () => {
    setLoading(true);
    const hoje = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('analise_dia')
      .select('*')
      .eq('data', hoje)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      setError(error.message);
    } else {
      setAnalise(data || null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnaliseHoje();
  }, []);

  return { analise, loading, error, refetch: fetchAnaliseHoje };
}

export function useAnalisesPremium() {
  const { user } = useAuth();
  const [analises, setAnalises] = useState<AnalisePremium[]>([]);
  const [compradas, setCompradas] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalises = async () => {
    setLoading(true);
    
    // Buscar todas as análises premium
    const { data: analisesData, error: analisesError } = await supabase
      .from('analise_premium')
      .select('*')
      .order('data', { ascending: false });

    if (analisesError) {
      setError(analisesError.message);
    } else {
      setAnalises(analisesData || []);
    }

    // Buscar análises compradas pelo utilizador
    if (user) {
      const { data: comprasData } = await supabase
        .from('compras_premium')
        .select('analise_premium_id')
        .eq('user_id', user.id);

      if (comprasData) {
        setCompradas(comprasData.map((c: any) => c.analise_premium_id));
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAnalises();
  }, [user]);

  const verificarAcesso = (analiseId: number) => {
    return compradas.includes(analiseId);
  };

  return { analises, compradas, loading, error, verificarAcesso, refetch: fetchAnalises };
}
