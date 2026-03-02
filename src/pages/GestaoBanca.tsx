import { useState, useEffect } from 'react';
import { 
  Wallet, TrendingUp, LineChart as LineChartIcon, Plus, CalendarDays, X, Calendar, Trophy, Target, Receipt, Loader2, Settings
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { useApostas } from '../hooks/useApostas';
import type { Aposta } from '../types/database';

const BANCA_STORAGE_KEY = 'cadete_banca_inicial';

const getMesAtual = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const gerarMesesAno = () => {
  const ano = new Date().getFullYear();
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return meses.map((label, i) => ({
    chave: `${ano}-${String(i + 1).padStart(2, '0')}`,
    label
  }));
};

const mesesAno = gerarMesesAno();

const getDiasNoMes = (mesChave: string) => {
  const [ano, mes] = mesChave.split('-').map(Number);
  return new Date(ano, mes, 0).getDate();
};

const getLabelMes = (mesChave: string | null) => {
  if (!mesChave) return '';
  return mesesAno.find((m) => m.chave === mesChave)?.label ?? mesChave;
};

export default function GestaoBanca() {
  const { apostas, loading, addAposta } = useApostas();
  const MES_REFERENCIA_ATUAL = getMesAtual();
  
  // Banca inicial (persistida no localStorage)
  const [bancaInicial, setBancaInicial] = useState(() => {
    const saved = localStorage.getItem(BANCA_STORAGE_KEY);
    return saved ? parseFloat(saved) : 1000;
  });
  const [showBancaModal, setShowBancaModal] = useState(false);
  const [novaBanca, setNovaBanca] = useState('');
  
  // Guardar banca no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem(BANCA_STORAGE_KEY, bancaInicial.toString());
  }, [bancaInicial]);
  
  const handleSaveBanca = () => {
    const valor = parseFloat(novaBanca);
    if (!isNaN(valor) && valor >= 0) {
      setBancaInicial(valor);
      setShowBancaModal(false);
      setNovaBanca('');
    }
  };
  
  const [showNovaAposta, setShowNovaAposta] = useState(false);
  const [mercadoSelecionado, setMercadoSelecionado] = useState('');
  const [mercadoOutro, setMercadoOutro] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields
  const [formData, setFormData] = useState({
    data: '',
    jogo: '',
    valor: '',
    odd: ''
  });
  const [resultadoAposta, setResultadoAposta] = useState<'ganha' | 'perdida' | null>(null);
  
  // Estado para controlar o nível de visualização dos gráficos
  const [nivelGrafico, setNivelGrafico] = useState<'anual' | 'mensal' | 'diario'>('anual');
  const [mesSelecionado, setMesSelecionado] = useState<string | null>(null);
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultadoAposta) return;
    
    setIsSubmitting(true);
    
    const mercado = mercadoSelecionado === 'Outro' ? mercadoOutro : mercadoSelecionado;
    const valor = parseFloat(formData.valor);
    const odd = parseFloat(formData.odd);
    
    // Calcular retorno baseado no resultado
    const retorno = resultadoAposta === 'ganha' ? valor * odd : 0;
    
    await addAposta({
      data: formData.data,
      jogo: formData.jogo,
      mercado,
      valor,
      odd,
      retorno
    });
    
    // Reset form
    setFormData({ data: '', jogo: '', valor: '', odd: '' });
    setMercadoSelecionado('');
    setMercadoOutro('');
    setResultadoAposta(null);
    setShowNovaAposta(false);
    setIsSubmitting(false);
  };

  const lucroTotal = apostas.reduce((soma, aposta) => soma + (Number(aposta.retorno) - Number(aposta.valor)), 0);
  const bancaAtual = bancaInicial + lucroTotal;
  const taxaAcerto = apostas.length > 0
    ? (apostas.filter((aposta) => (Number(aposta.retorno) - Number(aposta.valor)) > 0).length / apostas.length) * 100
    : 0;
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-3" />
          <p className="text-blue-200/60">A carregar apostas...</p>
        </div>
      </div>
    );
  }

  const dadosAnuais = mesesAno.map((mesInfo) => {
    const lucroMes = apostas
      .filter((aposta) => aposta.data.startsWith(mesInfo.chave))
      .reduce((soma, aposta) => soma + (Number(aposta.retorno) - Number(aposta.valor)), 0);
    return {
      mes: mesInfo.label,
      mesChave: mesInfo.chave,
      lucro: parseFloat(lucroMes.toFixed(2))
    };
  });

  const dadosAnuaisGrafico = dadosAnuais.reduce<{ mes: string; lucroAcumulado: number }[]>(
    (acc, item) => {
      const anterior = acc.length > 0 ? acc[acc.length - 1].lucroAcumulado : 0;
      acc.push({ mes: item.mes, lucroAcumulado: parseFloat((anterior + item.lucro).toFixed(2)) });
      return acc;
    },
    []
  );

  const mesAtivo = mesSelecionado ?? MES_REFERENCIA_ATUAL;
  const diasNoMes = getDiasNoMes(mesAtivo);
  const apostasDoMes = apostas.filter((aposta) => aposta.data.startsWith(mesAtivo));

  const apostasPorDia = apostasDoMes.reduce<Record<number, Aposta[]>>((acc, aposta) => {
    const dia = Number(aposta.data.split('-')[2]);
    if (!acc[dia]) {
      acc[dia] = [];
    }
    acc[dia].push(aposta);
    return acc;
  }, {});

  const calendarioMes = Array.from({ length: diasNoMes }, (_, i) => {
    const dia = i + 1;
    const resultadoDia = (apostasPorDia[dia] ?? []).reduce((soma, aposta) => soma + (aposta.retorno - aposta.valor), 0);
    return {
      dia,
      resultado: parseFloat(resultadoDia.toFixed(2)),
      temAposta: (apostasPorDia[dia] ?? []).length > 0
    };
  });

  const dadosMensaisGrafico = calendarioMes.reduce<{ dia: number; lucroAcumulado: number }[]>(
    (acc, item) => {
      const anterior = acc.length > 0 ? acc[acc.length - 1].lucroAcumulado : 0;
      acc.push({ dia: item.dia, lucroAcumulado: parseFloat((anterior + item.resultado).toFixed(2)) });
      return acc;
    },
    []
  );

  // --- FUNÇÕES DE NAVEGAÇÃO ---
  const verMes = (mes: string) => {
    setMesSelecionado(mes);
    setDiaSelecionado(null);
    setNivelGrafico('mensal');
  };

  const verDia = (dia: number) => {
    setDiaSelecionado(dia);
    setNivelGrafico('diario');
  };

  // Funções para os Botões Rápidos
  const setVisaoAnual = () => {
    setNivelGrafico('anual');
    setMesSelecionado(null);
    setDiaSelecionado(null);
  };

  const setVisaoMensal = () => {
    setMesSelecionado(MES_REFERENCIA_ATUAL);
    setNivelGrafico('mensal');
    setDiaSelecionado(null);
  };

  const setVisaoDiaria = () => {
    setMesSelecionado(MES_REFERENCIA_ATUAL);
    const primeiroDiaComAposta = calendarioMes.find((dia) => dia.temAposta)?.dia ?? 1;
    setDiaSelecionado(primeiroDiaComAposta);
    setNivelGrafico('diario');
  };

  // Custom Tooltip para os gráficos
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const valor = payload[0].value;
      const isGreen = valor >= 0;
      return (
        <div className="bg-[#03091a] border border-blue-900/50 p-3 rounded-lg shadow-xl">
          <p className="text-blue-200/80 text-sm font-bold mb-1">{`${label}`}</p>
          <p className={`text-lg font-black ${isGreen ? 'text-emerald-400' : 'text-red-400'}`}>
            {isGreen ? '+' : ''}{valor.toFixed(2)}€
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip para apostas diárias (mostra jogo, mercado, odd e valor)
  const CustomTooltipAposta = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isGreen = data.lucro >= 0;
      return (
        <div className="bg-[#03091a] border border-blue-900/50 p-4 rounded-lg shadow-xl min-w-[220px]">
          <p className="text-white font-bold text-sm mb-1">{data.jogo}</p>
          <p className="text-indigo-400 font-semibold text-xs mb-2">{data.mercado}</p>
          <div className="space-y-1 text-xs">
            <p className="text-blue-200/70">Valor apostado: <span className="text-white font-bold">{data.valor.toFixed(2)}€</span></p>
            <p className="text-blue-200/70">Odd: <span className="text-yellow-400 font-bold">{data.odd}</span></p>
            <p className="text-blue-200/70">Retorno: <span className={`font-black ${isGreen ? 'text-emerald-400' : 'text-red-400'}`}>
              {isGreen ? '+' : ''}{data.lucro.toFixed(2)}€
            </span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-blue-900/30 pb-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <LineChartIcon className="w-10 h-10 text-blue-500" />
            Faz aqui a tua Gestão de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Banca</span>
          </h1>
          <p className="mt-2 text-blue-200/70 text-lg">
            Todos os valores são calculados a partir das tuas apostas diárias (dia, valor, odd e retorno).
          </p>
        </div>
        <button 
          onClick={() => setShowNovaAposta(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Registar Nova Aposta
        </button>
      </div>

      {/* --- PAINEL ESTATÍSTICAS RÁPIDAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#0a1b42] to-[#081533] border border-blue-800/50 p-6 rounded-2xl relative overflow-hidden shadow-lg">
          <Wallet className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-blue-500/10" />
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-blue-300/70 uppercase tracking-widest">Banca Atual</p>
            <button
              onClick={() => {
                setNovaBanca(bancaInicial.toString());
                setShowBancaModal(true);
              }}
              className="text-blue-400/60 hover:text-blue-400 transition-colors p-1 rounded-lg hover:bg-blue-900/30 cursor-pointer"
              title="Definir banca inicial"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-4xl font-black text-white">{bancaAtual.toFixed(2)}€</h2>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <TrendingUp className={`w-4 h-4 ${lucroTotal >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
            <span className={`font-bold ${lucroTotal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {lucroTotal >= 0 ? '+' : ''}{lucroTotal.toFixed(2)}€
            </span>
            <span className="text-blue-400/50 text-xs">(inicial: {bancaInicial.toFixed(0)}€)</span>
          </div>
        </div>
        <div className="bg-[#081533] border border-blue-900/40 p-6 rounded-2xl shadow-lg flex flex-col justify-center relative overflow-hidden">
          <Trophy className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-yellow-500/10" />
          <p className="text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-1">Mês Mais Lucrativo</p>
          <h2 className="text-3xl font-black text-yellow-400">
            {(() => {
              const melhorMes = dadosAnuais.reduce((best, mes) => mes.lucro > best.lucro ? mes : best, dadosAnuais[0]);
              return melhorMes.lucro > 0 ? `${melhorMes.mes} (+${melhorMes.lucro.toFixed(0)}€)` : 'N/A';
            })()}
          </h2>
        </div>
        <div className="bg-[#081533] border border-blue-900/40 p-6 rounded-2xl shadow-lg flex flex-col justify-center relative overflow-hidden">
          <Receipt className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-indigo-500/10" />
          <p className="text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-1">Total Apostas</p>
          <h2 className="text-3xl font-black text-white">{apostas.length}</h2>
        </div>
        <div className="bg-[#081533] border border-blue-900/40 p-6 rounded-2xl shadow-lg flex flex-col justify-center relative overflow-hidden">
          <Target className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-emerald-500/10" />
          <p className="text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-1">Taxa Acerto</p>
          <h2 className="text-3xl font-black text-white">{taxaAcerto.toFixed(0)}%</h2>
        </div>
      </div>

      {/* --- MÓDULO DE GRÁFICOS INTERATIVOS --- */}
      <div className="bg-[#081533] border border-blue-900/40 rounded-3xl p-6 md:p-8 shadow-xl">
        
        {/* NAVEGAÇÃO DO GRÁFICO E BOTÕES RÁPIDOS */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 border-b border-blue-900/30 pb-4 gap-4">
          
          <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <CalendarDays className="w-6 h-6 text-indigo-400 shrink-0" />
            {nivelGrafico === 'anual' && "Performance Anual (2026)"}
            {nivelGrafico === 'mensal' && `Desempenho: ${getLabelMes(mesSelecionado ?? MES_REFERENCIA_ATUAL)} 2026`}
            {nivelGrafico === 'diario' && `Diário: ${diaSelecionado} de ${getLabelMes(mesSelecionado ?? MES_REFERENCIA_ATUAL)}`}
          </h3>
          
          {/* Botões de Filtro Rápido */}
          <div className="flex bg-[#03091a] p-1.5 rounded-xl border border-blue-900/50 w-full md:w-auto overflow-x-auto">
            <button 
              onClick={setVisaoDiaria} 
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                nivelGrafico === 'diario' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30'
              } cursor-pointer`}
            >
              Dia
            </button>
            <button 
              onClick={setVisaoMensal} 
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                nivelGrafico === 'mensal' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30'
              } cursor-pointer`}
            >
              Mês
            </button>
            <button 
              onClick={setVisaoAnual} 
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                nivelGrafico === 'anual' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30'
              } cursor-pointer`}
            >
              Ano
            </button>
          </div>

        </div>

        {/* VISÃO ANUAL */}
        {nivelGrafico === 'anual' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-300">
            {/* Gráfico de Linha Acumulada Anual */}
            <div>
              <h4 className="text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-4">Evolução do Lucro Acumulado</h4>
              <div className="h-[250px] w-full bg-[#03091a]/50 p-4 rounded-xl border border-blue-900/30">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosAnuaisGrafico}>
                    <XAxis dataKey="mes" stroke="#3b82f6" opacity={0.5} tick={{fill: '#93c5fd', fontSize: 12}} />
                    <YAxis stroke="#3b82f6" opacity={0.5} tick={{fill: '#93c5fd', fontSize: 12}} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="lucroAcumulado" stroke="#4f46e5" strokeWidth={3} dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#818cf8' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Grelha de Meses */}
            <div>
              <h4 className="text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-4">Meses (Clica para ver detalhe)</h4>
              <div className="grid grid-cols-3 gap-3 bg-[#03091a]/50 p-4 rounded-xl border border-blue-900/30">
                {dadosAnuais.map((mesInfo) => {
                  const isGreen = mesInfo.lucro >= 0;
                  const hasData = apostas.some((aposta) => aposta.data.startsWith(mesInfo.mesChave));
                  return (
                    <button
                      key={mesInfo.mesChave}
                      onClick={() => hasData ? verMes(mesInfo.mesChave) : undefined}
                      className={`h-16 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                        !hasData
                          ? 'bg-blue-900/10 border-blue-900/20 opacity-40 cursor-default'
                          : isGreen
                            ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 hover:scale-105'
                            : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:scale-105'
                      }`}
                    >
                      <span className="text-white font-bold text-sm">{mesInfo.mes}</span>
                      <span className={`text-xs font-black mt-0.5 ${
                        !hasData ? 'text-blue-500/40' : isGreen ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {!hasData ? '—' : `${isGreen ? '+' : ''}${mesInfo.lucro.toFixed(0)}€`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VISÃO MENSAL (Gráfico + Calendário) */}
        {nivelGrafico === 'mensal' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-300">
            {/* Gráfico de Linha do Mês */}
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-4">Evolução do Lucro Acumulado</h4>
              <div className="flex-1 min-h-[320px] w-full bg-[#03091a]/50 p-4 rounded-xl border border-blue-900/30">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosMensaisGrafico}>
                    <XAxis dataKey="dia" stroke="#3b82f6" opacity={0.5} tick={{fill: '#93c5fd', fontSize: 12}} />
                    <YAxis stroke="#3b82f6" opacity={0.5} tick={{fill: '#93c5fd', fontSize: 12}} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="lucroAcumulado" stroke="#4f46e5" strokeWidth={3} dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4}} activeDot={{r: 6, fill: '#818cf8'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Calendário Interativo */}
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-4">Calendário (Clica no Dia)</h4>
              <div className="flex-1 grid grid-cols-7 gap-2 bg-[#03091a]/50 p-4 rounded-xl border border-blue-900/30 content-start">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                  <div key={d} className="text-center text-xs font-bold text-blue-500/50 mb-2">{d}</div>
                ))}
                {calendarioMes.map((diaInfo) => {
                  const semAposta = !diaInfo.temAposta;
                  const isGreen = diaInfo.resultado >= 0;
                  return (
                    <button
                      key={diaInfo.dia}
                      onClick={() => diaInfo.temAposta ? verDia(diaInfo.dia) : undefined}
                      className={`h-12 rounded-lg flex flex-col items-center justify-center border transition-all ${
                        semAposta
                          ? 'bg-blue-900/10 border-blue-900/20 opacity-40 cursor-default'
                          : isGreen
                            ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 hover:scale-105 cursor-pointer'
                            : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:scale-105 cursor-pointer'
                      }`}
                    >
                      <span className="text-white font-bold text-sm">{diaInfo.dia}</span>
                      <span className={`text-[9px] font-black ${
                        semAposta ? 'text-blue-500/40' : isGreen ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {semAposta ? '—' : `${isGreen ? '+' : ''}${diaInfo.resultado.toFixed(0)}€`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VISÃO DIÁRIA */}
        {nivelGrafico === 'diario' && (() => {
          const apostasHoje = diaSelecionado ? (apostasPorDia[diaSelecionado] ?? []) : [];
          const dadosApostasHoje = apostasHoje.map((aposta, index) => ({
            aposta: `Aposta ${index + 1}`,
            jogo: aposta.jogo,
            mercado: aposta.mercado,
            lucro: aposta.retorno - aposta.valor,
            valor: aposta.valor,
            odd: aposta.odd
          }));
          const totalDia = dadosApostasHoje.reduce((s, a) => s + a.lucro, 0);
          const totalIsGreen = totalDia >= 0;
          return (
            <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
              <h4 className="text-sm font-bold text-blue-300/70 uppercase tracking-widest text-center">
                Apostas do Dia {diaSelecionado} — Total:&nbsp;
                <span className={totalIsGreen ? 'text-emerald-400' : 'text-red-400'}>
                  {totalIsGreen ? '+' : ''}{totalDia.toFixed(2)}€
                </span>
              </h4>
              <div className="bg-[#03091a]/50 p-4 rounded-xl border border-blue-900/30 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosApostasHoje} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="aposta" stroke="#3b82f6" opacity={0.5} tick={{fill: '#93c5fd'}} />
                    <YAxis stroke="#3b82f6" opacity={0.5} tick={{fill: '#93c5fd'}} />
                    <Tooltip content={<CustomTooltipAposta />} cursor={{fill: '#1e3a8a', opacity: 0.4}} />
                    <Bar dataKey="lucro" radius={[6, 6, 0, 0]}>
                      {dadosApostasHoje.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.lucro >= 0 ? '#34d399' : '#f87171'} className="hover:opacity-80 transition-opacity" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })()}
      </div>

      {/* --- MODAL NOVA APOSTA --- */}
      {showNovaAposta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowNovaAposta(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-gradient-to-br from-[#0a1b42] to-[#081533] border border-blue-800/50 rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-blue-900/30">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                Registar Nova Aposta
              </h2>
              <button
                onClick={() => setShowNovaAposta(false)}
                className="text-blue-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-blue-900/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Data */}
              <div>
                <label className="block text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-2">Data</label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                    required
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 pointer-events-none" />
                </div>
              </div>

              {/* Jogo */}
              <div>
                <label className="block text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-2">Jogo</label>
                <input
                  type="text"
                  value={formData.jogo}
                  onChange={(e) => setFormData(prev => ({ ...prev, jogo: e.target.value }))}
                  placeholder="Ex: Benfica vs Porto"
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white placeholder:text-blue-500/40 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>


              {/* Mercado */}
              <div>
                <label className="block text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-2">Mercado</label>
                <select
                  value={mercadoSelecionado}
                  aria-placeholder='Seleciona o mercado'
                  onChange={(e) => setMercadoSelecionado(e.target.value)}
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                >
                  <option value="" disabled>Seleciona o mercado</option>
                  <option value="Vencedor Casa">Vencedor Casa</option>
                  <option value="Vencedor Fora">Vencedor Fora</option>
                  <option value="Empate">Empate</option>
                  <option value="Over 1.5">Over 1.5</option>
                  <option value="Over 2.5">Over 2.5</option>
                  <option value="Over 3.5">Over 3.5</option>
                  <option value="Under 1.5">Under 1.5</option>
                  <option value="Under 2.5">Under 2.5</option>
                  <option value="Under 3.5">Under 3.5</option>
                  <option value="Ambas Marcam">Ambas Marcam</option>
                  <option value="Dupla Hipótese 1X">Dupla Hipótese 1X</option>
                  <option value="Dupla Hipótese X2">Dupla Hipótese X2</option>
                  <option value="Dupla Hipótese 12">Dupla Hipótese 12</option>
                  <option value="Handicap -1 Casa">Handicap -1 Casa</option>
                  <option value="Handicap +1 Fora">Handicap +1 Fora</option>
                  <option value="Outro">Outro</option>
                </select>
                {mercadoSelecionado === 'Outro' && (
                  <input
                    type="text"
                    value={mercadoOutro}
                    onChange={(e) => setMercadoOutro(e.target.value)}
                    placeholder="Escreve o mercado..."
                    className="w-full mt-3 bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white placeholder:text-blue-500/40 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                )}
              </div>

              {/* Valor e Odd em linha */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-2">Valor (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.valor}
                    onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
                    placeholder="0.00"
                    required
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white placeholder:text-blue-500/40 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-2">Odd</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={formData.odd}
                    onChange={(e) => setFormData(prev => ({ ...prev, odd: e.target.value }))}
                    placeholder="1.50"
                    required
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white placeholder:text-blue-500/40 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Resultado da Aposta */}
              <div>
                <label className="block text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-2">Resultado</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setResultadoAposta('ganha')}
                    className={`py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      resultadoAposta === 'ganha'
                        ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                    } cursor-pointer`}
                  >
                    <Trophy className="w-5 h-5" />
                    Aposta Ganha
                  </button>
                  <button
                    type="button"
                    onClick={() => setResultadoAposta('perdida')}
                    className={`py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      resultadoAposta === 'perdida'
                        ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                        : 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                    } cursor-pointer`}
                  >
                    <X className="w-5 h-5" />
                    Aposta Perdida
                  </button>
                </div>
                {resultadoAposta && formData.valor && formData.odd && (
                  <p className="text-sm mt-3 text-center">
                    <span className="text-blue-300/70">Profit: </span>
                    <span className={`font-bold ${resultadoAposta === 'ganha' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {resultadoAposta === 'ganha' 
                        ? `+${((parseFloat(formData.valor) * parseFloat(formData.odd)) - parseFloat(formData.valor)).toFixed(2)}€`
                        : `-${parseFloat(formData.valor).toFixed(2)}€`
                      }
                    </span>
                  </p>
                )}
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNovaAposta(false)}
                  className="flex-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 font-bold py-3 px-6 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !resultadoAposta || !formData.data || !formData.jogo || !formData.valor || !formData.odd || !mercadoSelecionado || (mercadoSelecionado === 'Outro' && !mercadoOutro)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      A guardar...
                    </>
                  ) : (
                    'Guardar Aposta'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DEFINIR BANCA INICIAL --- */}
      {showBancaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowBancaModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-gradient-to-br from-[#0a1b42] to-[#081533] border border-blue-800/50 rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-blue-900/30">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-400" />
                Definir Banca Inicial
              </h2>
              <button
                onClick={() => setShowBancaModal(false)}
                className="text-blue-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-blue-900/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-2">Valor Inicial (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={novaBanca}
                  onChange={(e) => setNovaBanca(e.target.value)}
                  placeholder="1000.00"
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white placeholder:text-blue-500/40 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-xl font-bold"
                  autoFocus
                />
                <p className="text-xs text-blue-400/60 mt-2">Este valor será usado como ponto de partida para calcular os teus lucros/perdas.</p>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBancaModal(false)}
                  className="flex-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 font-bold py-3 px-6 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveBanca}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}