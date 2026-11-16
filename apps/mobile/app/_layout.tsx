import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#2563eb",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "QuickAttend" }} />
        <Stack.Screen name="(auth)/login" options={{ title: "Đăng nhập" }} />
        <Stack.Screen name="(host)/index" options={{ title: "Giảng viên (Host)" }} />
        <Stack.Screen name="(guest)/index" options={{ title: "Sinh viên (Guest)" }} />
      </Stack>
    </>
  );
}
