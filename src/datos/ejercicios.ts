import type { ComponentProps } from 'react';
import type { Feather } from '@expo/vector-icons';
import { colores } from '../tema';

type NombreIcono = ComponentProps<typeof Feather>['name'];

export type Ejercicio = {
  ruta: string; // nombre del archivo dentro de src/app
  numero: number;
  titulo: string;
  resumen: string; // frase corta para la tarjeta del inicio
  consigna: string; // lo que se pide en la actividad
  color: string;
  icono: NombreIcono;
  extra?: boolean; // true = pantalla de bonus, no es parte de los 7 pedidos
};

// Lista de los ejercicios. El menú lateral y el inicio se arman con esto.
export const EJERCICIOS: Ejercicio[] = [
  {
    ruta: 'arrastrar',
    numero: 1,
    titulo: 'Arrastrar y girar',
    resumen: 'Mueve la ficha y mira cómo se inclina.',
    consigna: 'Arrastra la ficha por la pista. Hacia la izquierda gira a la izquierda, hacia la derecha gira a la derecha.',
    color: colores.naranja,
    icono: 'move',
  },
  {
    ruta: 'carga',
    numero: 2,
    titulo: 'Carga infinita',
    resumen: 'Un spinner y una barra que nunca paran.',
    consigna: 'El spinner arranca solo al entrar, y la barra de progreso se llena al mismo tiempo.',
    color: colores.lima,
    icono: 'loader',
  },
  {
    ruta: 'multitactil',
    numero: 3,
    titulo: 'Multitáctil',
    resumen: 'Zoom, giro y movimiento con los dedos.',
    consigna: 'Usa dos dedos para acercar, alejar y rotar la imagen. Con uno la mueves. Doble toque para volver.',
    color: colores.cielo,
    icono: 'maximize-2',
  },
  {
    ruta: 'rebote',
    numero: 4,
    titulo: 'Rebote',
    resumen: 'Se encoge al tocar, rebota al soltar.',
    consigna: 'Mantén presionada una figura: se hace pequeña. Al soltarla vuelve a su tamaño rebotando.',
    color: colores.amarillo,
    icono: 'circle',
  },
  {
    ruta: 'carrusel',
    numero: 5,
    titulo: 'Carrusel',
    resumen: 'Cartas con escala, giro y transición.',
    consigna: 'Desliza las cartas de lado. La del centro crece y las de los lados se inclinan y se achican.',
    color: colores.rosa,
    icono: 'layers',
  },
  {
    ruta: 'sacudida',
    numero: 6,
    titulo: 'Sacudida',
    resumen: 'Agita el celular y la ficha se marea.',
    consigna: 'Sacude el celular de verdad. El acelerómetro lo detecta y la figura tiembla.',
    color: colores.menta,
    icono: 'smartphone',
  },
];

// Pantallas de bonus: van aparte en el menú para no mezclarlas con los 7 ejercicios.
export const EXTRAS: Ejercicio[] = [
  {
    ruta: 'deslizar',
    numero: 7,
    titulo: 'Deslizar para borrar',
    resumen: 'Lista con tarjetas que se van de lado.',
    consigna: 'Desliza una tarea hacia la izquierda para borrarla. Si no llegas hasta el final, regresa sola.',
    color: colores.rosa,
    icono: 'trash-2',
    extra: true,
  },
  {
    ruta: 'confeti',
    numero: 8,
    titulo: 'Confeti',
    resumen: 'Toca y estalla una lluvia de piezas.',
    consigna: 'Toca cualquier punto de la tarjeta: sale una explosión de confeti desde ahí, con gravedad y giro.',
    color: colores.amarillo,
    icono: 'gift',
    extra: true,
  },
];

export function buscarEjercicio(ruta: string): Ejercicio {
  return [...EJERCICIOS, ...EXTRAS].find((e) => e.ruta === ruta) ?? EJERCICIOS[0];
}
