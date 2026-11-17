// Deja un número dentro de un rango. Lleva 'worklet' para poder usarla en gestos.
export function limitar(valor: number, minimo: number, maximo: number): number {
  'worklet';
  return Math.min(Math.max(valor, minimo), maximo);
}
