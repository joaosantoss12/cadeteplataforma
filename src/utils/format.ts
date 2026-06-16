// Converte uma data ISO (YYYY-MM-DD) para o formato dd/MM/yyyy.
// Se o valor não estiver no formato esperado, devolve o valor original.
export function formatData(value?: string | null): string {
  if (!value) return '';
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}
