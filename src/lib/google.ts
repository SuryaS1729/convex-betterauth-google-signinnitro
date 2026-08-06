import {
  GoogleOneTapSignIn,
  isSuccessResponse,
} from "react-native-nitro-google-signin";

import { authClient } from "./auth-client";

export async function signInWithGoogle() {
  await GoogleOneTapSignIn.checkPlayServices();
  // Always show the full account picker (all Google accounts on the device).
  // signIn() would only offer already-authorized accounts after the first login.
  const response = await GoogleOneTapSignIn.createAccount();

  if (!isSuccessResponse(response)) {
    return null;
  }

  const { idToken } = response.data;

  return authClient.signIn.social({
    provider: "google",
    idToken: {
      token: idToken,
    },
  });
}

export async function signOutGoogle() {
  await GoogleOneTapSignIn.signOut();
  await authClient.signOut();
}
