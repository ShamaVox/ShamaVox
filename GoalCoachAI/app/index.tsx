import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import WeeklyGoalCard from '../components/WeeklyGoalCard';
import CognitiveReflectionModal from '../components/CognitiveReflectionModal';
import useStore from '../lib/store';

export default function HomeScreen() {
  const { connected, connectSource, addReflection } = useStore();
  const [modalVisible, setModalVisible] = useState(false);

  const demoTxn = { id: 'txn_demo', name: 'Coffee Shop', amount: 6.5 };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>GoalCoach AI</Text>
      <Text style={styles.sub}>Micro-coaching for weekly focus and mindful spending.</Text>

      <WeeklyGoalCard
        userId={'demo'}
        isConnected={connected}
        onConnect={connectSource}
        onOpenGoals={() => {}}
      />

      <View style={styles.row}>
        <Link href="/goals" style={styles.link}>Set Weekly Goal →</Link>
        <Text style={styles.link} onPress={() => setModalVisible(true)}>Mindful Check-In →</Text>
        <Link href="/insights" style={styles.link}>Insights →</Link>
      </View>

      <CognitiveReflectionModal
        visible={modalVisible}
        transaction={demoTxn}
        onClose={() => setModalVisible(false)}
        onSubmit={async (_id, payload) => addReflection(payload)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  h1: { fontSize: 28, fontWeight: '800' },
  sub: { color: '#475569' },
  row: { flexDirection: 'row', gap: 16, marginTop: 12, flexWrap: 'wrap' },
  link: { color: '#2563eb', fontWeight: '600' }
});
