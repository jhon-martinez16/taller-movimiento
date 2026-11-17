import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
} from 'react-native-reanimated';
import { Pantalla } from '../componentes/Pantalla';
import { Ficha } from '../componentes/Ficha';
import { Tarjeta } from '../componentes/Tarjeta';
import { TextoAnimado } from '../componentes/TextoAnimado';
import { BORDE, MARGEN, colores, fuentes } from '../tema';
import { limitar } from '../utilidades/limitar';

const TAMANO_FICHA = 104;
const GIRO_MAXIMO = 40; // grados máximos que se inclina

export default function Arrastrar() {
  const [pista, setPista] = useState({ ancho: 0, alto: 0 });

  // posición actual de la ficha (relativa al centro de la pista)
  const posX = useSharedValue(0);
  const posY = useSharedValue(0);
  // dónde estaba la ficha cuando empezó el arrastre
  const inicioX = useSharedValue(0);
  const inicioY = useSharedValue(0);
  // hasta dónde puede llegar sin salirse de la pista
  const limiteX = useSharedValue(0);
  const limiteY = useSharedValue(0);

  const giro = useSharedValue(0); // grados
  const escala = useSharedValue(1);
  const mirada = useSharedValue(0);

  const textoGiro = useDerivedValue(() => `${Math.round(giro.value)}°`);
  const textoPosicion = useDerivedValue(
    () => `x ${Math.round(posX.value)}  y ${Math.round(posY.value)}`
  );

  const alMedirPista = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setPista({ ancho: width, alto: height });
    limiteX.value = (width - TAMANO_FICHA) / 2 - 6;
    limiteY.value = (height - TAMANO_FICHA) / 2 - 6;
  };

  const arrastre = Gesture.Pan()
    .onBegin(() => {
      inicioX.value = posX.value;
      inicioY.value = posY.value;
      escala.value = withSpring(1.12, { damping: 12 });
    })
    .onUpdate((e) => {
      posX.value = limitar(inicioX.value + e.translationX, -limiteX.value, limiteX.value);
      posY.value = limitar(inicioY.value + e.translationY, -limiteY.value, limiteY.value);
      // Si el dedo va a la izquierda el giro es negativo, a la derecha positivo.
      giro.value = interpolate(
        e.translationX,
        [-160, 0, 160],
        [-GIRO_MAXIMO, 0, GIRO_MAXIMO],
        Extrapolation.CLAMP
      );
      mirada.value = limitar(e.translationX / 50, -1, 1);
    })
    .onEnd((e) => {
      // Al soltar, la ficha sigue de largo con inercia y rebota en los bordes de la pista
      posX.value = withDecay({
        velocity: e.velocityX,
        clamp: [-limiteX.value, limiteX.value],
        rubberBandEffect: true,
        rubberBandFactor: 0.6,
      });
      posY.value = withDecay({
        velocity: e.velocityY,
        clamp: [-limiteY.value, limiteY.value],
        rubberBandEffect: true,
        rubberBandFactor: 0.6,
      });
    })
    .onFinalize(() => {
      // al soltar vuelve derecha con un rebotico
      giro.value = withSpring(0, { damping: 6, stiffness: 140 });
      escala.value = withSpring(1, { damping: 10 });
      mirada.value = withSpring(0);
    });

  const estiloFicha = useAnimatedStyle(() => ({
    transform: [
      { translateX: posX.value },
      { translateY: posY.value },
      { rotate: `${giro.value}deg` },
      { scale: escala.value },
    ],
  }));

  const centrar = () => {
    posX.value = withSpring(0, { damping: 12 });
    posY.value = withSpring(0, { damping: 12 });
  };

  return (
    <Pantalla ruta="arrastrar">
      <View style={estilos.contenido}>
        <Tarjeta color={colores.blanco} llenar>
          <View style={estilos.pista} onLayout={alMedirPista}>
            {/* cuadrícula de fondo, solo decoración */}
            {pista.ancho > 0 &&
              Array.from({ length: Math.floor(pista.alto / 36) }).map((_, i) => (
                <View key={i} style={[estilos.lineaH, { top: (i + 1) * 36 }]} />
              ))}
            {pista.ancho > 0 &&
              Array.from({ length: Math.floor(pista.ancho / 36) }).map((_, i) => (
                <View key={i} style={[estilos.lineaV, { left: (i + 1) * 36 }]} />
              ))}

            <Text style={estilos.pistaTexto}>PISTA</Text>

            <GestureDetector gesture={arrastre}>
              <Animated.View style={[estilos.ficha, estiloFicha]}>
                <Ficha tamano={TAMANO_FICHA} mirada={mirada} expresion="feliz" />
              </Animated.View>
            </GestureDetector>
          </View>
        </Tarjeta>

        <View style={estilos.datos}>
          <View style={estilos.dato}>
            <Text style={estilos.datoEtiqueta}>GIRO</Text>
            <TextoAnimado texto={textoGiro} style={estilos.datoValor} />
          </View>
          <View style={[estilos.dato, { flex: 1.6 }]}>
            <Text style={estilos.datoEtiqueta}>POSICIÓN</Text>
            <TextoAnimado texto={textoPosicion} style={estilos.datoValor} />
          </View>
          <Pressable onPress={centrar} style={({ pressed }) => [estilos.boton, pressed && { opacity: 0.7 }]}>
            <Text style={estilos.botonTexto}>Centrar</Text>
          </Pressable>
        </View>
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  contenido: { flex: 1, paddingHorizontal: MARGEN, paddingBottom: 18 },
  pista: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ficha: { position: 'absolute' },
  lineaH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: colores.papelOscuro },
  lineaV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: colores.papelOscuro },
  pistaTexto: {
    position: 'absolute',
    top: 12,
    left: 14,
    fontFamily: fuentes.monoMedio,
    fontSize: 11,
    letterSpacing: 2,
    color: colores.tintaSuave,
  },
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
    backgroundColor: colores.naranja,
    borderWidth: BORDE,
    borderColor: colores.tinta,
    borderRadius: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonTexto: { fontFamily: fuentes.subtitulo, fontSize: 14, color: colores.tinta },
});
