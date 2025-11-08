import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  userId: string;
  isConnected: boolean;
  onConnect: () => void;
  onOpenGoals?: () => void;
};

function startOfWeek(d = new Date()): Date {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
}
function endOfWeek(d = new Date()): Date {
  const start = startOfWeek(d);
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
}
function fmt(d: Date) {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function WeeklyGoalCard({ userId, isConnected, onConnect, onOpenGoals }: Props) {
  const start = startOfWeek();
  const end = endOfWeek();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Weekly Goal</Text>
        <View style={[styles.badge, isConnected ? styles.badgeOk : styles.badgeWarn]}>
          <Text style={styles.badgeText}>{isConnected ? 'Data connected' : 'Connect data'}</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>{fmt(start)} – {fmt(end)}</Text>

      <Text style={styles.body}>
        Set an intention for this week and track your check-in. You’ll get better insights if your
        data source is connected.
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.primary]} onPress={onOpenGoals}>
          <Text style={styles.primaryText}>Set Weekly Intent</Text>
        </TouchableOpacity>

        {!isConnected && (
          <TouchableOpacity style={[styles.button, styles.secondary]} onPress={onConnect}>
            <Text style={styles.secondaryText}>Connect</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 2,
    borderLeftWidth: 1,
    borderColor: '#235D62',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  subtitle: { marginTop: 4, color: '#6B7280', fontWeight: '500' },
  body: { marginTop: 12, color: '#374151', lineHeight: 20 },
  badge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999 },
  badgeOk: { backgroundColor: '#2B6168' },
  badgeWarn: { backgroundColor: '#E98B8B' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  button: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: '#2B6168' },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondary: { backgroundColor: '#EEF2F7' },
  secondaryText: { color: '#1F2937', fontWeight: '700' },
});
