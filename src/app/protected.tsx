import { useRouter } from "expo-router";
import { Alert, Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authClient } from "@/lib/auth-client";
import { signOutGoogle } from "@/lib/google";

export default function Protected() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    try {
      await signOutGoogle();
      router.replace("/");
    } catch (e) {
      console.error(e);
      Alert.alert("Sign-out failed", "Please try again.");
    }
  };

  if (isPending) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    router.replace("/");
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "700" }}>
          Welcome, {session.user.name}
        </Text>
        <Text>This page is protected — only signed-in users can see it.</Text>
        <Button title="Sign out" onPress={handleSignOut} />
      </View>
    </SafeAreaView>
  );
}
