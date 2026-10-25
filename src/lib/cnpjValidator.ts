/**
 * Validador Oficial de CNPJ utilizando o Algoritmo Módulo 11 da Receita Federal do Brasil.
 */

export function validateCnpj(cnpj: string): boolean {
  if (!cnpj) return false;

  // Remove caracteres não numéricos
  const clean = cnpj.replace(/\D/g, '');

  // Deve ter exatamente 14 dígitos
  if (clean.length !== 14) return false;

  // Rejeita sequências conhecidas de dígitos repetidos
  const invalidSequences = [
    '00000000000000',
    '11111111111111',
    '22222222222222',
    '33333333333333',
    '44444444444444',
    '55555555555555',
    '66666666666666',
    '77777777777777',
    '88888888888888',
    '99999999999999'
  ];
  if (invalidSequences.includes(clean)) return false;

  // Validação do 1º Dígito Verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum1 = 0;
  for (let i = 0; i < 12; i++) {
    sum1 += parseInt(clean[i], 10) * weights1[i];
  }
  const mod1 = sum1 % 11;
  const digit1 = mod1 < 2 ? 0 : 11 - mod1;
  if (digit1 !== parseInt(clean[12], 10)) return false;

  // Validação do 2º Dígito Verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum2 = 0;
  for (let i = 0; i < 13; i++) {
    sum2 += parseInt(clean[i], 10) * weights2[i];
  }
  const mod2 = sum2 % 11;
  const digit2 = mod2 < 2 ? 0 : 11 - mod2;
  if (digit2 !== parseInt(clean[13], 10)) return false;

  return true;
}

export function formatCnpj(cnpj: string): string {
  const clean = cnpj.replace(/\D/g, '').slice(0, 14);
  return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}
