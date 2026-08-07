import { expoClient } from "@better-auth/expo/client";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_CONVEX_SITE_URL,
  plugins: [
    expoClient({
      scheme: Constants.expoConfig?.scheme as string,
      storagePrefix: Constants.expoConfig?.scheme as string,
      storage: SecureStore,
    }),
    convexClient(),
  ],
  // TEMPORARY PERFORMANCE INSTRUMENTATION — count token fetches.
  fetchOptions: {
    hooks: {
      before: async ({ url }) => {
        if (String(url).includes("/convex/token")) {
          // @ts-expect-error dev counter
          globalThis.__tokenFetchCount = (globalThis.__tokenFetchCount ?? 0) + 1;
          console.log(
            `[perf:token] fetch #${globalThis.__tokenFetchCount} — ${String(url)}`,
          );
        }
      },
    },
  },
});
