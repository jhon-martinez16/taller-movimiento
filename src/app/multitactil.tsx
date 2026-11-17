import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Pantalla } from '../componentes/Pantalla';
import { Tarjeta } from '../componentes/Tarjeta';
import { TextoAnimado } from '../componentes/TextoAnimado';
import { BORDE, MARGEN, colores, fuentes } from '../tema';
import { limitar } from '../utilidades/limitar';

const ESCALA_MIN = 0.5;
const ESCALA_MAX = 5;

export default function Multitactil() {
  // valores "en vivo" que se ven en pantalla
  const escala = useSharedValue(1);
  const giro = useSharedValue(0); // en radianes
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  // valores "guardados" donde terminó el gesto anterior
  const escalaGuardada = useSharedValue(1);
  const giroGuardado = useSharedValue(0);
  const xGuardado = useSharedValue(0);
  const yGuardado = useSharedValue(0);

  const mover = Gesture.Pan()
    .onUpdate((e) => {
      x.value = xGuardado.value + e.translationX;
      y.value = yGuardado.value + e.translationY;
    })
    .onEnd(() => {
      xGuardado.value = x.value;
      yGuardado.value = y.value;
    });

  const acercar = Gesture.Pinch()
    .onUpdate((e) => {
      escala.value = limitar(escalaGuardada.value * e.scale, ESCALA_MIN, ESCALA_MAX);
    })
    .onEnd(() => {
      escalaGuardada.value = escala.value;
    });

  const rotar = Gesture.Rotation()
    .onUpdate((e) => {
      giro.value = giroGuardado.value + e.rotation;
    })
    .onEnd(() => {
      giroGuardado.value = giro.value;
    });

  const restablecer = () => {
    'worklet';
    const resorte = { damping: 14, stiffness: 120 };
    escala.value = withSpring(1, resorte);
    giro.value = withSpring(0, resorte);
    x.value = withSpring(0, resorte);
    y.value = withSpring(0, resorte);
    escalaGuardada.value = 1;
    giroGuardado.value = 0;
    xGuardado.value = 0;
    yGuardado.value = 0;
  };

  const dobleToque = Gesture.Tap().numberOfTaps(2).onEnd(() => {
    restablecer();
  });

  // los tres gestos pueden pasar a la vez; el doble toque tiene prioridad
  const gestoFinal = Gesture.Exclusive(dobleToque, Gesture.Simultaneous(mover, acercar, rotar));

  const estiloImagen = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: escala.value },
      { rotate: `${giro.value}rad` },
    ],
  }));

  const textoZoom = useDerivedValue(() => `${escala.value.toFixed(2)}x`);
  const textoGrados = useDerivedValue(() => {
    const grados = Math.round((giro.value * 180) / Math.PI);
    return `${grados}°`;
  });

  return (
    <Pantalla ruta="multitactil">
      <View style={estilos.contenido}>
        <Tarjeta color={colores.tinta} llenar>
          <GestureDetector gesture={gestoFinal}>
            <View style={estilos.visor}>
              <Animated.Image
                source={require('../../assets/images/paisaje.png')}
                style={[estilos.imagen, estiloImagen]}
                resizeMode="contain"
              />
              <View style={estilos.marcaCentro} pointerEvents="none">
                <View style={estilos.cruzH} />
                <View style={estilos.cruzV} />
              </View>
            </View>
          </GestureDetector>
        </Tarjeta>

        <View style={estilos.datos}>
          <View style={estilos.dato}>
            <Text style={estilos.datoEtiqueta}>ZOOM</Text>
            <TextoAnimado texto={textoZoom} style={estilos.datoValor} />
          </View>
          <View style={estilos.dato}>
            <Text style={estilos.datoEtiqueta}>GIRO</Text>
            <TextoAnimado texto={textoGrados} style={estilos.datoValor} />
          </View>
          <Pressable
            onPress={() => restablecer()}
            style={({ pressed }) => [estilos.boton, pressed && { opacity: 0.7 }]}
          >
            <Text style={estilos.botonTexto}>Restablecer</Text>
          </Pressable>
        </View>
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  contenido: { flex: 1, paddingHorizontal: MARGEN, paddingBottom: 18 },
  visor: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  imagen: { width: '78%', height: '78%' },
  marcaCentro: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  cruzH: { position: 'absolute', width: 18, height: 2, backgroundColor: colores.blanco, opacity: 0.55 },
  cruzV: { position: 'absolute', width: 2, height: 18, backgroundColor: colores.blanco, opacity: 0.55 },
  datos: { flexDirection: 'row', alignItems: 'stretch', gap: 10, marginTop: 6 },
  dato: {
    flex: 1,
    backgroundColor: colores.blanco,
    borderWidth: BORDE,
    borderColor: colores.tinta,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  datoEtiqueta: { fontFamily: fuentes.mono, fontSize: 10, letterSpacing: 1.5, color: colores.tintaSuave },
  datoValor: { fontFamily: fuentes.monoMedio, fontSize: 15, color: colores.tinta, marginTop: 2 },
  boton: {
    backgroundColor: colores.cielo,
    borderWidth: BORDE,
    borderColor: colores.tinta,
    borderRadius: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonTexto: { fontFamily: fuentes.subtitulo, fontSize: 14, color: colores.tinta },
});
