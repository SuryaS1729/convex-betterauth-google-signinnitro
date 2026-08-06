import {
    GoogleOneTapSignIn,
    isNoSavedCredentialFoundResponse,
    isSuccessResponse,
} from "react-native-nitro-google-signin";

import { authClient } from "./auth";

export async function signInWithGoogle() {
  await GoogleOneTapSignIn.checkPlayServices();

  let response = await GoogleOneTapSignIn.signIn();

  if (isNoSavedCredentialFoundResponse(response)) {
    response = await GoogleOneTapSignIn.createAccount();
  }

  if (isNoSavedCredentialFoundResponse(response)) {
    response = await GoogleOneTapSignIn.presentExplicitSignIn();
  }

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
