import { authClient } from "@/lib/auth-client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GoogleOneTapSignIn } from "react-native-nitro-google-signin";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  // Optionally pause queries until the user is authenticated
  expectAuth: true,
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  useEffect(() => {
    GoogleOneTapSignIn.configure({
      webClientId: "autoDetect",
    });
  }, []);
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <Stack>
        <Stack.Screen name="index" />
      </Stack>
    </ConvexBetterAuthProvider>
  );
}
