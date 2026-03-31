import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import theme from '@/core/theme/theme';

export default function ButtonsSettings() {
  return (
    <View style={styles.buttonContainer}>
      <Button
        mode="outlined"
        onPress={() => console.log("Pressed Políticas")}
        icon="book-open-variant"
        textColor={theme.colors.secondary}
        style={styles.button}
      >
        Políticas de Privacidad
      </Button>
      <Button
        mode="contained"
        onPress={() => console.log("Pressed Reportar")}
        icon="alert-circle"
        buttonColor={theme.colors.error}
        style={styles.button}
      >
        Reportar Errores
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    borderRadius: theme.radius.md,
    paddingVertical: 4,
  },
});
