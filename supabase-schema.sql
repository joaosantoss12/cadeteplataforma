-- =====================================================
-- CADETE - Schema da Base de Dados Supabase
-- =====================================================
-- Corre este script no SQL Editor do Supabase Dashboard

-- Habilitar RLS (Row Level Security) por defeito
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- =====================================================
-- Tabela: profiles (Perfis de Utilizador)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilizadores podem ver o próprio perfil" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Utilizadores podem atualizar o próprio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Utilizadores podem inserir o próprio perfil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- Tabela: configuracoes (Settings do Sistema)
-- =====================================================
CREATE TABLE IF NOT EXISTS configuracoes (
  id SERIAL PRIMARY KEY,
  chave TEXT NOT NULL UNIQUE,
  valor TEXT NOT NULL,
  descricao TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para configuracoes
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer pessoa pode ver configurações" ON configuracoes
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Apenas admins podem modificar configurações" ON configuracoes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Inserir configurações padrão
INSERT INTO configuracoes (chave, valor, descricao) VALUES
  ('preco_analise_premium', '5.00', 'Preço de cada análise premium em euros'),
  ('preco_grupo_desafios', '49.99', 'Preço do grupo Desafios em euros'),
  ('analise_premium_ativa', 'true', 'Se a análise premium está ativa (true/false)'),
  ('horas_reset_analise_premium', '18:00', 'Hora limite (Portugal, HH:MM) para comprar a análise premium')
ON CONFLICT (chave) DO NOTHING;

-- =====================================================
-- Tabela: apostas (Gestão de Banca)
-- =====================================================
CREATE TABLE IF NOT EXISTS apostas (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data DATE NOT NULL,
  jogo TEXT NOT NULL,
  mercado TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  odd DECIMAL(5,2) NOT NULL,
  retorno DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS apostas_user_id_idx ON apostas(user_id);
CREATE INDEX IF NOT EXISTS apostas_data_idx ON apostas(data);

-- RLS para apostas
ALTER TABLE apostas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilizadores podem ver as próprias apostas" ON apostas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Utilizadores podem inserir as próprias apostas" ON apostas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilizadores podem atualizar as próprias apostas" ON apostas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Utilizadores podem apagar as próprias apostas" ON apostas
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- Tabela: estadios
-- =====================================================
CREATE TABLE IF NOT EXISTS estadios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  capacidade TEXT NOT NULL,
  inauguracao TEXT NOT NULL,
  facto TEXT NOT NULL,
  instagram_link TEXT NOT NULL,
  data_visita DATE,
  imagem_bg TEXT DEFAULT 'from-blue-600/20 to-[#081533]',
  icon_color TEXT DEFAULT 'text-blue-500',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para estadios (leitura pública, escrita apenas para admins)
ALTER TABLE estadios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer pessoa pode ver estádios" ON estadios
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Apenas admins podem inserir estádios" ON estadios
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Apenas admins podem atualizar estádios" ON estadios
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Apenas admins podem apagar estádios" ON estadios
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- Tabela: analise_dia
-- =====================================================
CREATE TABLE IF NOT EXISTS analise_dia (
  id SERIAL PRIMARY KEY,
  data DATE NOT NULL UNIQUE,
  liga TEXT NOT NULL,
  jogo TEXT NOT NULL,
  hora TEXT NOT NULL,
  aposta TEXT NOT NULL,
  odd DECIMAL(5,2) NOT NULL,
  analise_contexto TEXT NOT NULL,
  analise_estatisticas_casa TEXT NOT NULL,
  analise_estatisticas_fora TEXT NOT NULL,
  analise_conclusao TEXT NOT NULL,
  resultado TEXT DEFAULT 'pendente' CHECK (resultado IN ('pendente', 'green', 'red')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca por data
CREATE INDEX IF NOT EXISTS analise_dia_data_idx ON analise_dia(data);

-- RLS para analise_dia (leitura para utilizadores autenticados)
ALTER TABLE analise_dia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilizadores autenticados podem ver análises do dia" ON analise_dia
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Apenas admins podem inserir análises do dia" ON analise_dia
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Apenas admins podem atualizar análises do dia" ON analise_dia
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Apenas admins podem apagar análises do dia" ON analise_dia
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- Tabela: analise_premium
-- =====================================================
CREATE TABLE IF NOT EXISTS analise_premium (
  id SERIAL PRIMARY KEY,
  data DATE NOT NULL,
  liga TEXT NOT NULL,
  jogo TEXT NOT NULL,
  hora TEXT NOT NULL,
  aposta TEXT NOT NULL,
  odd DECIMAL(5,2) NOT NULL,
  analise_contexto TEXT NOT NULL,
  analise_estatisticas_casa TEXT NOT NULL,
  analise_estatisticas_fora TEXT NOT NULL,
  analise_conclusao TEXT NOT NULL,
  resultado TEXT DEFAULT 'pendente' CHECK (resultado IN ('pendente', 'green', 'red')),
  preco DECIMAL(10,2) DEFAULT 5.00,
  compensa_analise_id INTEGER REFERENCES analise_premium(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca por data
CREATE INDEX IF NOT EXISTS analise_premium_data_idx ON analise_premium(data);

-- RLS para analise_premium (metadados visíveis, conteúdo apenas para quem comprou)
ALTER TABLE analise_premium ENABLE ROW LEVEL SECURITY;

-- Qualquer utilizador autenticado pode ver os metadados básicos
CREATE POLICY "Utilizadores podem ver metadados de análises premium" ON analise_premium
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Apenas admins podem inserir análises premium" ON analise_premium
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Apenas admins podem atualizar análises premium" ON analise_premium
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Apenas admins podem apagar análises premium" ON analise_premium
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- Tabela: compras_premium
-- =====================================================
CREATE TABLE IF NOT EXISTS compras_premium (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  analise_premium_id INTEGER REFERENCES analise_premium(id) ON DELETE CASCADE NOT NULL,
  data_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, analise_premium_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS compras_premium_user_idx ON compras_premium(user_id);
CREATE INDEX IF NOT EXISTS compras_premium_analise_idx ON compras_premium(analise_premium_id);

-- RLS para compras_premium
ALTER TABLE compras_premium ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilizadores podem ver as próprias compras" ON compras_premium
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Utilizadores podem inserir as próprias compras" ON compras_premium
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- Trigger: Atualizar updated_at em profiles
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- Trigger: Criar perfil automaticamente após registo
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- Dados de Exemplo (opcional)
-- =====================================================

-- Exemplo de estádios
INSERT INTO estadios (nome, localizacao, capacidade, inauguracao, facto, instagram_link, data_visita, imagem_bg, icon_color) VALUES
  ('Estádio da Luz', 'Lisboa, Portugal', '64.642', '2003', 'Conhecido como ''A Catedral'', o seu design permite uma acústica que amplifica a pressão sobre os adversários, algo que lemos perfeitamente para entradas em cantos.', 'https://instagram.com/cadete', '2024-01-15', 'from-red-600/20 to-[#081533]', 'text-red-500'),
  ('Santiago Bernabéu', 'Madrid, Espanha', '83.186', '1947 (Renov. 2023)', 'Palco de 4 finais da Champions League. A nova cobertura retrátil muda completamente a dinâmica de circulação da bola (e as linhas de over/under golos).', 'https://instagram.com/cadete', '2024-02-28', 'from-slate-400/20 to-[#081533]', 'text-slate-300'),
  ('San Siro', 'Milão, Itália', '75.817', '1926', 'A proximidade assustadora das bancadas verticais ao relvado cria um dos ambientes mais hostis da Europa para quem vem jogar fora.', 'https://instagram.com/cadete', '2024-03-10', 'from-blue-600/20 to-[#081533]', 'text-blue-500'),
  ('Anfield', 'Liverpool, Inglaterra', '61.276', '1884', 'Estatisticamente, a equipa da casa marca 40% dos seus golos a atacar para a mítica bancada ''The Kop'' na segunda parte.', 'https://instagram.com/cadete', '2024-04-05', 'from-red-500/20 to-[#081533]', 'text-red-400')
ON CONFLICT DO NOTHING;

-- Exemplo de análise do dia
INSERT INTO analise_dia (data, liga, jogo, hora, aposta, odd, analise_contexto, analise_estatisticas_casa, analise_estatisticas_fora, analise_conclusao, resultado) VALUES
  (CURRENT_DATE, 'Premier League', 'Arsenal vs Manchester City', '17:30', 'Over 2.5 Golos', 1.85, 'Confronto direto pelo topo da tabela. Arsenal em casa precisa pontuar para manter vantagem, enquanto o City vem de uma sequência invejável de golos marcados.', 'Nos últimos 5 jogos em casa, o Arsenal marcou pelo menos 2 golos em 4 deles. A média é de 2.6 golos por jogo no Emirates Stadium.', 'O Manchester City marcou em todos os últimos 10 jogos fora. Haaland está numa forma impressionante com 8 golos nos últimos 5 jogos.', 'Com duas equipas ofensivamente fortes e com muito em jogo, a probabilidade de vermos mais de 2 golos é alta. Recomendamos uma aposta de 2-3% da banca.', 'pendente')
ON CONFLICT DO NOTHING;

-- =====================================================
-- MIGRAÇÃO STRIPE - Corre este bloco separadamente
-- se já tens as tabelas base criadas
-- =====================================================

-- Adicionar colunas de subscrição Stripe à tabela profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive'
    CHECK (subscription_status IN ('active', 'inactive', 'past_due', 'canceled', 'trialing')),
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT
    CHECK (subscription_plan IN ('mensal', 'trimestral', 'anual', 'desafios')),
  ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;

-- Índice para pesquisa por stripe_customer_id (usado pelo webhook)
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_idx ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS profiles_stripe_subscription_idx ON profiles(stripe_subscription_id);

-- Adicionar Price IDs do Stripe às configurações (o admin preenche via painel)
INSERT INTO configuracoes (chave, valor, descricao) VALUES
  ('stripe_price_mensal',      '', 'Price ID do Stripe para plano Mensal (price_xxx)'),
  ('stripe_price_trimestral',  '', 'Price ID do Stripe para plano Trimestral (price_xxx)'),
  ('stripe_price_anual',       '', 'Price ID do Stripe para plano Anual (price_xxx)'),
  ('stripe_price_desafios',    '', 'Price ID do Stripe para acesso Desafios único (price_xxx)')
ON CONFLICT (chave) DO NOTHING;

-- =====================================================
-- MIGRAÇÃO INSTAGRAM EMBED - Campo post URL em estádios
-- =====================================================
ALTER TABLE estadios
  ADD COLUMN IF NOT EXISTS instagram_post_url TEXT;
