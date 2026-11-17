import { useWindowDimensions, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Pantalla } from '../componentes/Pantalla';
import { BORDE, MARGEN, colores, fuentes } from '../tema';
import type { ComponentProps } from 'react';

type Carta = {
  id: string;
  numero: string;
  titulo: string;
  texto: string;
  color: string;
  icono: ComponentProps<typeof Feather>['name'];
};

// Las cartas hablan de los principios de la animación (los de los dibujos animados clásicos)
const CARTAS: Carta[] = [
  {
    id: 'aplastar',
    numero: '01',
    titulo: 'Aplastar y estirar',
    texto: 'Lo blando se deforma al moverse, pero conserva su volumen.',
    color: colores.naranja,
    icono: 'minimize-2',
  },
  {
    id: 'anticipacion',
    numero: '02',
    titulo: 'Anticipación',
    texto: 'Un pequeño gesto previo avisa lo que está por pasar.',
    color: colores.amarillo,
    icono: 'rewind',
  },
  {
    id: 'seguimiento',
    numero: '03',
    titulo: 'Seguimiento',
    texto: 'Las partes sueltas llegan un instante después del cuerpo.',
    color: colores.lima,
    icono: 'wind',
  },
  {
    id: 'arcos',
    numero: '04',
    titulo: 'Arcos',
    texto: 'Casi nada natural se mueve en línea recta: se mueve en curva.',
    color: colores.cielo,
    icono: 'git-commit',
  },
  {
    id: 'tiempo',
    numero: '05',
    titulo: 'Tiempo',
    texto: 'La velocidad cuenta el peso y el ánimo de un objeto.',
    color: colores.rosa,
    icono: 'clock',
  },
  {
    id: 'exageracion',
    numero: '06',
    titulo: 'Exageración',
    texto: 'Un poco de más hace que el movimiento se lea mejor.',
    color: colores.menta,
    icono: 'zap',
  },
];

const SEPARACION = 14;

type PropsCarta = {
  carta: Carta;
  indice: number;
  desplazamiento: SharedValue<number>;
  ancho: number;
  alto: number;
};

function CartaAnimada({ carta, indice, desplazamiento, ancho, alto }: PropsCarta) {
  const paso = ancho + SEPARACION;
  // posiciones de scroll donde esta carta está a la derecha, al centro y a la izquierda
  const entrada = [(indice - 1) * paso, indice * paso, (indice + 1) * paso];

  const estiloCarta = useAnimatedStyle(() => ({
    opacity: interpolate(desplazamiento.value, entrada, [0.55, 1, 0.55], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(desplazamiento.value, entrada, [34, 0, 34], Extrapolation.CLAMP) },
      { scale: interpolate(desplazamiento.value, entrada, [0.78, 1, 0.78], Extrapolation.CLAMP) },
      { rotate: `${interpolate(desplazamiento.value, entrada, [9, 0, -9], Extrapolation.CLAMP)}deg` },
    ],
  }));

  // el ícono se mueve un poco distinto al resto (efecto de profundidad)
  const estiloIcono = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(desplazamiento.value, entrada, [70, 0, -70], Extrapolation.CLAMP) },
      { rotate: `${interpolate(desplazamiento.value, entrada, [40, 0, -40], Extrapolation.CLAMP)}deg` },
    ],
  }));

  return (
    <Animated.View style={[{ width: ancho, height: alto, marginRight: SEPARACION }, estiloCarta]}>
      <View style={estilos.sombraCarta} />
      <View style={[estilos.carta, { backgroundColor: carta.color }]}>
        <Text style={estilos.numero}>{carta.numero}</Text>
        <Animated.View style={[estilos.circuloIcono, estiloIcono]}>
          <Feather name={carta.icono} size={44} color={colores.tinta} />
        </Animated.View>
        <View>
          <Text style={estilos.tituloCarta}>{carta.titulo}</Text>
          <Text style={estilos.textoCarta}>{carta.texto}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

function Punto({ indice, desplazamiento, paso }: { indice: number; desplazamiento: SharedValue<number>; paso: number }) {
  const entrada = [(indice - 1) * paso, indice * paso, (indice + 1) * paso];
  const estilo = useAnimatedStyle(() => ({
    width: interpolate(desplazamiento.value, entrada, [10, 32, 10], Extrapolation.CLAMP),
    backgroundColor: desplazamiento.value > (indice - 0.5) * paso && desplazamiento.value < (indice + 0.5) * paso
      ? colores.tinta
      : colores.papelOscuro,
  }));
  return <Animated.View style={[estilos.punto, estilo]} />;
}

export default function Carrusel() {
  const { width: anchoPantalla } = useWindowDimensions();
  const anchoCarta = Math.min(anchoPantalla * 0.68, 300);
  const altoCarta = Math.min(anchoCarta * 1.3, 400);
  const paso = anchoCarta + SEPARACION;
  const margenLateral = (anchoPantalla - anchoCarta) / 2;

  const desplazamiento = useSharedValue(0);
  const alDesplazar = useAnimatedScrollHandler((e) => {
    desplazamiento.value = e.contentOffset.x;
  });

  return (
    <Pantalla ruta="carrusel">
      <View style={estilos.contenido}>
        <Animated.FlatList
          data={CARTAS}
          keyExtractor={(c) => c.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={paso}
          decelerationRate="fast"
          onScroll={alDesplazar}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: margenLateral, paddingTop: 20, paddingBottom: 20 }}
          style={{ flexGrow: 0 }}
          renderItem={({ item, index }) => (
            <CartaAnimada
              carta={item}
              indice={index}
              desplazamiento={desplazamiento}
              ancho={anchoCarta}
              alto={altoCarta}
            />
          )}
        />

        <View style={estilos.puntos}>
          {CARTAS.map((c, i) => (
            <Punto key={c.id} indice={i} desplazamiento={desplazamiento} paso={paso} />
          ))}
        </View>
        <Text style={estilos.pista}>Desliza hacia los lados</Text>
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  contenido: { flex: 1, justifyContent: 'center', paddingBottom: 30 },
  sombraCarta: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    borderRadius: 26,
    backgroundColor: colores.tinta,
  },
  carta: {
    flex: 1,
    borderRadius: 26,
    borderWidth: BORDE,
    borderColor: colores.tinta,
    padding: 18,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  numero: { fontFamily: fuentes.titulo, fontSize: 52, letterSpacing: -2, color: colores.tinta },
  circuloIcono: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colores.blanco,
    borderWidth: BORDE,
    borderColor: colores.tinta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloCarta: { fontFamily: fuentes.titulo, fontSize: 24, lineHeight: 27, letterSpacing: -0.5, color: colores.tinta },
  textoCarta: { fontFamily: fuentes.texto, fontSize: 13.5, lineHeight: 18, color: colores.tinta, marginTop: 6, opacity: 0.85 },
  puntos: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 6 },
  punto: { height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: colores.tinta },
  pista: { textAlign: 'center', marginTop: 12, fontFamily: fuentes.mono, fontSize: 12, letterSpacing: 1, color: colores.tintaSuave },
});
