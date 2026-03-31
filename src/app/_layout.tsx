import { Slot } from "expo-router";
import { AuthenticationProvider } from "@/features/auth/context/AuthenticationContext";

export default function Layout() {
  return (
    <AuthenticationProvider>
    <Slot />
    </AuthenticationProvider>
  );
}