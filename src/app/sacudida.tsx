import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Pantalla } from '../componentes/Pantalla';
import { Ficha } from '../componentes/Ficha';
import { Tarjeta } from '../componentes/Tarjeta';
import { BORDE, MARGEN, colores, fuentes } from '../tema';

// Qué tan fuerte hay que sacudir según la sensibilidad elegida (en unidades de "g")
const NIVELES = [
  { nombre: 'Suave', umbral: 0.5 },
  { nombre: 'Normal', umbral: 0.9 },
  { nombre: 'Fuerte', umbral: 1.5 },
];
const MAXIMO_G = 2.5; // lo que representa la barra llena
const ESPERA_ENTRE_SACUDIDAS = 900; // milisegundos

export default function Sacudida() {
  const [nivel, setNivel] = useState(1);
  const [sensorDisponible, setSensorDisponible] = useState<boolean | null>(null);
  const [cantidad, setCantidad] = useState(0);
  const [mareada, setMareada] = useState(false);

  const desplazX = useSharedValue(0);
  const giro = useSharedValue(0);
  const escala = useSharedValue(1);
  const fuerza = useSharedValue(0); // 0 a 1, lo que mide el sensor ahora

  const umbralActual = useRef(NIVELES[1].umbral);
  const ultimaSacudida = useRef(0);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    umbralActual.current = NIVELES[nivel].umbral;
  }, [nivel]);

  useEffect(() => {
    Accelerometer.isAvailableAsync()
      .then(setSensorDisponible)
      .catch(() => setSensorDisponible(false));
    return () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    };
  }, []);

  // La animación de temblor: la figura va y viene rápido de lado a lado
  const sacudirFigura = useCallback(() => {
    const t = 55;
    desplazX.value = withSequence(
      withTiming(-22, { duration: t }),
      withRepeat(withTiming(22, { duration: t * 2 }), 8, true),
      withSpring(0, { damping: 6, stiffness: 200 })
    );
    giro.value = withSequence(
      withTiming(-14, { duration: t }),
      withRepeat(withTiming(14, { duration: t * 2 }), 8, true),
      withSpring(0, { damping: 6, stiffness: 160 })
    );
    escala.value = withSequence(withTiming(1.12, { duration: 120 }), withSpring(1, { damping: 8 }));

    setCantidad((c) => c + 1);
    setMareada(true);
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setMareada(false), 1500);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  }, [desplazX, giro, escala]);

  // guardo la última versión de la función para usarla dentro del listener del sensor
  const sacudirRef = useRef(sacudirFigura);
  useEffect(() => {
    sacudirRef.current = sacudirFigura;
  }, [sacudirFigura]);

  // Escuchar el acelerómetro solo mientras esta pantalla está visible
  useFocusEffect(
    useCallback(() => {
      let suscripcion: { remove: () => void } | null = null;
      try {
        Accelerometer.setUpdateInterval(60);
        suscripcion = Accelerometer.addListener(({ x, y, z }) => {
          // En reposo la magnitud vale ~1 (la gravedad). Al sacudir se aleja de 1.
          const magnitud = Math.sqrt(x * x + y * y + z * z);
          const diferencia = Math.abs(magnitud - 1);
          fuerza.value = withTiming(Math.min(diferencia / MAXIMO_G, 1), { duration: 80 });

          const ahora = Date.now();
          if (diferencia > umbralActual.current && ahora - ultimaSacudida.current > ESPERA_ENTRE_SACUDIDAS) {
            ultimaSacudida.current = ahora;
            sacudirRef.current();
          }
        });
      } catch {
        // en navegadores sin sensor no pasa nada: queda el botón de prueba
        setSensorDisponible(false);
      }
      return () => {
        suscripcion?.remove();
        fuerza.value = 0;
      };
    }, [fuerza])
  );

  const estiloFigura = useAnimatedStyle(() => ({
    transform: [{ translateX: desplazX.value }, { rotate: `${giro.value}deg` }, { scale: escala.value }],
  }));

  const estiloBarra = useAnimatedStyle(() => ({
    width: `${fuerza.value * 100}%`,
    backgroundColor: fuerza.value * MAXIMO_G > umbralActual.current ? colores.naranja : colores.menta,
  }));

  return (
    <Pantalla ruta="sacudida">
      <View style={estilos.contenido}>
        <Tarjeta color={colores.blanco} llenar>
          <View style={estilos.escenario}>
            <Animated.View style={estiloFigura}>
              <Ficha tamano={128} color={colores.menta} expresion={mareada ? 'mareada' : 'feliz'} />
            </Animated.View>
            <Text style={estilos.estado}>{mareada ? '¡Ay, qué mareo!' : 'Sacúdeme...'}</Text>
          </View>
        </Tarjeta>

        {/* medidor del acelerómetro */}
        <View style={estilos.panel}>
          <View style={estilos.panelFila}>
            <Text style={estilos.etiqueta}>FUERZA DEL SENSOR</Text>
            <Text style={estilos.etiqueta}>
              {sensorDisponible === false ? 'SIN SENSOR' : `${cantidad} SACUDIDAS`}
            </Text>
          </View>
          <View style={estilos.riel}>
            <Animated.View style={[estilos.barra, estiloBarra]} />
            {/* rayita que marca desde dónde cuenta como sacudida */}
            <View style={[estilos.umbral, { left: `${(NIVELES[nivel].umbral / MAXIMO_G) * 100}%` }]} />
          </View>

          <View style={estilos.niveles}>
            {NIVELES.map((n, i) => (
              <Pressable
                key={n.nombre}
                onPress={() => setNivel(i)}
                style={[estilos.nivel, i === nivel && estilos.nivelActivo]}
              >
                <Text style={[estilos.nivelTexto, i === nivel && { color: colores.tinta }]}>{n.nombre}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable onPress={sacudirFigura} style={({ pressed }) => [estilos.botonPrueba, pressed && { opacity: 0.7 }]}>
          <Text style={estilos.botonPruebaTexto}>
            {sensorDisponible === false ? 'Tu equipo no tiene sensor: probar con botón' : 'Probar sin sacudir'}
          </Text>
        </Pressable>
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  contenido: { flex: 1, paddingHorizontal: MARGEN, paddingBottom: 18, gap: 8 },
  escenario: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28 },
  estado: { fontFamily: fuentes.subtitulo, fontSize: 20, color: colores.tinta },
  panel: {
    backgroundColor: colores.blanco,
    borderWidth: BORDE,
    borderColor: colores.tinta,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  panelFila: { flexDirection: 'row', justifyContent: 'space-between' },
  etiqueta: { fontFamily: fuentes.mono, fontSize: 10.5, letterSpacing: 1.5, color: colores.tintaSuave },
  riel: {
    height: 22,
    borderRadius: 11,
    borderWidth: BORDE,
    borderColor: colores.tinta,
    backgroundColor: colores.papel,
    overflow: 'hidden',
  },
  barra: { height: '100%' },
  umbral: { position: 'absolute', top: 0, bottom: 0, width: 3, backgroundColor: colores.tinta },
  niveles: { flexDirection: 'row', gap: 8 },
  nivel: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: BORDE,
    borderColor: colores.tinta,
    alignItems: 'center',
    backgroundColor: colores.papel,
  },
  nivelActivo: { backgroundColor: colores.menta },
  nivelTexto: { fontFamily: fuentes.semi, fontSize: 14, color: colores.tintaSuave },
  botonPrueba: { alignItems: 'center', paddingVertical: 8 },
  botonPruebaTexto: {
    fontFamily: fuentes.semi,
    fontSize: 13.5,
    color: colores.tintaSuave,
    textDecorationLine: 'underline',
  },
});
