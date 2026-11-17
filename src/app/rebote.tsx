import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Pantalla } from '../componentes/Pantalla';
import { BORDE, MARGEN, colores, fuentes } from '../tema';

type Forma = 'circulo' | 'cuadrado' | 'pastilla';

type Props = {
  forma: Forma;
  color: string;
  nombre: string;
  amortiguacion: number; // mientras más bajo, más rebota
  rigidez: number; // mientras más alto, más rápido vuelve
  ancho: number;
  alto: number;
};

// Una figura que se encoge al presionar y rebota al soltar.
function FiguraRebote({ forma, color, nombre, amortiguacion, rigidez, ancho, alto }: Props) {
  const escala = useSharedValue(1);
  const [toques, setToques] = useState(0);

  const alPresionar = () => {
    // se achica rápido mientras el dedo está encima
    escala.value = withTiming(0.7, { duration: 120 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const alSoltar = () => {
    // al soltar vuelve al tamaño original con un resorte flojo = rebote
    escala.value = withSpring(1, { damping: amortiguacion, stiffness: rigidez, mass: 0.9 });
  };

  const estilo = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
  }));

  const radio = forma === 'circulo' ? 999 : forma === 'pastilla' ? 999 : 26;

  return (
    <View style={estilos.figuraContenedor}>
      <Pressable onPressIn={alPresionar} onPressOut={alSoltar} onPress={() => setToques((t) => t + 1)}>
        <Animated.View
          style={[
            {
              width: ancho,
              height: alto,
              borderRadius: radio,
              backgroundColor: color,
              borderWidth: BORDE,
              borderColor: colores.tinta,
              alignItems: 'center',
              justifyContent: 'center',
            },
            estilo,
          ]}
        >
          <Text style={estilos.toques}>{toques}</Text>
        </Animated.View>
      </Pressable>
      <Text style={estilos.nombre}>{nombre}</Text>
      <Text style={estilos.parametros}>
        amort. {amortiguacion} · rigidez {rigidez}
      </Text>
    </View>
  );
}

export default function Rebote() {
  return (
    <Pantalla ruta="rebote">
      <View style={estilos.contenido}>
        <View style={estilos.fila}>
          <FiguraRebote
            forma="circulo"
            color={colores.amarillo}
            nombre="Gelatina"
            amortiguacion={4}
            rigidez={150}
            ancho={170}
            alto={170}
          />
        </View>
        <View style={estilos.fila}>
          <FiguraRebote
            forma="cuadrado"
            color={colores.rosa}
            nombre="Nervioso"
            amortiguacion={2.5}
            rigidez={260}
            ancho={118}
            alto={118}
          />
          <FiguraRebote
            forma="pastilla"
            color={colores.cielo}
            nombre="Seco"
            amortiguacion={11}
            rigidez={320}
            ancho={130}
            alto={74}
          />
        </View>
        <Text style={estilos.pista}>Mantén presionado y suelta. El número cuenta tus toques.</Text>
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  contenido: { flex: 1, paddingHorizontal: MARGEN, justifyContent: 'space-evenly', paddingBottom: 24 },
  fila: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  figuraContenedor: { alignItems: 'center', gap: 6 },
  nombre: { fontFamily: fuentes.subtitulo, fontSize: 17, color: colores.tinta, marginTop: 8 },
  parametros: { fontFamily: fuentes.mono, fontSize: 11, color: colores.tintaSuave },
  toques: { fontFamily: fuentes.titulo, fontSize: 30, color: colores.tinta },
  pista: { fontFamily: fuentes.texto, fontSize: 13.5, color: colores.tintaSuave, textAlign: 'center' },
});
