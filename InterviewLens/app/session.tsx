import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share, ScrollView } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import useStore from '../lib/store';
import { generateDraft } from '../utils/generateDraft';

export default function SessionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sessions } = useStore();
  const session = sessions.find(s => s.id === id);
  const [tone, setTone] = useState<'warm' | 'concise' | 'executive'>('warm');
  const [draft, setDraft] = useState<string>('');

  const bullets = useMemo(() => (session?.moments || []).slice(0, 10).map(m => `• @${m.t}s — ${m.note}`), [session?.moments]);

  const onGenerate = () => {
    if (!session) return;
    const text = generateDraft({
      candidate: session.meta?.candidate || 'Hiring Manager',
      company: session.meta?.company || 'Company',
      moments: session.moments,
      tone
    });
    setDraft(text);
  };

  const onShare = async () => {
    if (!draft) return;
    await Share.share({ message: draft });
  };

  if (!session) return (
    <View style={{ padding: 20 }}>
      <Text>Session not found</Text>
      <Link href="/sessions" style={{ color: '#2563eb', marginTop: 8 }}>← Back</Link>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Session</Text>
      <Text style={styles.sub}>{session.meta?.candidate} • {session.meta?.company} • {Math.round(session.duration)}s</Text>

      <Text style={styles.h2}>Moments</Text>
      <FlatList
        data={session.moments}
        keyExtractor={(_m, i) => String(i)}
        renderItem={({ item }) => <Text style={styles.moment}>• @{item.t}s — {item.note}</Text>}
        ListEmptyComponent={<Text style={{ color: '#64748b' }}>No moments</Text>}
        scrollEnabled={false}
      />

      <Text style={styles.h2}>Follow‑up Draft</Text>
      <View style={styles.toneRow}>
        {(['warm','concise','executive'] as const).map(t => (
          <TouchableOpacity key={t} onPress={() => setTone(t)} style={[styles.toneBtn, tone===t && styles.toneActive]}>
            <Text style={styles.toneTxt}>{t.title()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.btn, styles.gen]} onPress={onGenerate}>
        <Text style={styles.btnTxt}>✨ Generate Draft</Text>
      </TouchableOpacity>

      {!!draft && (
        <View style={styles.draftBox}>
          <Text style={styles.draftText}>{draft}</Text>
          <TouchableOpacity style={[styles.btn, styles.share]} onPress={onShare}><Text style={styles.btnTxt}>Share</Text></TouchableOpacity>
        </View>
      )}

      <Link href="/sessions" style={styles.link}>← Back</Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  h1: { fontSize: 24, fontWeight: '900' },
  h2: { fontSize: 18, fontWeight: '800', marginTop: 8 },
  sub: { color: '#475569' },
  moment: { color: '#111827', marginVertical: 2 },
  toneRow: { flexDirection: 'row', gap: 8 },
  toneBtn: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  toneActive: { backgroundColor: '#e0f2fe', borderColor: '#38bdf8' },
  toneTxt: { textTransform: 'capitalize', fontWeight: '700', color: '#0f172a' },
  btn: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  gen: { backgroundColor: '#2563eb' },
  share: { backgroundColor: '#10b981', marginTop: 10 },
  btnTxt: { color: '#fff', fontWeight: '800' },
  draftBox: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12, marginTop: 8 },
  draftText: { color: '#111827' },
  link: { color: '#2563eb', marginTop: 12 }
});
