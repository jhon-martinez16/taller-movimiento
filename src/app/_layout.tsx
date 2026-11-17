import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Drawer } from 'expo-router/drawer';
import { useFonts } from 'expo-font';
import {
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';
import { ContenidoMenu } from '../componentes/ContenidoMenu';
import { EJERCICIOS, EXTRAS } from '../datos/ejercicios';
import { colores } from '../tema';

// Mantengo la pantalla de arranque hasta que carguen las fuentes
SplashScreen.preventAutoHideAsync();

export default function LayoutRaiz() {
  const [fuentesListas] = useFonts({
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    DMMono_400Regular,
    DMMono_500Medium,
  });

  useEffect(() => {
    if (fuentesListas) SplashScreen.hideAsync();
  }, [fuentesListas]);

  if (!fuentesListas) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colores.papel }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Drawer
          drawerContent={(props) => <ContenidoMenu {...props} />}
          screenOptions={{
            headerShown: false, // cada pantalla dibuja su propio encabezado
            drawerType: 'slide',
            overlayColor: 'rgba(23,20,15,0.45)',
            swipeEdgeWidth: 28,
            drawerStyle: { width: 300, backgroundColor: colores.papel },
            sceneStyle: { backgroundColor: colores.papel },
          }}
        >
          <Drawer.Screen name="index" options={{ title: 'Inicio' }} />
          {[...EJERCICIOS, ...EXTRAS].map((e) => (
            <Drawer.Screen
              key={e.ruta}
              name={e.ruta}
              options={{
                title: e.titulo,
                // en los ejercicios con gestos de arrastre, el menú no se abre deslizando
                // para que no se confunda con el gesto del ejercicio
                swipeEnabled: e.ruta !== 'arrastrar' && e.ruta !== 'multitactil',
              }}
            />
          ))}
        </Drawer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
