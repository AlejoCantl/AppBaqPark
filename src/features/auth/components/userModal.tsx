import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import 'react-native-url-polyfill/auto';
import { useAuthentication } from '@/features/auth/context/AuthenticationContext';
import { useModalContext } from '@/features/auth/context/userModalDisplayContext'
import Login from "./Login";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import theme from '@/core/theme/theme';

const UserModal = () => {
  const { visible, close } = useModalContext();
  const { session, signOut } = useAuthentication();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={close}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalBackground}
      >
        {session ? (
          <View style={styles.modalContainer}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={48} color={theme.colors.secondary} />
            </View>
            <Text style={styles.titleText}>Hola de nuevo</Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color={theme.colors.textMuted} />
                <Text style={styles.infoText}>{"usuario@email.com"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color={theme.colors.textMuted} />
                <Text style={styles.infoText}>{"25 años"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="scale-outline" size={20} color={theme.colors.textMuted} />
                <Text style={styles.infoText}>{"70 kg"}</Text>
              </View>
            </View>

            <View style={styles.spacer} />

            <TouchableOpacity style={styles.buttonPrimary} activeOpacity={0.8}>
              <Text style={styles.buttonTextPrimary}>Actualizar Información</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => signOut()}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
              <Text style={styles.buttonTextSecondary}>Cerrar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonGhost}
              onPress={close}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonTextGhost}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.modalContainer}>
            <Text style={styles.titleText}>Iniciar sesión</Text>
            <Text style={styles.subtitleText}>
              ¿Aún no tienes cuenta? {""}
              <Link style={styles.registerLink} href="/_components/SignUp">
                Regístrate aquí
              </Link>
            </Text>
            
            <Login />
            
            <View style={styles.spacer} />
            
            <TouchableOpacity
              style={styles.buttonGhost}
              onPress={close}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonTextGhost}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.overlay,
    padding: 24,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 24,
    alignItems: "center",
    ...theme.shadow.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: theme.colors.secondary,
  },
  titleText: {
    fontSize: theme.fontSizes.xl,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textMuted,
    marginBottom: 24,
  },
  registerLink: {
    color: theme.colors.secondary,
    fontWeight: "bold",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: theme.radius.md,
    gap: 12,
    marginTop: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.textDark,
  },
  spacer: {
    height: 24,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: theme.radius.md,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonTextPrimary: {
    color: "#fff",
    fontSize: theme.fontSizes.base,
    fontWeight: "600",
  },
  buttonSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: theme.colors.error,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: theme.radius.md,
    width: "100%",
    marginBottom: 12,
  },
  buttonTextSecondary: {
    color: theme.colors.error,
    fontSize: theme.fontSizes.base,
    fontWeight: "600",
  },
  buttonGhost: {
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonTextGhost: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.sm,
    fontWeight: "500",
  },
});

export { UserModal };
