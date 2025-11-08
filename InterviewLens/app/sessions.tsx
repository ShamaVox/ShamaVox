import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import useStore from '../lib/store';

export default function Sessions() {
  const router = useRouter();
  const { sessions } = useStore();
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Sessions</Text>
      <FlatList
        data={sessions}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/session', params: { id: item.id } })}>
            <Text style={styles.title}>{item.meta?.candidate || 'Session'}</Text>
            <Text style={styles.sub}>{item.meta?.company || '—'} • {Math.round(item.duration)}s • {new Date(parseInt(item.id.split('_')[1])).toLocaleString()}</Text>
            <Text style={styles.meta}>{item.moments.length} moments</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ color: '#64748b' }}>No sessions yet</Text>}
      />
      <Link href="/" style={styles.link}>← Home</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  h1: { fontSize: 24, fontWeight: '900' },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: '800' },
  sub: { color: '#475569' },
  meta: { color: '#0ea5e9', fontWeight: '700', marginTop: 4 },
  link: { color: '#2563eb', marginTop: 12 }
});
