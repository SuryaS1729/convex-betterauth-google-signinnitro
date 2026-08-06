import { useState } from "react";
import { Alert, Button } from "react-native";

import { signInWithGoogle } from "@/lib/google";

export default function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  const handlePress = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result?.error) {
        Alert.alert("Sign-in failed", result.error.message);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Sign-in failed", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      title="Continue with Google"
      onPress={handlePress}
      disabled={loading}
    />
  );
}
