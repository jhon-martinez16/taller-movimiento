import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useRouter, useNavigation } from 'expo-router';
import type { DrawerNavigationProp } from 'expo-router/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ficha } from '../componentes/Ficha';
import { Tarjeta } from '../componentes/Tarjeta';
import { EJERCICIOS, EXTRAS, Ejercicio } from '../datos/ejercicios';
import { BORDE, MARGEN, colores, fuentes } from '../tema';

function TarjetaEjercicio({ ejercicio, orden }: { ejercicio: Ejercicio; orden: number }) {
  const router = useRouter();
  const escala = useSharedValue(1);
  const estilo = useAnimatedStyle(() => ({ transform: [{ scale: escala.value }] }));

  return (
    <Animated.View entering={FadeInDown.delay(180 + orden * 70).springify().damping(14)} style={estilos.celda}>
      <Animated.View style={estilo}>
        <Pressable
          onPressIn={() => (escala.value = withTiming(0.96, { duration: 90 }))}
          onPressOut={() => (escala.value = withSpring(1, { damping: 8 }))}
          onPress={() => router.navigate(`/${ejercicio.ruta}` as never)}
        >
          <Tarjeta color={ejercicio.color} relieve={4} estiloInterno={estilos.tarjeta}>
            <View style={estilos.tarjetaArriba}>
              <Text style={estilos.tarjetaNumero}>{ejercicio.extra ? '+' : String(ejercicio.numero).padStart(2, '0')}</Text>
              <Feather name={ejercicio.icono} size={22} color={colores.tinta} />
            </View>
            <Text style={estilos.tarjetaTitulo}>{ejercicio.titulo}</Text>
            <Text style={estilos.tarjetaResumen}>{ejercicio.resumen}</Text>
          </Tarjeta>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

export default function Inicio() {
  const insets = useSafeAreaInsets();
  const navegacion = useNavigation<DrawerNavigationProp<Record<string, undefined>>>();

  // la ficha del inicio flota suavemente
  const flotar = useSharedValue(0);
  const inclinar = useSharedValue(0);
  useEffect(() => {
    flotar.value = withRepeat(withTiming(-10, { duration: 1400, easing: Easing.inOut(Easing.sin) }), -1, true);
    inclinar.value = withRepeat(
      withSequence(withTiming(-6, { duration: 1800 }), withTiming(6, { duration: 1800 })),
      -1,
      true
    );
  }, [flotar, inclinar]);
  const estiloFlotar = useAnimatedStyle(() => ({
    transform: [{ translateY: flotar.value }, { rotate: `${inclinar.value}deg` }],
  }));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colores.papel }}
      contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 30 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={estilos.barraSuperior}>
        <Pressable onPress={() => navegacion.openDrawer()} style={estilos.botonMenu} accessibilityLabel="Abrir menú">
          <Feather name="menu" size={22} color={colores.tinta} />
        </Pressable>
        <View style={estilos.sello}>
          <Text style={estilos.selloTexto}>REANIMATED 4</Text>
        </View>
      </View>

      <View style={estilos.portada}>
        <View style={{ flex: 1 }}>
          <Text style={estilos.tituloGrande}>Taller de{'\n'}movimiento</Text>
          <Text style={estilos.bajada}>
            Seis experimentos con animaciones, gestos y sensores. Elige uno o abre el menú lateral.
          </Text>
        </View>
        <Animated.View style={estiloFlotar}>
          <Ficha tamano={92} />
        </Animated.View>
      </View>

      <View style={estilos.rejilla}>
        {EJERCICIOS.map((e, i) => (
          <TarjetaEjercicio key={e.ruta} ejercicio={e} orden={i} />
        ))}
      </View>

      {/* Ejercicio 7: el propio menú lateral */}
      <Animated.View entering={FadeInDown.delay(180 + 8 * 70).springify().damping(14)} style={{ paddingHorizontal: MARGEN }}>
        <Pressable onPress={() => navegacion.openDrawer()}>
          <Tarjeta color={colores.tinta} estiloInterno={estilos.tarjetaMenu} relieve={4} radio={20}>
            <View style={{ flex: 1 }}>
              <Text style={estilos.menuNumero}>07 · DRAWER NAVIGATION</Text>
              <Text style={estilos.menuTitulo}>El menú lateral</Text>
              <Text style={estilos.menuTexto}>Tócame o desliza desde el borde izquierdo para saltar entre ejercicios.</Text>
            </View>
            <View style={estilos.menuIcono}>
              <Feather name="sidebar" size={24} color={colores.tinta} />
            </View>
          </Tarjeta>
        </Pressable>
      </Animated.View>

      <Text style={estilos.seccionExtras}>EXTRAS · BONUS</Text>
      <View style={estilos.rejilla}>
        {EXTRAS.map((e, i) => (
          <TarjetaEjercicio key={e.ruta} ejercicio={e} orden={i + 6} />
        ))}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  seccionExtras: { fontFamily: fuentes.monoMedio, fontSize: 12, letterSpacing: 2, color: colores.tintaSuave, marginHorizontal: MARGEN, marginTop: 14, marginBottom: 10 },
  barraSuperior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: MARGEN },
  botonMenu: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: BORDE,
    borderColor: colores.tinta,
    backgroundColor: colores.blanco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sello: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: BORDE,
    borderColor: colores.tinta,
    backgroundColor: colores.lima,
  },
  selloTexto: { fontFamily: fuentes.monoMedio, fontSize: 12, letterSpacing: 1.5, color: colores.tinta },
  portada: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: MARGEN, marginTop: 26, marginBottom: 26 },
  tituloGrande: { fontFamily: fuentes.titulo, fontSize: 44, lineHeight: 46, letterSpacing: -1.8, color: colores.tinta },
  bajada: { fontFamily: fuentes.texto, fontSize: 15, lineHeight: 21, color: colores.tintaSuave, marginTop: 12 },
  rejilla: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: MARGEN - 6, marginBottom: 6 },
  celda: { width: '50%', paddingHorizontal: 6, paddingBottom: 8 },
  tarjeta: { padding: 14, minHeight: 168 },
  tarjetaArriba: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  tarjetaNumero: { fontFamily: fuentes.titulo, fontSize: 34, lineHeight: 36, letterSpacing: -1, color: colores.tinta },
  tarjetaTitulo: { fontFamily: fuentes.titulo, fontSize: 20, lineHeight: 22, letterSpacing: -0.4, color: colores.tinta },
  tarjetaResumen: { fontFamily: fuentes.texto, fontSize: 12.5, lineHeight: 17, color: colores.tinta, opacity: 0.8, marginTop: 6 },
  tarjetaMenu: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  menuNumero: { fontFamily: fuentes.monoMedio, fontSize: 11, letterSpacing: 1.5, color: colores.lima },
  menuTitulo: { fontFamily: fuentes.titulo, fontSize: 24, color: colores.papel, marginTop: 4 },
  menuTexto: { fontFamily: fuentes.texto, fontSize: 13, lineHeight: 18, color: colores.papelOscuro, marginTop: 4 },
  menuIcono: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colores.lima,
    borderWidth: BORDE,
    borderColor: colores.papel,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
