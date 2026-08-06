import { signInWithGoogle } from "@/lib/google";
import { Button } from "react-native";

export default function GoogleSignInButton() {
  const handlePress = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  return <Button title="Continue with Google" onPress={handlePress} />;
}
