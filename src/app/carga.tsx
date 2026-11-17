import { StyleSheet, View } from 'react-native';
import { Pantalla } from '../componentes/Pantalla';
import { Cargador } from '../componentes/Cargador';
import { Tarjeta } from '../componentes/Tarjeta';
import { MARGEN, colores } from '../tema';

export default function Carga() {
  return (
    <Pantalla ruta="carga">
      <View style={estilos.contenido}>
        <Tarjeta color={colores.lima} estiloInterno={estilos.tarjeta}>
          <Cargador />
        </Tarjeta>
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  contenido: { flex: 1, paddingHorizontal: MARGEN, justifyContent: 'center', paddingBottom: 40 },
  tarjeta: { paddingVertical: 36, paddingHorizontal: 24 },
});
