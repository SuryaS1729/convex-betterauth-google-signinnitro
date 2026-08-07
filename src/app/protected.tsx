import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authClient } from "@/lib/auth-client";
import { signOutGoogle } from "@/lib/google";

// TEMPORARY PERFORMANCE INSTRUMENTATION — remove after audit.
const t0 = performance.now();
function pLog(label: string) {
  console.log(`[perf:client] ${label} +${(performance.now() - t0).toFixed(1)}ms`);
}

export default function Protected() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [word, setWord] = useState("");
  const words = useQuery(api.words.list);
  const addWord = useMutation(api.words.add);
  // Stage timestamps for the in-flight add; logged when it settles.
  const perfRef = useRef<Record<string, number> | null>(null);

  const handleAddWord = async () => {
    if (!word.trim()) return;
    perfRef.current = {
      pressed: performance.now(),
      invoked: -1,
      socketSent: -1,
      serverAck: -1,
      resolved: -1,
    };
    pLog("Button pressed — calling addWord()");
    try {
      perfRef.current!.invoked = performance.now();
      pLog("Mutation invoked (addWord({ word }))");
      const result = await addWord({ word });
      perfRef.current!.serverAck = performance.now();
      pLog(`addWord resolved (server ack) in ${(perfRef.current!.serverAck - perfRef.current!.invoked).toFixed(1)}ms`);
      setWord("");
      // The 0-delay timeout lets Convex deliver the updated query result
      // (MutationResponse + Transition) before we print the summary.
      setTimeout(() => {
        const p = perfRef.current!;
        perfRef.current = null;
        p.resolved = performance.now();
        const print = (name: string, key: keyof typeof p) =>
          console.log(
            `[perf:client] ${name}: ${(p[key] - p.pressed).toFixed(1)} ms`,
          );
        print("Button pressed", "pressed");
        print("Mutation invoked", "invoked");
        print("Network request (sent on socket)", "socketSent");
        print("Server ack (MutationResponse)", "serverAck");
        print("Server ack to resolve", "resolved");
        console.log(
          `[perf:client] Total latency (press → addWord resolve): ${(p.serverAck - p.pressed).toFixed(1)} ms`,
        );
        void result;
      }, 0);
    } catch (e) {
      console.error(e);
      Alert.alert("Failed to add word", "Please try again.");
    }
  };

  // Peek at the WebSocket to timestamp the moment the Mutation message leaves.
  useEffect(() => {
    if (__DEV__) {
      const ws = (globalThis as Record<string, unknown>).ws as
        | { send: (data: unknown) => void; bind: (t: unknown) => unknown }
        | undefined;
      if (ws) {
        const origSend = ws.send.bind(ws);
        ws.send = (data: unknown) => {
          try {
            const msg = JSON.parse(String(data));
            if (msg?.type === "Mutation") {
              pLog("Socket send: Mutation message leaving client");
              if (perfRef.current) perfRef.current.socketSent = performance.now();
            }
          } catch {
            // not JSON — ignore
          }
          return origSend(data);
        };
      }
    }
  }, []);

  // Rerender detector: log every time the words list updates.
  useEffect(() => {
    pLog(
      `React rerender with words (${words === undefined ? "undefined" : words.length} items)`,
    );
  });

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
      <View style={{ flex: 1, padding: 20, gap: 16 }}>
        <View style={{ alignItems: "center", gap: 8 }}>
          {session.user.image ? (
            <Image
              source={session.user.image}
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: "#eee",
              }}
              contentFit="cover"
              transition={150}
            />
          ) : null}
          <Text style={{ fontSize: 24, fontWeight: "700" }}>
            Welcome, {session.user.name}
          </Text>
          <Text>Your words</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
            placeholder="Add a word"
            value={word}
            onChangeText={setWord}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Button title="Add" onPress={handleAddWord} disabled={!word.trim()} />
        </View>

        <FlatList
          data={words}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={{
                paddingVertical: 10,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: "#ccc",
              }}
            >
              <Text style={{ fontSize: 16 }}>{item.word}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 24, color: "#888" }}>
              {words === undefined ? "Loading…" : "No words yet. Add one!"}
            </Text>
          }
        />

        <Button title="Sign out" onPress={handleSignOut} />
      </View>
    </SafeAreaView>
  );
}
