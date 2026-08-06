import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GoogleSignInButton from "@/components/GoogleSignInButton";
import { authClient } from "@/lib/auth-client";

export default function Index() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.replace("/protected");
    }
  }, [session, router]);

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
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
          }}
        >
          Welcome
        </Text>

        <GoogleSignInButton />
      </View>
    </SafeAreaView>
  );
}
