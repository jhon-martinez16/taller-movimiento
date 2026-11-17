import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  LinearTransition,
  SlideOutLeft,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Pantalla } from '../componentes/Pantalla';
import { BORDE, MARGEN, colores, fuentes } from '../tema';

type Tarea = { id: number; texto: string; color: string };

const TAREAS_INICIALES: Tarea[] = [
  { id: 1, texto: 'Instalar Reanimated', color: colores.naranja },
  { id: 2, texto: 'Dibujar la ficha', color: colores.lima },
  { id: 3, texto: 'Probar el multitáctil', color: colores.cielo },
  { id: 4, texto: 'Sacudir el celular', color: colores.amarillo },
  { id: 5, texto: 'Subir el repo a GitHub', color: colores.menta },
  { id: 6, texto: 'Entregar antes de la fecha', color: colores.rosa },
];

const DISTANCIA_PARA_BORRAR = -110; // hasta dónde hay que deslizar

type PropsFila = { tarea: Tarea; alBorrar: (id: number) => void };

function FilaTarea({ tarea, alBorrar }: PropsFila) {
  const desplazX = useSharedValue(0);
  const yaCruzo = useSharedValue(false);

  const vibrar = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

  const gesto = Gesture.Pan()
    .activeOffsetX([-12, 12]) // solo reacciona al movimiento horizontal
    .failOffsetY([-12, 12]) // si va vertical, deja pasar el scroll
    .onUpdate((e) => {
      desplazX.value = Math.min(0, e.translationX);
      const pasaLinea = desplazX.value < DISTANCIA_PARA_BORRAR;
      if (pasaLinea && !yaCruzo.value) runOnJS(vibrar)();
      yaCruzo.value = pasaLinea;
    })
    .onEnd(() => {
      if (desplazX.value < DISTANCIA_PARA_BORRAR) {
        // se va hasta el borde y se elimina de la lista
        desplazX.value = withTiming(-500, { duration: 180 }, (terminado) => {
          if (terminado) runOnJS(alBorrar)(tarea.id);
        });
      } else {
        desplazX.value = withSpring(0, { damping: 12, stiffness: 160 });
      }
    });

  const estiloFila = useAnimatedStyle(() => ({ transform: [{ translateX: desplazX.value }] }));
  // el fondo rojo "Borrar" aparece a medida que se desliza
  const estiloFondo = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.abs(desplazX.value) / 60),
    transform: [{ scale: yaCruzo.value ? 1.15 : 1 }],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={SlideOutLeft.duration(200)}
      layout={LinearTransition.springify().damping(16)}
      style={estilos.contenedorFila}
    >
      <View style={estilos.fondoBorrar}>
        <Animated.View style={[estilos.iconoBorrar, estiloFondo]}>
          <Feather name="trash-2" size={22} color={colores.blanco} />
        </Animated.View>
      </View>
      <GestureDetector gesture={gesto}>
        <Animated.View style={[estilos.fila, estiloFila]}>
          <View style={[estilos.punto, { backgroundColor: tarea.color }]} />
          <Text style={estilos.textoFila}>{tarea.texto}</Text>
          <Feather name="chevrons-left" size={18} color={colores.tintaSuave} />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

export default function Deslizar() {
  const [tareas, setTareas] = useState(TAREAS_INICIALES);

  const borrar = (id: number) => setTareas((lista) => lista.filter((t) => t.id !== id));

  return (
    <Pantalla ruta="deslizar">
      <View style={estilos.contenido}>
        <View style={estilos.lista}>
          {tareas.map((t) => (
            <FilaTarea key={t.id} tarea={t} alBorrar={borrar} />
          ))}
          {tareas.length === 0 && <Text style={estilos.vacio}>¡Todo listo! No queda nada por hacer.</Text>}
        </View>
        <Pressable
          onPress={() => setTareas(TAREAS_INICIALES)}
          style={({ pressed }) => [estilos.boton, pressed && { opacity: 0.7 }]}
        >
          <Feather name="rotate-ccw" size={16} color={colores.tinta} />
          <Text style={estilos.botonTexto}>Restaurar tareas</Text>
        </Pressable>
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  contenido: { flex: 1, paddingHorizontal: MARGEN, paddingBottom: 24 },
  lista: { flex: 1, gap: 10 },
  contenedorFila: { height: 62 },
  fondoBorrar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colores.naranja,
    borderRadius: 16,
    borderWidth: BORDE,
    borderColor: colores.tinta,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
  iconoBorrar: { alignItems: 'center', justifyContent: 'center' },
  fila: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colores.blanco,
    borderRadius: 16,
    borderWidth: BORDE,
    borderColor: colores.tinta,
    paddingHorizontal: 14,
  },
  punto: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colores.tinta },
  textoFila: { flex: 1, fontFamily: fuentes.subtitulo, fontSize: 16, color: colores.tinta },
  vacio: { fontFamily: fuentes.subtitulo, fontSize: 16, color: colores.tintaSuave, textAlign: 'center', marginTop: 40 },
  boton: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: colores.rosa,
    borderWidth: BORDE,
    borderColor: colores.tinta,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 18,
  },
  botonTexto: { fontFamily: fuentes.subtitulo, fontSize: 14.5, color: colores.tinta },
});
