import { useState } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { SharedValue, runOnJS, useAnimatedReaction } from 'react-native-reanimated';

type Props = {
  texto: SharedValue<string>;
  style?: StyleProp<TextStyle>;
};

// Muestra un texto que depende de un valor animado (por ejemplo "45%" o "12°").
// Cada vez que el texto cambia, Reanimated avisa a React para que lo dibuje.
// Como los textos son enteros redondeados, no cambia en cada frame y es barato.
export function TextoAnimado({ texto, style }: Props) {
  const [valor, setValor] = useState(texto.value);

  useAnimatedReaction(
    () => texto.value,
    (actual, anterior) => {
      if (actual !== anterior) {
        runOnJS(setValor)(actual);
      }
    }
  );

  return <Text style={style}>{valor}</Text>;
}
