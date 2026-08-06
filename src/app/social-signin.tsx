import { Button } from "react-native";

import { authClient } from "@/lib/auth-client";

export default function SocialSignIn() {
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google", // only google, apple and facebook are supported for idToken signIn
      idToken: {
        token: "...", // ID token from provider
        nonce: "...", // nonce from provider (optional)
      },
      callbackURL: "/dashboard", // this will be converted to a deep link (eg. `myapp://dashboard`) on native
    });
  };
  return <Button title="Login with Google" onPress={handleLogin} />;
}
