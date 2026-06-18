import { useState } from 'react';
import { 
  Shield, Settings, Calendar, Trophy, Plus, Pencil, Trash2, X, Save, Loader2, Euro, ToggleLeft, ToggleRight, Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  useAdminAnalisesDia,
  useAdminAnalisesPremium,
  useConfiguracoes
} from '../hooks/useAdmin';
import type { AnaliseDia, AnalisePremium } from '../types/database';
import { formatData } from '../utils/format';

type TabType = 'configuracoes' | 'analises-dia' | 'analises-premium';

export default function Admin() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('configuracoes');

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
          <p className="text-blue-200/60">Não tens permissões de administrador.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'configuracoes' as TabType, label: 'Configurações', icon: Settings },
    { id: 'analises-dia' as TabType, label: 'Análises do Dia', icon: Calendar },
    { id: 'analises-premium' as TabType, label: 'Análises Premium', icon: Trophy },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <div className="border-b border-blue-900/30 pb-6">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <Shield className="w-10 h-10 text-yellow-500" />
          Painel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Administração</span>
        </h1>
        <p className="mt-2 text-blue-200/70 text-lg">
          Gere configurações, análises e estádios do sistema.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#03091a] p-1.5 rounded-xl border border-blue-900/50 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-md' 
                  : 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-[#081533] border border-blue-900/40 rounded-3xl p-6 md:p-8 shadow-xl">
        {activeTab === 'configuracoes' && <ConfiguracoesTab />}
        {activeTab === 'analises-dia' && <AnalisesDiaTab />}
        {activeTab === 'analises-premium' && <AnalisesPremiumTab />}
      </div>
    </div>
  );
}

