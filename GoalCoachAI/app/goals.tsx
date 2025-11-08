import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import useStore from '../lib/store';

export default function GoalsScreen() {
  const router = useRouter();
  const { setWeeklyGoal } = useStore();
  const [goal, setGoal] = useState('Avoid delivery; cook at home 4x');

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Weekly Goal</Text>
      <Text style={styles.help}>Be specific and measurable. Example: “Spend <$40 on takeout.”</Text>
      <TextInput value={goal} onChangeText={setGoal} style={styles.input} placeholder="Your goal..." />
      <TouchableOpacity style={styles.btn} onPress={() => { setWeeklyGoal(goal); Alert.alert('Saved'); router.back(); }}>
        <Text style={styles.btnTxt}>Save Goal</Text>
      </TouchableOpacity>
      <Link href="/" style={styles.link}>← Back</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  h1: { fontSize: 24, fontWeight: '800' },
  help: { color: '#475569' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, padding: 12 },
  btn: { backgroundColor: '#0ea5e9', padding: 14, borderRadius: 12, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '700' },
  link: { color: '#2563eb', marginTop: 8 }
});
