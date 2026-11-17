import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { TextoAnimado } from './TextoAnimado';
import { BORDE, colores, fuentes } from '../tema';

const PUNTOS = 10; // cuántos puntos tiene el spinner
const DIAMETRO = 132;

// Spinner de puntos con "cola de cometa" + barra de progreso.
// Las dos animaciones arrancan solas cuando el componente se monta.
export function Cargador() {
  const vuelta = useSharedValue(0);
  const progreso = useSharedValue(0);

  useEffect(() => {
    // Spinner: gira 360° una y otra vez, sin parar (-1 = infinito)
    vuelta.value = withRepeat(withTiming(360, { duration: 1300, easing: Easing.linear }), -1, false);

    // Barra: sube a 100%, se queda un momento y vuelve a empezar
    progreso.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3400, easing: Easing.inOut(Easing.cubic) }),
        withDelay(600, withTiming(0, { duration: 0 }))
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(vuelta);
      cancelAnimation(progreso);
    };
  }, [vuelta, progreso]);

  const estiloSpinner = useAnimatedStyle(() => ({
    transform: [{ rotate: `${vuelta.value}deg` }],
  }));

  const estiloRelleno = useAnimatedStyle(() => ({
    width: `${progreso.value * 100}%`,
  }));

  const textoPorcentaje = useDerivedValue(() => `${Math.round(progreso.value * 100)}%`);

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.zonaSpinner}>
        <Animated.View style={[{ width: DIAMETRO, height: DIAMETRO }, estiloSpinner]}>
          {Array.from({ length: PUNTOS }).map((_, i) => {
            const angulo = (i / PUNTOS) * Math.PI * 2;
            const radio = DIAMETRO / 2 - 14;
            const tamano = 6 + (i / (PUNTOS - 1)) * 17; // del más chico al más grande
            return (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  width: tamano,
                  height: tamano,
                  borderRadius: tamano,
                  backgroundColor: i === PUNTOS - 1 ? colores.naranja : colores.tinta,
                  opacity: 0.25 + (i / (PUNTOS - 1)) * 0.75,
                  left: DIAMETRO / 2 + Math.cos(angulo) * radio - tamano / 2,
                  top: DIAMETRO / 2 + Math.sin(angulo) * radio - tamano / 2,
                }}
              />
            );
          })}
        </Animated.View>
        <Text style={estilos.palabra}>CARGANDO</Text>
      </View>

      <View style={estilos.zonaBarra}>
        <View style={estilos.encabezadoBarra}>
          <Text style={estilos.etiquetaBarra}>PROGRESO</Text>
          <TextoAnimado texto={textoPorcentaje} style={estilos.porcentaje} />
        </View>
        <View style={estilos.riel}>
          <Animated.View style={[estilos.relleno, estiloRelleno]} />
        </View>
        <View style={estilos.reglaMarcas}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} style={estilos.marca} />
          ))}
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { gap: 36 },
  zonaSpinner: { alignItems: 'center', justifyContent: 'center', gap: 18 },
  palabra: { fontFamily: fuentes.monoMedio, fontSize: 13, letterSpacing: 4, color: colores.tinta },
  zonaBarra: { gap: 8 },
  encabezadoBarra: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  etiquetaBarra: { fontFamily: fuentes.mono, fontSize: 11, letterSpacing: 2, color: colores.tintaSuave },
  porcentaje: { fontFamily: fuentes.titulo, fontSize: 30, color: colores.tinta, textAlign: 'right', minWidth: 80 },
  riel: {
    height: 30,
    borderRadius: 15,
    borderWidth: BORDE,
    borderColor: colores.tinta,
    backgroundColor: colores.blanco,
    overflow: 'hidden',
  },
  relleno: { height: '100%', backgroundColor: colores.naranja, borderRightWidth: BORDE, borderColor: colores.tinta },
  reglaMarcas: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2 },
  marca: { width: 2, height: 8, backgroundColor: colores.tintaSuave },
});
