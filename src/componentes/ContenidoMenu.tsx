import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DrawerContentScrollView } from 'expo-router/drawer';
import type { DrawerContentComponentProps } from 'expo-router/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ficha } from './Ficha';
import { BORDE, colores, fuentes } from '../tema';
import { EJERCICIOS, EXTRAS, Ejercicio } from '../datos/ejercicios';

// Menú lateral hecho a mano (ejercicio 7: Drawer Navigation).
export function ContenidoMenu({ state, navigation }: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const rutaActual = state.routes[state.index]?.name;

  const ir = (ruta: string) => navigation.navigate(ruta);

  const renderItem = (e: Ejercicio) => {
    const activo = rutaActual === e.ruta;
    return (
      <Pressable
        key={e.ruta}
        onPress={() => ir(e.ruta)}
        style={[estilos.item, activo && { backgroundColor: e.color, borderColor: colores.tinta }]}
      >
        <View style={[estilos.icono, { backgroundColor: activo ? colores.blanco : e.color }]}>
          {e.extra ? (
            <Feather name={e.icono} size={17} color={colores.tinta} />
          ) : (
            <Text style={estilos.numero}>{e.numero}</Text>
          )}
        </View>
        <Text style={estilos.itemTexto}>{e.titulo}</Text>
        <Feather name="arrow-right" size={16} color={activo ? colores.tinta : colores.tintaSuave} />
      </Pressable>
    );
  };

  return (
    <View style={estilos.fondo}>
      <View style={[estilos.cabecera, { paddingTop: insets.top + 18 }]}>
        <Ficha tamano={58} />
        <View style={{ flex: 1 }}>
          <Text style={estilos.nombreApp}>Taller de{'\n'}movimiento</Text>
        </View>
      </View>
      <Text style={estilos.subcabecera}>REANIMATED 4 · GESTOS · SENSORES</Text>

      <DrawerContentScrollView
        contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 14, paddingBottom: insets.bottom + 10 }}
      >
        <Pressable
          onPress={() => ir('index')}
          style={[estilos.item, rutaActual === 'index' && { backgroundColor: colores.amarillo, borderColor: colores.tinta }]}
        >
          <View style={estilos.icono}>
            <Feather name="home" size={18} color={colores.tinta} />
          </View>
          <Text style={estilos.itemTexto}>Inicio</Text>
        </Pressable>

        <Text style={estilos.seccion}>EJERCICIOS</Text>

        {EJERCICIOS.map(renderItem)}

        <Text style={estilos.seccion}>EXTRAS</Text>
        {EXTRAS.map(renderItem)}
      </DrawerContentScrollView>

      <View style={[estilos.pie, { paddingBottom: insets.bottom + 14 }]}>
        <Text style={estilos.pieTexto}>Este menú es el ejercicio 7:{'\n'}Drawer Navigation.</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: colores.papel },
  cabecera: {
    backgroundColor: colores.tinta,
    paddingHorizontal: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  nombreApp: { fontFamily: fuentes.titulo, fontSize: 24, lineHeight: 26, letterSpacing: -0.5, color: colores.papel },
  subcabecera: {
    backgroundColor: colores.naranja,
    color: colores.tinta,
    fontFamily: fuentes.monoMedio,
    fontSize: 10.5,
    letterSpacing: 1.4,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderBottomWidth: BORDE,
    borderColor: colores.tinta,
  },
  seccion: { fontFamily: fuentes.mono, fontSize: 11, letterSpacing: 2, color: colores.tintaSuave, marginTop: 18, marginBottom: 8, marginLeft: 6 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: BORDE,
    borderColor: 'transparent',
    marginBottom: 4,
  },
  icono: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: BORDE,
    borderColor: colores.tinta,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.amarillo,
  },
  numero: { fontFamily: fuentes.titulo, fontSize: 17, color: colores.tinta },
  itemTexto: { flex: 1, fontFamily: fuentes.subtitulo, fontSize: 17, color: colores.tinta },
  pie: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: BORDE, borderColor: colores.tinta, backgroundColor: colores.papelOscuro },
  pieTexto: { fontFamily: fuentes.mono, fontSize: 11.5, lineHeight: 17, color: colores.tintaSuave },
});
