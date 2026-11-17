import type { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { BORDE, RADIO, colores } from '../tema';

type Props = {
  children?: ReactNode;
  color?: string;
  relieve?: number; // cuánto se desplaza la sombra dura
  llenar?: boolean; // ocupar todo el espacio disponible
  style?: StyleProp<ViewStyle>; // estilo del contenedor externo
  estiloInterno?: StyleProp<ViewStyle>;
  radio?: number;
};

// Tarjeta con borde grueso y una sombra "dura" desplazada (sin difuminar).
// La sombra es otra View detrás, así se ve igual en Android y en iOS.
export function Tarjeta({
  children,
  color = colores.blanco,
  relieve = 5,
  llenar = false,
  style,
  estiloInterno,
  radio = RADIO,
}: Props) {
  return (
    <View
      style={[
        { marginRight: relieve, marginBottom: relieve },
        llenar && { flex: 1 },
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: relieve,
          left: relieve,
          right: -relieve,
          bottom: -relieve,
          backgroundColor: colores.tinta,
          borderRadius: radio,
        }}
      />
      <View
        style={[
          {
            backgroundColor: color,
            borderWidth: BORDE,
            borderColor: colores.tinta,
            borderRadius: radio,
            overflow: 'hidden',
          },
          llenar && { flex: 1 },
          estiloInterno,
        ]}
      >
        {children}
      </View>
    </View>
  );
}
