import { useCallback, useState } from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Pantalla } from '../componentes/Pantalla';
import { Tarjeta } from '../componentes/Tarjeta';
import { MARGEN, colores, fuentes } from '../tema';

const PIEZAS_POR_EXPLOSION = 26;
const PALETA = [colores.naranja, colores.lima, colores.cielo, colores.amarillo, colores.rosa, colores.menta, colores.tinta];

type Pieza = {
  angulo: number; // hacia dónde sale
  distancia: number; // qué tan lejos llega
  giros: number; // vueltas que da
  tamano: number;
  color: string;
  redonda: boolean;
};

type Explosion = { id: number; x: number; y: number; piezas: Pieza[] };

function crearPiezas(): Pieza[] {
  return Array.from({ length: PIEZAS_POR_EXPLOSION }).map(() => ({
    angulo: Math.random() * Math.PI * 2,
    distancia: 70 + Math.random() * 130,
    giros: (Math.random() - 0.5) * 6,
    tamano: 8 + Math.random() * 10,
    color: PALETA[Math.floor(Math.random() * PALETA.length)],
    redonda: Math.random() > 0.6,
  }));
}

function PiezaConfeti({ pieza, alTerminar }: { pieza: Pieza; alTerminar?: () => void }) {
  const avance = useSharedValue(0); // de 0 a 1

  // arranca la animación apenas aparece la pieza
  useState(() => {
    avance.value = withTiming(1, { duration: 1100, easing: Easing.out(Easing.quad) }, (fin) => {
      if (fin && alTerminar) runOnJS(alTerminar)();
    });
  });

  const estilo = useAnimatedStyle(() => {
    const p = avance.value;
    return {
      opacity: 1 - p * p,
      transform: [
        { translateX: Math.cos(pieza.angulo) * pieza.distancia * p },
        // sube por el impulso y luego cae por la "gravedad" (p al cuadrado)
        { translateY: Math.sin(pieza.angulo) * pieza.distancia * p + 260 * p * p },
        { rotate: `${pieza.giros * p * 360}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: pieza.tamano,
          height: pieza.redonda ? pieza.tamano : pieza.tamano * 0.5,
          borderRadius: pieza.redonda ? pieza.tamano : 2,
          backgroundColor: pieza.color,
          borderWidth: 1.5,
          borderColor: colores.tinta,
        },
        estilo,
      ]}
    />
  );
}

export default function Confeti() {
  const [explosiones, setExplosiones] = useState<Explosion[]>([]);
  const [total, setTotal] = useState(0);

  const explotar = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    const nueva: Explosion = { id: Date.now() + Math.random(), x: locationX, y: locationY, piezas: crearPiezas() };
    setExplosiones((lista) => [...lista.slice(-4), nueva]); // dejo máximo 5 a la vez
    setTotal((t) => t + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const quitar = useCallback((id: number) => {
    setExplosiones((lista) => lista.filter((x) => x.id !== id));
  }, []);

  return (
    <Pantalla ruta="confeti">
      <View style={estilos.contenido}>
        <Tarjeta color={colores.blanco} llenar>
          <Pressable style={estilos.zona} onPress={explotar}>
            <Text style={estilos.palabra}>{total === 0 ? 'TOCA AQUÍ' : `${total} EXPLOSIONES`}</Text>
            {explosiones.map((ex) => (
              <View key={ex.id} pointerEvents="none" style={[estilos.origen, { left: ex.x, top: ex.y }]}>
                {ex.piezas.map((pz, i) => (
                  <PiezaConfeti key={i} pieza={pz} alTerminar={i === 0 ? () => quitar(ex.id) : undefined} />
                ))}
              </View>
            ))}
          </Pressable>
        </Tarjeta>
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  contenido: { flex: 1, paddingHorizontal: MARGEN, paddingBottom: 24 },
  zona: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  palabra: { fontFamily: fuentes.titulo, fontSize: 30, letterSpacing: -0.5, color: colores.papelOscuro },
  origen: { position: 'absolute', width: 0, height: 0 },
});
