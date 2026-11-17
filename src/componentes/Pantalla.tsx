import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DrawerNavigationProp } from 'expo-router/drawer';
import { useNavigation } from 'expo-router';
import { BORDE, MARGEN, colores, fuentes } from '../tema';
import { EJERCICIOS, buscarEjercicio } from '../datos/ejercicios';

type Props = {
  ruta: string; // nombre del ejercicio, por ejemplo 'arrastrar'
  children: ReactNode;
};

// Marco común de todos los ejercicios: botón de menú, número, título y consigna.
export function Pantalla({ ruta, children }: Props) {
  const insets = useSafeAreaInsets();
  const navegacion = useNavigation<DrawerNavigationProp<Record<string, undefined>>>();
  const ejercicio = buscarEjercicio(ruta);

  return (
    <View style={[estilos.fondo, { paddingTop: insets.top + 10 }]}>
      <View style={estilos.encabezado}>
        <Pressable
          onPress={() => navegacion.openDrawer()}
          accessibilityLabel="Abrir menú"
          style={({ pressed }) => [estilos.botonMenu, pressed && { transform: [{ translateY: 2 }] }]}
        >
          <Feather name="menu" size={22} color={colores.tinta} />
        </Pressable>
        <View style={[estilos.etiqueta, { backgroundColor: ejercicio.color }]}>
          <Text style={estilos.etiquetaTexto}>
            {ejercicio.extra
              ? 'EXTRA'
              : `${String(ejercicio.numero).padStart(2, '0')} / ${String(EJERCICIOS.length).padStart(2, '0')}`}
          </Text>
        </View>
      </View>

      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{ejercicio.titulo}</Text>
        <View style={estilos.consignaFila}>
          <View style={[estilos.barra, { backgroundColor: ejercicio.color }]} />
          <Text style={estilos.consigna}>{ejercicio.consigna}</Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: colores.papel },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: MARGEN,
  },
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
  etiqueta: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: BORDE,
    borderColor: colores.tinta,
  },
  etiquetaTexto: { fontFamily: fuentes.monoMedio, fontSize: 13, color: colores.tinta },
  textos: { paddingHorizontal: MARGEN, marginTop: 14, marginBottom: 14 },
  titulo: {
    fontFamily: fuentes.titulo,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -1,
    color: colores.tinta,
  },
  consignaFila: { flexDirection: 'row', gap: 10, marginTop: 8 },
  barra: { width: 5, borderRadius: 3 },
  consigna: {
    flex: 1,
    fontFamily: fuentes.texto,
    fontSize: 14.5,
    lineHeight: 20,
    color: colores.tintaSuave,
  },
});
