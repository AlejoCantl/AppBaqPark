import React from "react";
import { Pressable, Text, TextInput, View, StyleSheet, ActivityIndicator } from "react-native";
import { useAuthentication } from '@/features/auth/context/AuthenticationContext';
import theme from '@/core/theme/theme';

export default function Login() {
  const { data, handleInput, loading, signInWithEmail } = useAuthentication();
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.colors.textMuted}
        value={data.email}
        onChangeText={(text) => handleInput("email", text)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={theme.colors.textMuted}
        secureTextEntry={true}
        value={data.password}
        onChangeText={(text) => handleInput("password", text)}
      />
      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
        onPress={() => {
          signInWithEmail();
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  input: {
    height: 48,
    width: "100%",
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    color: theme.colors.textDark,
    fontSize: theme.fontSizes.base,
  },
  button: {
    backgroundColor: theme.colors.secondary,
    height: 48,
    width: "100%",
    borderRadius: theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    ...theme.shadow.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: theme.fontSizes.base,
    fontWeight: "bold",
  },
});
