import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Aposta, ApostaInsert } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

export function useApostas() {
  const { user } = useAuth();
  const [apostas, setApostas] = useState<Aposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApostas = async () => {
    if (!user) {
      setApostas([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('apostas')
      .select('*')
      .eq('user_id', user.id)
      .order('data', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setApostas(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApostas();
  }, [user]);

  const addAposta = async (aposta: Omit<ApostaInsert, 'user_id'>) => {
    if (!user) return { error: new Error('Utilizador não autenticado') };

    const { data, error } = await supabase
      .from('apostas')
      .insert({ ...aposta, user_id: user.id } as any)
      .select()
      .single();

    if (!error && data) {
      setApostas(prev => [data, ...prev]);
    }

    return { data, error };
  };

  const updateAposta = async (id: number, updates: Partial<Aposta>) => {
    const { data, error } = await supabase
      .from('apostas')
      // @ts-expect-error - Types will be correct after tables are created
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setApostas(prev => prev.map(a => a.id === id ? data : a));
    }

    return { data, error };
  };

  const deleteAposta = async (id: number) => {
    const { error } = await supabase
      .from('apostas')
      .delete()
      .eq('id', id);

    if (!error) {
      setApostas(prev => prev.filter(a => a.id !== id));
    }

    return { error };
  };

  return { apostas, loading, error, addAposta, updateAposta, deleteAposta, refetch: fetchApostas };
}
