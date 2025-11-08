import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>InterviewLens</Text>
      <Text style={styles.sub}>Record interviews, mark key moments, and auto‑draft follow‑ups.</Text>
      <Link href="/record" style={styles.link}>🎙️ Start Recording →</Link>
      <Link href="/sessions" style={styles.link}>🗂️ Sessions & Drafts →</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, justifyContent: 'center' },
  h1: { fontSize: 32, fontWeight: '900' },
  sub: { color: '#475569', marginBottom: 12 },
  link: { color: '#2563eb', fontWeight: '700', fontSize: 16 }
});
