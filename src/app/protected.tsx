import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function Protected() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [word, setWord] = useState("");
  const words = useQuery(api.words.list);
  const addWord = useMutation(api.words.add);

  const handleAddWord = async () => {
    if (!word.trim()) return;
    try {
      await addWord({ word });
      setWord("");
    } catch (e) {
      console.error(e);
      Alert.alert("Failed to add word", "Please try again.");
    }
  };

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
