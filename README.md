# Taller de Movimiento

Aplicación móvil hecha con **React Native + Expo** para la actividad *Animations and Gestures*.
Reúne los 7 ejercicios en una sola app: seis pantallas de animación y gestos, más un **menú lateral (Drawer)** para entrar a cada una.

Desarrollado por Jhon Martínez.

## Ejercicios

| # | Pantalla | Archivo | Qué hace |
|---|----------|---------|----------|
| 1 | Arrastrar y girar | `src/app/arrastrar.tsx` | Una ficha que se arrastra por la pista; se inclina a la izquierda o a la derecha según hacia dónde la muevas. |
| 2 | Carga infinita | `src/app/carga.tsx` + `src/componentes/Cargador.tsx` | Spinner que gira solo al montarse, junto con una barra de progreso animada. |
| 3 | Multitáctil | `src/app/multitactil.tsx` | Zoom, rotación y movimiento de una imagen con gestos de uno y dos dedos. Doble toque para restablecer. |
| 4 | Rebote | `src/app/rebote.tsx` | Tres figuras que se encogen al presionar y vuelven rebotando (resorte) al soltar. |
| 5 | Carrusel | `src/app/carrusel.tsx` | Cartas horizontales con escala, rotación, opacidad y parallax según el desplazamiento. |
| 6 | Sacudida | `src/app/sacudida.tsx` | Detecta con el acelerómetro cuando sacudes el celular y la figura tiembla. |
| 7 | Drawer Navigation | `src/app/_layout.tsx` + `src/componentes/ContenidoMenu.tsx` | Menú lateral para acceder a cada ejercicio de forma independiente. |

### Extras (bonus)

| Pantalla | Archivo | Qué hace |
|----------|---------|----------|
| Deslizar para borrar | `src/app/deslizar.tsx` | Lista de tareas: se deslizan a la izquierda para borrarlas, con vibración y animaciones de layout. |
| Confeti | `src/app/confeti.tsx` | Al tocar, sale una explosión de piezas con gravedad y giro. |

Además, en el ejercicio 1 la ficha sigue con inercia al soltarla y rebota en los bordes de la pista.

## Tecnologías

- Expo SDK 57 y Expo Router (navegación por archivos)
- `react-native-reanimated` 4 (animaciones en el hilo de UI)
- `react-native-gesture-handler` (Pan, Pinch, Rotation, Tap)
- `expo-sensors` (acelerómetro)
- `expo-haptics` (vibración suave)
- TypeScript

## Estructura

```
src/
  app/               pantallas (una por ejercicio) y el layout con el Drawer
  componentes/       Ficha, Tarjeta, Cargador, Pantalla, menú lateral...
  datos/ejercicios.ts lista de ejercicios (la usan el menú y el inicio)
  utilidades/        funciones pequeñas
  tema.ts            colores, fuentes y medidas
assets/images/       iconos y la imagen del ejercicio 3
```

## Cómo ejecutarlo

```bash
npm install
npx expo start
```

Escanea el QR con **Expo Go** (Android o iOS). El acelerómetro solo funciona en un celular real.

## Generar el APK (EAS Build)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

Al terminar, EAS entrega un enlace y un QR para descargar e instalar el `.apk`.
