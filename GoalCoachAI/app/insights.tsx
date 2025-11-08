import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import useStore from '../lib/store';

export default function Insights() {
  const { reflections, weeklyGoal } = useStore();
  const count = reflections.length;

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Insights</Text>
      <Text style={styles.p}>Weekly Goal: {weeklyGoal || '—'}</Text>
      <Text style={styles.p}>Check-ins this week: {count}</Text>
      <Text style={styles.p}>
        Tip: align your purchases with your intention. Small pre-commitments create compounding control.
      </Text>
      <Link href="/" style={styles.link}>← Home</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  h1: { fontSize: 24, fontWeight: '800' },
  p: { color: '#334155' },
  link: { color: '#2563eb', marginTop: 12 }
});
