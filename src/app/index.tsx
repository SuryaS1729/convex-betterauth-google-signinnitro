import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function Index() {
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
