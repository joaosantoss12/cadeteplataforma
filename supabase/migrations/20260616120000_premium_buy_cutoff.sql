-- Reaproveita a configuração 'horas_reset_analise_premium' como hora limite de COMPRA
-- (Portugal, formato HH:MM), em vez de duração de acesso após a compra.
-- O acesso passa a ser permanente depois da compra; a hora só limita novas compras.
UPDATE configuracoes
SET valor = '18:00',
    descricao = 'Hora limite (Portugal, HH:MM) para comprar a análise premium',
    updated_at = NOW()
WHERE chave = 'horas_reset_analise_premium'
  AND valor !~ '^[0-2]?[0-9]:[0-5][0-9]$';
