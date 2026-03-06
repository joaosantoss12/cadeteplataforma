import { useState } from 'react';
import { 
  Shield, Settings, Calendar, Trophy, MapPin, Plus, Pencil, Trash2, X, Save, Loader2, Euro
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  useAdminEstadios, 
  useAdminAnalisesDia, 
  useAdminAnalisesPremium, 
  useConfiguracoes 
} from '../hooks/useAdmin';
import type { Estadio, AnaliseDia, AnalisePremium } from '../types/database';

type TabType = 'configuracoes' | 'analises-dia' | 'analises-premium' | 'estadios';

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
    { id: 'estadios' as TabType, label: 'Estádios', icon: MapPin },
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
        {activeTab === 'estadios' && <EstadiosTab />}
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

  const configLabels: Record<string, string> = {
    'preco_analise_premium': 'Preço Análise Premium',
    'preco_grupo_desafios': 'Preço Grupo Desafios'
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
        {configuracoes.map((config) => (
          <div 
            key={config.chave}
            className="bg-[#03091a]/50 border border-blue-900/30 rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-white font-bold">{configLabels[config.chave] || config.chave}</p>
              <p className="text-blue-300/60 text-sm">{config.descricao}</p>
            </div>
            
            {editing === config.chave ? (
              <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-yellow-400">{parseFloat(config.valor).toFixed(2)}€</span>
                <button
                  onClick={() => handleEdit(config.chave, config.valor)}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4 text-blue-400" />
                </button>
              </div>
            )}
          </div>
        ))}
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
                <td className="py-3 px-4 text-white">{analise.data}</td>
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
    preco: 5.00
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
      preco: 5.00
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (analise: AnalisePremium) => {
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
      await addAnalise(formData as Omit<AnalisePremium, 'id' | 'created_at'>);
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
                  <label className="block text-sm font-bold text-blue-300/70 mb-2">Preço (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData(prev => ({ ...prev, preco: parseFloat(e.target.value) }))}
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
                <td className="py-3 px-4 text-white">{analise.data}</td>
                <td className="py-3 px-4 text-blue-300">{analise.liga}</td>
                <td className="py-3 px-4 text-white">{analise.jogo}</td>
                <td className="py-3 px-4 text-indigo-400">{analise.aposta}</td>
                <td className="py-3 px-4 text-yellow-400 font-bold">{analise.odd}</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">{analise.preco}€</td>
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

// ==================== ESTÁDIOS TAB ====================
function EstadiosTab() {
  const { estadios, loading, addEstadio, updateEstadio, deleteEstadio } = useAdminEstadios();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Estadio>>({
    nome: '',
    localizacao: '',
    capacidade: '',
    inauguracao: '',
    facto: '',
    instagram_link: '',
    instagram_post_url: '',
    data_visita: null,
    imagem_bg: 'from-blue-600/20 to-[#081533]',
    icon_color: 'text-blue-500'
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      localizacao: '',
      capacidade: '',
      inauguracao: '',
      facto: '',
      instagram_link: '',
      instagram_post_url: '',
      data_visita: null,
      imagem_bg: 'from-blue-600/20 to-[#081533]',
      icon_color: 'text-blue-500'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (estadio: Estadio) => {
    setFormData(estadio);
    setEditingId(estadio.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (editingId) {
      await updateEstadio(editingId, formData);
    } else {
      await addEstadio(formData as Omit<Estadio, 'id' | 'created_at'>);
    }
    
    resetForm();
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tens a certeza que queres apagar este estádio?')) {
      await deleteEstadio(id);
    }
  };

  const colorOptions = [
    { value: 'from-blue-600/20 to-[#081533]', label: 'Azul', iconColor: 'text-blue-500' },
    { value: 'from-red-600/20 to-[#081533]', label: 'Vermelho', iconColor: 'text-red-500' },
    { value: 'from-green-600/20 to-[#081533]', label: 'Verde', iconColor: 'text-green-500' },
    { value: 'from-yellow-600/20 to-[#081533]', label: 'Amarelo', iconColor: 'text-yellow-500' },
    { value: 'from-purple-600/20 to-[#081533]', label: 'Roxo', iconColor: 'text-purple-500' },
    { value: 'from-slate-400/20 to-[#081533]', label: 'Cinza', iconColor: 'text-slate-300' },
  ];

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
          <MapPin className="w-5 h-5 text-emerald-400" />
          Estádios ({estadios.length})
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Novo Estádio
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-gradient-to-br from-[#0a1b42] to-[#081533] border border-blue-800/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-blue-900/30 sticky top-0 bg-[#0a1b42]">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Editar Estádio' : 'Novo Estádio'}
              </h2>
              <button onClick={resetForm} className="text-blue-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Estádio da Luz"
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-blue-300/70 mb-2">Localização</label>
                  <input
                    type="text"
                    value={formData.localizacao}
                    onChange={(e) => setFormData(prev => ({ ...prev, localizacao: e.target.value }))}
                    placeholder="Lisboa, Portugal"
                    required
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-300/70 mb-2">Capacidade</label>
                  <input
                    type="text"
                    value={formData.capacidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacidade: e.target.value }))}
                    placeholder="64.642"
                    required
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-blue-300/70 mb-2">Inauguração</label>
                  <input
                    type="text"
                    value={formData.inauguracao}
                    onChange={(e) => setFormData(prev => ({ ...prev, inauguracao: e.target.value }))}
                    placeholder="2003"
                    required
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-300/70 mb-2">Data Visita</label>
                  <input
                    type="date"
                    value={formData.data_visita || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, data_visita: e.target.value || null }))}
                    className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Facto Interessante</label>
                <textarea
                  value={formData.facto}
                  onChange={(e) => setFormData(prev => ({ ...prev, facto: e.target.value }))}
                  rows={3}
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Link Instagram (perfil)</label>
                <input
                  type="url"
                  value={formData.instagram_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram_link: e.target.value }))}
                  placeholder="https://instagram.com/..."
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">URL do Reel Instagram (para embed)</label>
                <input
                  type="url"
                  value={formData.instagram_post_url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram_post_url: e.target.value || null }))}
                  placeholder="https://www.instagram.com/reel/XXXXXXXXX/"
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl px-4 py-3 text-white"
                />
                <p className="text-blue-400/50 text-xs mt-1">Cola o link direto do Reel (formato /reel/). Opcional.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-300/70 mb-2">Cor do Card</label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, imagem_bg: color.value, icon_color: color.iconColor }))}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        formData.imagem_bg === color.value 
                          ? 'border-white bg-white/10' 
                          : 'border-transparent bg-[#03091a] hover:border-blue-500/50'
                      }`}
                    >
                      <div className={`w-full h-8 rounded-lg bg-gradient-to-br ${color.value}`}></div>
                      <p className="text-white text-xs mt-1 text-center">{color.label}</p>
                    </button>
                  ))}
                </div>
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
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
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
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Nome</th>
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Localização</th>
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Capacidade</th>
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Inauguração</th>
              <th className="text-left py-3 px-4 text-blue-300/70 font-bold text-sm">Data Visita</th>
              <th className="text-right py-3 px-4 text-blue-300/70 font-bold text-sm">Ações</th>
            </tr>
          </thead>
          <tbody>
            {estadios.map((estadio) => (
              <tr key={estadio.id} className="border-b border-blue-900/20 hover:bg-blue-900/10">
                <td className="py-3 px-4 text-white font-bold">{estadio.nome}</td>
                <td className="py-3 px-4 text-blue-300">{estadio.localizacao}</td>
                <td className="py-3 px-4 text-white">{estadio.capacidade}</td>
                <td className="py-3 px-4 text-yellow-400">{estadio.inauguracao}</td>
                <td className="py-3 px-4 text-emerald-400">{estadio.data_visita || '—'}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(estadio)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(estadio.id)}
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
        {estadios.length === 0 && (
          <p className="text-center text-blue-300/50 py-8">Nenhum estádio encontrado.</p>
        )}
      </div>
    </div>
  );
}
