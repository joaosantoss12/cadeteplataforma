import { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Instagram, 
  ChevronDown, 
  ExternalLink,
  Users,
  Info,
  CalendarDays,
  Loader2
} from 'lucide-react';
import { useEstadios } from '../hooks/useEstadios';

export default function Estadios() {
  const { estadios, loading } = useEstadios();
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleEstadio = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const formatarData = (data: string | null) => {
    if (!data) return 'Sem data';
    return new Date(data).toLocaleDateString('pt-PT', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-3" />
          <p className="text-blue-200/60">A carregar estádios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Cabeçalho da Página */}
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md">
          Cadete pelos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Estádios</span>
        </h1>
        <p className="mt-3 text-blue-200/70 max-w-2xl text-lg">
          Acompanha as viagens aos maiores palcos do futebol. Leitura de jogo no terreno, estatísticas cruciais do reduto e as melhores oportunidades vistas da bancada.
        </p>
      </div>

      {/* Lista de Estádios */}
      {estadios.length === 0 ? (
        <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-12 text-center">
          <MapPin className="w-12 h-12 text-blue-400/50 mx-auto mb-4" />
          <p className="text-blue-200/60">Ainda não há estádios registados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {estadios.map((estadio) => {
            const isOpen = openId === estadio.id;

            return (
              <div 
                key={estadio.id} 
                className={`bg-[#081533] border transition-all duration-300 rounded-2xl overflow-hidden ${
                  isOpen 
                    ? 'border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.15)]' 
                    : 'border-blue-900/40 shadow-lg hover:border-blue-700/50'
                }`}
              >
                <button 
                  onClick={() => toggleEstadio(estadio.id)}
                  className="w-full text-left px-5 py-5 md:px-8 md:py-6 flex items-center justify-between hover:bg-[#0a1b42] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${estadio.imagem_bg} border border-blue-800/50 shrink-0 shadow-inner`}>
                      <MapPin className={`w-7 h-7 ${estadio.icon_color}`} />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-wide">
                        {estadio.nome}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm font-medium text-blue-300/60">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-blue-400/70" />
                          {estadio.localizacao}
                        </span>
                        <span className="hidden sm:inline text-blue-800/50">•</span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-blue-400/70" />
                          {formatarData(estadio.data_visita)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-full transition-all duration-300 ${isOpen ? 'rotate-180 bg-blue-500/20 text-blue-400' : 'text-blue-500/50 bg-blue-900/20'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-5 pb-6 pt-2 md:px-8 md:pb-8 bg-[#03091a]/50 border-t border-blue-900/40">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-4">
                      
                      <div className="bg-[#081533]/80 rounded-xl p-4 border border-blue-900/30">
                        <h4 className="text-xs font-bold text-blue-400/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Info className="w-4 h-4" /> Dados do Estádio
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-blue-900/30 pb-2">
                            <span className="flex items-center gap-2 text-blue-200/80 text-sm">
                              <Users className="w-4 h-4 text-blue-400" /> Capacidade
                            </span>
                            <span className="font-bold text-white">{estadio.capacidade}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-blue-200/80 text-sm">
                              <CalendarDays className="w-4 h-4 text-blue-400" /> Inauguração
                            </span>
                            <span className="font-bold text-white">{estadio.inauguracao}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-indigo-950/20 rounded-xl p-4 border border-indigo-500/20">
                        <h4 className="text-xs font-bold text-indigo-400/80 uppercase tracking-widest mb-2">
                          Nota
                        </h4>
                        <p className="text-sm text-indigo-100/80 leading-relaxed italic">
                          "{estadio.facto}"
                        </p>
                      </div>

                    </div>
                    
                    <div className="flex justify-start">
                      <a 
                        href={estadio.instagram_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all transform hover:-translate-y-1 w-full sm:w-auto justify-center"
                      >
                        <Instagram className="w-5 h-5" />
                        Ver Vlog nas Bancadas
                        <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                      </a>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}