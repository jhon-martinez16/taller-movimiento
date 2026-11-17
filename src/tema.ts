// Aquí quedan todos los colores, fuentes y medidas de la app.
// Si quiero cambiar el estilo completo, solo toco este archivo.

export const colores = {
  papel: '#F3ECDD', // fondo general, un crema tipo cuaderno
  papelOscuro: '#E6DCC6',
  tinta: '#17140F', // casi negro, para bordes y textos
  tintaSuave: '#5B5446',
  blanco: '#FFFDF7',
  naranja: '#FF5B2E',
  lima: '#C6F25B',
  cielo: '#76C6F5',
  amarillo: '#FFC62E',
  rosa: '#FF9EC4',
  menta: '#6FE0B0',
} as const;

// Los nombres coinciden con lo que carga _layout.tsx
export const fuentes = {
  titulo: 'BricolageGrotesque_800ExtraBold',
  subtitulo: 'BricolageGrotesque_700Bold',
  semi: 'BricolageGrotesque_600SemiBold',
  texto: 'BricolageGrotesque_500Medium',
  mono: 'DMMono_400Regular',
  monoMedio: 'DMMono_500Medium',
} as const;

export const BORDE = 2.5; // grosor del borde de las tarjetas
export const RADIO = 22; // esquinas redondeadas
export const MARGEN = 20; // margen lateral de las pantallas
