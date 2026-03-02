import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Estadio, EstadioInsert, AnaliseDia, AnaliseDiaInsert, AnalisePremium, AnalisePremiumInsert, Configuracao } from '../types/database';

// Hook para gerir Estádios
export function useAdminEstadios() {
  const [estadios, setEstadios] = useState<Estadio[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEstadios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('estadios')
      .select('*')
      .order('id', { ascending: true });
    
    if (!error && data) {
      setEstadios(data as Estadio[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEstadios();
  }, []);

  const addEstadio = async (estadio: Omit<EstadioInsert, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('estadios')
      .insert(estadio as any)
      .select()
      .single();
    
    if (!error && data) {
      setEstadios(prev => [...prev, data as Estadio]);
    }
    return { data, error };
  };

  const updateEstadio = async (id: number, updates: Partial<Estadio>) => {
    const { data, error } = await (supabase.from('estadios') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (!error && data) {
      setEstadios(prev => prev.map(e => e.id === id ? data as Estadio : e));
    }
    return { data, error };
  };

  const deleteEstadio = async (id: number) => {
    const { error } = await supabase
      .from('estadios')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setEstadios(prev => prev.filter(e => e.id !== id));
    }
    return { error };
  };

  return { estadios, loading, fetchEstadios, addEstadio, updateEstadio, deleteEstadio };
}

// Hook para gerir Análises do Dia
export function useAdminAnalisesDia() {
  const [analises, setAnalises] = useState<AnaliseDia[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalises = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('analise_dia')
      .select('*')
      .order('data', { ascending: false });
    
    if (!error && data) {
      setAnalises(data as AnaliseDia[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalises();
  }, []);

  const addAnalise = async (analise: Omit<AnaliseDiaInsert, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('analise_dia')
      .insert(analise as any)
      .select()
      .single();
    
    if (!error && data) {
      setAnalises(prev => [data as AnaliseDia, ...prev]);
    }
    return { data, error };
  };

  const updateAnalise = async (id: number, updates: Partial<AnaliseDia>) => {
    const { data, error } = await (supabase.from('analise_dia') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (!error && data) {
      setAnalises(prev => prev.map(a => a.id === id ? data as AnaliseDia : a));
    }
    return { data, error };
  };

  const deleteAnalise = async (id: number) => {
    const { error } = await supabase
      .from('analise_dia')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setAnalises(prev => prev.filter(a => a.id !== id));
    }
    return { error };
  };

  return { analises, loading, fetchAnalises, addAnalise, updateAnalise, deleteAnalise };
}

// Hook para gerir Análises Premium
export function useAdminAnalisesPremium() {
  const [analises, setAnalises] = useState<AnalisePremium[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalises = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('analise_premium')
      .select('*')
      .order('data', { ascending: false });
    
    if (!error && data) {
      setAnalises(data as AnalisePremium[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalises();
  }, []);

  const addAnalise = async (analise: Omit<AnalisePremiumInsert, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('analise_premium')
      .insert(analise as any)
      .select()
      .single();
    
    if (!error && data) {
      setAnalises(prev => [data as AnalisePremium, ...prev]);
    }
    return { data, error };
  };

  const updateAnalise = async (id: number, updates: Partial<AnalisePremium>) => {
    const { data, error } = await (supabase.from('analise_premium') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (!error && data) {
      setAnalises(prev => prev.map(a => a.id === id ? data as AnalisePremium : a));
    }
    return { data, error };
  };

  const deleteAnalise = async (id: number) => {
    const { error } = await supabase
      .from('analise_premium')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setAnalises(prev => prev.filter(a => a.id !== id));
    }
    return { error };
  };

  return { analises, loading, fetchAnalises, addAnalise, updateAnalise, deleteAnalise };
}

// Hook para gerir Configurações
export function useConfiguracoes() {
  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConfiguracoes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*')
      .order('chave', { ascending: true });
    
    if (!error && data) {
      setConfiguracoes(data as Configuracao[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  const updateConfiguracao = async (chave: string, valor: string) => {
    const { data, error } = await (supabase.from('configuracoes') as any)
      .update({ valor, updated_at: new Date().toISOString() })
      .eq('chave', chave)
      .select()
      .single();
    
    if (!error && data) {
      setConfiguracoes(prev => prev.map(c => c.chave === chave ? data as Configuracao : c));
    }
    return { data, error };
  };

  const getConfiguracao = (chave: string) => {
    return configuracoes.find(c => c.chave === chave)?.valor;
  };

  return { configuracoes, loading, fetchConfiguracoes, updateConfiguracao, getConfiguracao };
}
