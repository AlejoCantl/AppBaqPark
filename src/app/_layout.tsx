import { Slot } from "expo-router";
import { AuthenticationProvider } from "@/features/auth/context/AuthenticationContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserModalProvider } from "@/features/auth/context/userModalDisplayContext";
import { UserModal } from "@/features/auth/components/userModal";
import { ThemeProvider } from "@/core/theme/ThemeProvider";

// UserModalProvider y UserModal viven AQUÍ, fuera de cualquier GestureDetector,
// para que el Modal nativo reciba los toques sin interferencia de RNGH.
export default function Layout() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthenticationProvider>
          <UserModalProvider>
            <Slot />
            {/* Modal renderizado en el nivel raíz — por encima de todos los gestos */}
            <UserModal />
          </UserModalProvider>
        </AuthenticationProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}