// ==================== CONFIGURAÇÕES TAB ====================
function ConfiguracoesTab() {
  const { configuracoes, loading, updateConfiguracao } = useConfiguracoes();
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const handleEdit = (chave: string, valor: string) => {
    setEditing(chave);
    setEditValue(valor);
  };

  const handleSave = async (chave: string) => {
    setSaving(true);
    await updateConfiguracao(chave, editValue);
    setEditing(null);
    setSaving(false);
  };

  const handleToggle = async (chave: string, currentValue: string) => {
    setToggling(chave);
    await updateConfiguracao(chave, currentValue === 'true' ? 'false' : 'true');
    setToggling(null);
  };

  const handleTimeSave = async (chave: string, valor: string) => {
    if (!valor) return;
    setToggling(chave);
    await updateConfiguracao(chave, valor);
    setToggling(null);
  };

  const configMeta: Record<string, { label: string; type: 'price' | 'hours' | 'time' | 'toggle'; description?: string }> = {
    'preco_analise_premium': { label: 'Preço Análise Premium', type: 'price' },
    'preco_grupo_desafios': { label: 'Preço Grupo Desafios', type: 'price' },
    'analise_premium_ativa': { label: 'Análise Premium Ativa', type: 'toggle', description: 'Liga/desliga a disponibilidade da análise premium para utilizadores' },
    'horas_reset_analise_premium': { label: 'Hora Limite de Compra (Premium)', type: 'time', description: 'Até que hora (Portugal) os utilizadores podem comprar a análise premium' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Euro className="w-5 h-5 text-yellow-400" />
        Preços e Configurações
      </h2>
      
      <div className="grid gap-4">
        {configuracoes
          .filter((config) => !config.chave.startsWith('stripe_'))
          .map((config) => {
          const meta = configMeta[config.chave];
          const type = meta?.type ?? 'price';

          return (
            <div
              key={config.chave}
              className="bg-[#03091a]/50 border border-blue-900/30 rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-white font-bold">{meta?.label ?? config.chave}</p>
                <p className="text-blue-300/60 text-sm">{meta?.description ?? config.descricao}</p>
              </div>

              {/* TOGGLE */}
              {type === 'toggle' && (
                <button
                  onClick={() => handleToggle(config.chave, config.valor)}
                  disabled={toggling === config.chave}
                  className="shrink-0 flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {toggling === config.chave ? (
                    <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
                  ) : config.valor === 'true' ? (
                    <ToggleRight className="w-10 h-10 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-blue-900/60" />
                  )}
                  <span className={`text-sm font-bold ${config.valor === 'true' ? 'text-emerald-400' : 'text-blue-400/50'}`}>
                    {config.valor === 'true' ? 'Ativo' : 'Inativo'}
                  </span>
                </button>
              )}

              {/* HOURS input */}
              {type === 'hours' && (
                editing === config.chave ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min="1"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-20 bg-[#03091a] border border-blue-500 rounded-lg px-3 py-2 text-white text-right"
                      autoFocus
                    />
                    <span className="text-blue-300/60 text-sm">h</span>
                    <button
                      onClick={() => handleSave(config.chave)}
                      disabled={saving}
                      className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4 text-white" />}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 shrink-0">
                    <Clock className="w-4 h-4 text-blue-400/60" />
                    <span className="text-2xl font-black text-yellow-400">{config.valor}h</span>
                    <button
                      onClick={() => handleEdit(config.chave, config.valor)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 text-blue-400" />
                    </button>
                  </div>
                )
              )}

              {/* TIME (hora limite) — dropdowns de hora e minutos, guarda ao escolher */}
              {type === 'time' && (() => {
                const pad = (n: number) => n.toString().padStart(2, '0');
                const [hh = '18', mm = '00'] = (config.valor || '18:00').split(':');
                const selectClass = "bg-[#03091a] border border-blue-900/50 rounded-lg px-3 py-2 text-white text-lg font-bold cursor-pointer focus:border-blue-500 outline-none disabled:opacity-60";
                return (
                  <div className="flex items-center gap-2 shrink-0">
                    <Clock className="w-5 h-5 text-blue-400/60" />
                    <select
                      value={hh}
                      onChange={(e) => handleTimeSave(config.chave, `${e.target.value}:${mm}`)}
                      disabled={toggling === config.chave}
                      className={selectClass}
                    >
                      {Array.from({ length: 24 }, (_, i) => pad(i)).map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <span className="text-white text-lg font-bold">:</span>
                    <select
                      value={mm}
                      onChange={(e) => handleTimeSave(config.chave, `${hh}:${e.target.value}`)}
                      disabled={toggling === config.chave}
                      className={selectClass}
                    >
                      {Array.from({ length: 60 }, (_, i) => pad(i)).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    {toggling === config.chave && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
                  </div>
                );
              })()}

              {/* PRICE input */}
              {type === 'price' && (
                editing === config.chave ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      step="0.01"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-24 bg-[#03091a] border border-blue-500 rounded-lg px-3 py-2 text-white text-right"
                      autoFocus
                    />
                    <span className="text-white">€</span>
                    <button
                      onClick={() => handleSave(config.chave)}
                      disabled={saving}
                      className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4 text-white" />}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-2xl font-black text-yellow-400">{parseFloat(config.valor).toFixed(2)}€</span>
                    <button
                      onClick={() => handleEdit(config.chave, config.valor)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 text-blue-400" />
                    </button>
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== ANÁLISES DO DIA TAB ====================
function AnalisesDiaTab() {
  const { analises, loading, addAnalise, updateAnalise, deleteAnalise } = useAdminAnalisesDia();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<AnaliseDia>>({
    data: '',
    liga: '',
    jogo: '',
    hora: '',
    aposta: '',
    odd: 0,
    analise_contexto: '',
    analise_estatisticas_casa: '',
    analise_estatisticas_fora: '',
    analise_conclusao: '',
    resultado: 'pendente'
  });

  const resetForm = () => {
    setFormData({
      data: '',
      liga: '',
      jogo: '',
      hora: '',
      aposta: '',
      odd: 0,
      analise_contexto: '',
      analise_estatisticas_casa: '',
      analise_estatisticas_fora: '',
      analise_conclusao: '',
      resultado: 'pendente'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (analise: AnaliseDia) => {
    setFormData(analise);
    setEditingId(analise.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (editingId) {
      await updateAnalise(editingId, formData);
    } else {
      await addAnalise(formData as Omit<AnaliseDia, 'id' | 'created_at'>);
    }
    
    resetForm();
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tens a certeza que queres apagar esta análise?')) {
      await deleteAnalise(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          Análises do Dia ({analises.length})
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nova Análise
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-gradient-to-br from-[#0a1b42] to-[#081533] border border-blue-800/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-blue-900/30 sticky top-0 bg-[#0a1b42]">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Editar Análise' : 'Nova Análise do Dia'}
              </h2>
              <button onClick={resetForm} className="text-blue-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-blue-300/70 mb-2">Data</label>
                  <input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                    required
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-300/70 mb-2">Hora</label>
                  <input
                    type="text"
                    value={formData.hora}
                    onChange={(e) => setFormData(prev => ({ ...prev, hora: e.target.value }))}
                    placeholder="17:30"
                    required
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Liga</label>
                <input
                  type="text"
                  value={formData.liga}
                  onChange={(e) => setFormData(prev => ({ ...prev, liga: e.target.value }))}
                  placeholder="Premier League"
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Jogo</label>
                <input
                  type="text"
                  value={formData.jogo}
                  onChange={(e) => setFormData(prev => ({ ...prev, jogo: e.target.value }))}
                  placeholder="Arsenal vs Manchester City"
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-blue-300/70 mb-2">Aposta</label>
                  <input
                    type="text"
                    value={formData.aposta}
                    onChange={(e) => setFormData(prev => ({ ...prev, aposta: e.target.value }))}
                    placeholder="Over 2.5 Golos"
                    required
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-300/70 mb-2">Odd</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.odd}
                    onChange={(e) => setFormData(prev => ({ ...prev, odd: parseFloat(e.target.value) }))}
                    required
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Contexto</label>
                <textarea
                  value={formData.analise_contexto}
                  onChange={(e) => setFormData(prev => ({ ...prev, analise_contexto: e.target.value }))}
                  rows={3}
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Estatísticas Casa</label>
                <textarea
                  value={formData.analise_estatisticas_casa}
                  onChange={(e) => setFormData(prev => ({ ...prev, analise_estatisticas_casa: e.target.value }))}
                  rows={2}
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Estatísticas Fora</label>
                <textarea
                  value={formData.analise_estatisticas_fora}
                  onChange={(e) => setFormData(prev => ({ ...prev, analise_estatisticas_fora: e.target.value }))}
                  rows={2}
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Conclusão</label>
                <textarea
                  value={formData.analise_conclusao}
                  onChange={(e) => setFormData(prev => ({ ...prev, analise_conclusao: e.target.value }))}
                  rows={2}
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Resultado</label>
                <select
                  value={formData.resultado || 'pendente'}
                  onChange={(e) => setFormData(prev => ({ ...prev, resultado: e.target.value as 'pendente' | 'green' | 'red' }))}
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white cursor-pointer"
                >
                  <option value="pendente">Pendente</option>
                  <option value="green">Green ✓</option>
                  <option value="red">Red ✗</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 font-bold py-3 px-6 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {editingId ? 'Atualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-blue-900/30">
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Data</th>
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Liga</th>
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Jogo</th>
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Aposta</th>
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Odd</th>
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Resultado</th>
              <th className="text-right py-3 px-4 text-blue-300/70 font-bold text-sm">Ações</th>
            </tr>
          </thead>
          <tbody>
            {analises.map((analise) => (
              <tr key={analise.id} className="border-b border-blue-900/20 hover:bg-blue-900/10">
                <td className="py-3 px-4 text-white">{formatData(analise.data)}</td>
                <td className="py-3 px-4 text-blue-300">{analise.liga}</td>
                <td className="py-3 px-4 text-white">{analise.jogo}</td>
                <td className="py-3 px-4 text-indigo-400">{analise.aposta}</td>
                <td className="py-3 px-4 text-yellow-400 font-bold">{analise.odd}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    analise.resultado === 'green' ? 'bg-emerald-500/20 text-emerald-400' :
                    analise.resultado === 'red' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {analise.resultado === 'green' ? '✓ Green' : analise.resultado === 'red' ? '✗ Red' : '⏳ Pendente'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(analise)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(analise.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {analises.length === 0 && (
          <p className="text-center text-blue-300/50 py-8">Nenhuma análise encontrada.</p>
        )}
      </div>
    </div>
  );
}

// ==================== ANÁLISES PREMIUM TAB ====================
function AnalisesPremiumTab() {
  const { analises, loading, addAnalise, updateAnalise, deleteAnalise } = useAdminAnalisesPremium();
  const { getConfiguracao, updateConfiguracao, loading: configLoading } = useConfiguracoes();
  const precoGlobal = parseFloat(getConfiguracao('preco_analise_premium') || '5.00');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<AnalisePremium>>({
    data: '',
    liga: '',
    jogo: '',
    hora: '',
    aposta: '',
    odd: 0,
    analise_contexto: '',
    analise_estatisticas_casa: '',
    analise_estatisticas_fora: '',
    analise_conclusao: '',
    resultado: 'pendente',
    preco: precoGlobal,
    compensa_analise_id: null
  });

  const resetForm = () => {
    setFormData({
      data: '',
      liga: '',
      jogo: '',
      hora: '',
      aposta: '',
      odd: 0,
      analise_contexto: '',
      analise_estatisticas_casa: '',
      analise_estatisticas_fora: '',
      analise_conclusao: '',
      resultado: 'pendente',
      preco: precoGlobal,
      compensa_analise_id: null
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (analise: AnalisePremium) => {
    // O preço é global, por isso usamos sempre o valor da configuração.
    setFormData({ ...analise, preco: precoGlobal });
    setEditingId(analise.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const preco = formData.preco ?? precoGlobal;

    if (editingId) {
      await updateAnalise(editingId, { ...formData, preco });
    } else {
      await addAnalise({ ...formData, preco } as Omit<AnalisePremium, 'id' | 'created_at'>);
    }

    // Mantém o preço global sincronizado (Configurações ↔ Análises Premium).
    if (!Number.isNaN(preco)) {
      await updateConfiguracao('preco_analise_premium', String(preco));
    }

    resetForm();
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tens a certeza que queres apagar esta análise?')) {
      await deleteAnalise(id);
    }
  };

  if (loading || configLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Análises Premium ({analises.length})
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nova Análise Premium
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-gradient-to-br from-[#0a1b42] to-[#081533] border border-blue-800/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-blue-900/30 sticky top-0 bg-[#0a1b42]">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Editar Análise Premium' : 'Nova Análise Premium'}
              </h2>
              <button onClick={resetForm} className="text-blue-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-blue-300/70 mb-2">Data</label>
                  <input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                    required
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-300/70 mb-2">Hora</label>
                  <input
                    type="text"
                    value={formData.hora}
                    onChange={(e) => setFormData(prev => ({ ...prev, hora: e.target.value }))}
                    placeholder="17:30"
                    required
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-300/70 mb-2">Preço global (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData(prev => ({ ...prev, preco: parseFloat(e.target.value) }))}
                    required
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                  />
                  <p className="text-xs text-blue-300/50 mt-1">Aplica-se a todas as análises premium e sincroniza com as Configurações.</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Liga</label>
                <input
                  type="text"
                  value={formData.liga}
                  onChange={(e) => setFormData(prev => ({ ...prev, liga: e.target.value }))}
                  placeholder="Champions League"
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Jogo</label>
                <input
                  type="text"
                  value={formData.jogo}
                  onChange={(e) => setFormData(prev => ({ ...prev, jogo: e.target.value }))}
                  placeholder="Real Madrid vs Bayern"
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-blue-300/70 mb-2">Aposta</label>
                  <input
                    type="text"
                    value={formData.aposta}
                    onChange={(e) => setFormData(prev => ({ ...prev, aposta: e.target.value }))}
                    placeholder="Ambas Marcam"
                    required
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-300/70 mb-2">Odd</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.odd}
                    onChange={(e) => setFormData(prev => ({ ...prev, odd: parseFloat(e.target.value) }))}
                    required
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Contexto</label>
                <textarea
                  value={formData.analise_contexto}
                  onChange={(e) => setFormData(prev => ({ ...prev, analise_contexto: e.target.value }))}
                  rows={3}
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Estatísticas Casa</label>
                <textarea
                  value={formData.analise_estatisticas_casa}
                  onChange={(e) => setFormData(prev => ({ ...prev, analise_estatisticas_casa: e.target.value }))}
                  rows={2}
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Estatísticas Fora</label>
                <textarea
                  value={formData.analise_estatisticas_fora}
                  onChange={(e) => setFormData(prev => ({ ...prev, analise_estatisticas_fora: e.target.value }))}
                  rows={2}
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Conclusão</label>
                <textarea
                  value={formData.analise_conclusao}
                  onChange={(e) => setFormData(prev => ({ ...prev, analise_conclusao: e.target.value }))}
                  rows={2}
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Resultado</label>
                <select
                  value={formData.resultado || 'pendente'}
                  onChange={(e) => setFormData(prev => ({ ...prev, resultado: e.target.value as 'pendente' | 'green' | 'red' }))}
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white cursor-pointer"
                >
                  <option value="pendente">Pendente</option>
                  <option value="green">Green ✓</option>
                  <option value="red">Red ✗</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Compensação (grátis para quem comprou)</label>
                <select
                  value={formData.compensa_analise_id ?? ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, compensa_analise_id: e.target.value ? parseInt(e.target.value, 10) : null }))}
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white cursor-pointer"
                >
                  <option value="">Nenhuma — análise paga normal</option>
                  {analises
                    .filter(a => a.id !== editingId)
                    .map(a => (
                      <option key={a.id} value={a.id}>
                        {formatData(a.data)} — {a.jogo}{a.resultado === 'red' ? ' (Red ✗)' : ''}
                      </option>
                    ))}
                </select>
                <p className="text-xs text-blue-300/50 mt-1">
                  Se escolheres uma análise anterior, quem a comprou recebe esta gratuitamente como compensação.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 font-bold py-3 px-6 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {editingId ? 'Atualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-blue-900/30">
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Data</th>
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Liga</th>
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Jogo</th>
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Aposta</th>
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Odd</th>
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Preço</th>
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Resultado</th>
              <th className="text-right py-3 px-4 text-blue-300/70 font-bold text-sm">Ações</th>
            </tr>
          </thead>
          <tbody>
            {analises.map((analise) => (
              <tr key={analise.id} className="border-b border-blue-900/20 hover:bg-blue-900/10">
                <td className="py-3 px-4 text-white">{formatData(analise.data)}</td>
                <td className="py-3 px-4 text-blue-300">{analise.liga}</td>
                <td className="py-3 px-4 text-white">{analise.jogo}</td>
                <td className="py-3 px-4 text-indigo-400">{analise.aposta}</td>
                <td className="py-3 px-4 text-yellow-400 font-bold">{analise.odd}</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">{precoGlobal.toFixed(2)}€</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    analise.resultado === 'green' ? 'bg-emerald-500/20 text-emerald-400' :
                    analise.resultado === 'red' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {analise.resultado === 'green' ? '✓ Green' : analise.resultado === 'red' ? '✗ Red' : '⏳ Pendente'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(analise)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(analise.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {analises.length === 0 && (
          <p className="text-center text-blue-300/50 py-8">Nenhuma análise premium encontrada.</p>
        )}
      </div>
    </div>
  );
}
