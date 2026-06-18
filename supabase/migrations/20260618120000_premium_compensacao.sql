-- Compensação: uma análise premium pode ser oferecida GRÁTIS aos utilizadores
-- que compraram uma análise anterior (tipicamente uma que correu mal).
-- Quando 'compensa_analise_id' está preenchido, quem tiver uma compra dessa
-- análise antiga ganha acesso a esta sem pagar.
ALTER TABLE analise_premium
  ADD COLUMN IF NOT EXISTS compensa_analise_id INTEGER
    REFERENCES analise_premium(id) ON DELETE SET NULL;
