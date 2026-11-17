import { StyleSheet, Text, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { BORDE, colores, fuentes } from '../tema';

type Props = {
  tamano?: number;
  color?: string;
  // -1 mira a la izquierda, 0 al frente, 1 a la derecha
  mirada?: SharedValue<number>;
  expresion?: 'feliz' | 'mareada' | 'asombrada';
};

// La "ficha" es el personaje de la app: un cuadrado con ojos.
// Lo uso como figura en varios ejercicios para que todo se sienta de la misma familia.
export function Ficha({ tamano = 96, color = colores.naranja, mirada, expresion = 'feliz' }: Props) {
  const miradaPropia = useSharedValue(0);
  const direccion = mirada ?? miradaPropia;

  const tamanoOjo = tamano * 0.27;
  const tamanoPupila = tamanoOjo * 0.5;

  const estiloPupila = useAnimatedStyle(() => ({
    transform: [{ translateX: direccion.value * tamanoOjo * 0.22 }],
  }));

  const ojo = (clave: string) =>
    expresion === 'mareada' ? (
      <Text key={clave} style={[estilos.equis, { fontSize: tamanoOjo * 1.15, width: tamanoOjo }]}>
        ×
      </Text>
    ) : (
      <View
        key={clave}
        style={[
          estilos.ojo,
          {
            width: tamanoOjo,
            height: expresion === 'asombrada' ? tamanoOjo * 1.15 : tamanoOjo,
            borderRadius: tamanoOjo,
          },
        ]}
      >
        <Animated.View
          style={[
            { width: tamanoPupila, height: tamanoPupila, borderRadius: tamanoPupila, backgroundColor: colores.tinta },
            estiloPupila,
          ]}
        />
      </View>
    );

  return (
    <View
      style={{
        width: tamano,
        height: tamano,
        borderRadius: tamano * 0.3,
        backgroundColor: color,
        borderWidth: BORDE,
        borderColor: colores.tinta,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ flexDirection: 'row', gap: tamano * 0.1, marginTop: -tamano * 0.06 }}>
        {ojo('izq')}
        {ojo('der')}
      </View>
      {/* boca */}
      {expresion === 'feliz' && (
        <View
          style={{
            marginTop: tamano * 0.1,
            width: tamano * 0.3,
            height: tamano * 0.15,
            borderBottomLeftRadius: tamano * 0.3,
            borderBottomRightRadius: tamano * 0.3,
            borderWidth: BORDE,
            borderTopWidth: 0,
            borderColor: colores.tinta,
          }}
        />
      )}
      {expresion === 'asombrada' && (
        <View
          style={{
            marginTop: tamano * 0.1,
            width: tamano * 0.14,
            height: tamano * 0.17,
            borderRadius: tamano,
            borderWidth: BORDE,
            borderColor: colores.tinta,
            backgroundColor: colores.tinta,
          }}
        />
      )}
      {expresion === 'mareada' && (
        <View
          style={{
            marginTop: tamano * 0.12,
            width: tamano * 0.3,
            height: BORDE + 0.5,
            borderRadius: 2,
            backgroundColor: colores.tinta,
          }}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  ojo: {
    backgroundColor: colores.blanco,
    borderWidth: BORDE - 0.5,
    borderColor: colores.tinta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equis: {
    fontFamily: fuentes.titulo,
    color: colores.tinta,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
