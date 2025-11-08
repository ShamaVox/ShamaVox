import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useRouter, Link } from 'expo-router';
import useStore from '../lib/store';

type Moment = { t: number; note: string };

export default function Record() {
  const router = useRouter();
  const { saveSession } = useStore();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [note, setNote] = useState('');
  const [candidate, setCandidate] = useState('Hiring Manager');
  const [company, setCompany] = useState('Company');

  useEffect(() => {
    (async () => {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) Alert.alert('Microphone access is required to record.');
    })();
  }, []);

  useEffect(() => {
    let id: any;
    if (recording) {
      id = setInterval(async () => {
        const s = await recording.getStatusAsync();
        setStatus(s as Audio.RecordingStatus);
      }, 300);
    }
    return () => { if (id) clearInterval(id); };
  }, [recording]);

  const start = async () => {
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY as any);
      await rec.startAsync();
      setRecording(rec);
      setMoments([]);
    } catch (e) {
      Alert.alert('Error', 'Could not start recording');
    }
  };

  const stop = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    if (!uri) return;
    const fileName = `interview_${Date.now()}.m4a`;
    const dest = FileSystem.documentDirectory + fileName;
    await FileSystem.copyAsync({ from: uri, to: dest });
    const duration = (status?.durationMillis ?? 0) / 1000;
    saveSession({ id: fileName, fileUri: dest, duration, moments, meta: { candidate, company } });
    router.push('/sessions');
  };

  const addMoment = () => {
    const t = ((status?.durationMillis ?? 0) / 1000) | 0;
    if (!note.trim()) return;
    setMoments(prev => [{ t, note: note.trim() }, ...prev]);
    setNote('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Record Interview</Text>
      <TextInput style={styles.input} placeholder="Candidate / Interviewer name" value={candidate} onChangeText={setCandidate} />
      <TextInput style={styles.input} placeholder="Company" value={company} onChangeText={setCompany} />

      <View style={styles.timer}>
        <Text style={styles.time}>{((status?.durationMillis ?? 0)/1000).toFixed(1)}s</Text>
      </View>

      {recording ? (
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.stop]} onPress={stop}><Text style={styles.btnTxt}>⏹ Stop</Text></TouchableOpacity>
          <TextInput style={styles.note} placeholder="Add a quick note..." value={note} onChangeText={setNote} />
          <TouchableOpacity style={[styles.btn, styles.add]} onPress={addMoment}><Text style={styles.btnTxt}>➕ Moment</Text></TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={[styles.btn, styles.start]} onPress={start}><Text style={styles.btnTxt}>🎙️ Start Recording</Text></TouchableOpacity>
      )}

      <FlatList
        data={moments}
        keyExtractor={(item, idx) => String(idx)}
        renderItem={({ item }) => (
          <View style={styles.moment}>
            <Text style={styles.momentTs}>@{item.t}s</Text>
            <Text style={styles.momentNote}>{item.note}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#64748b' }}>No moments yet</Text>}
        style={{ marginTop: 16 }}
      />

      <Link href="/" style={styles.link}>← Home</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  h1: { fontSize: 24, fontWeight: '900' },
  timer: { paddingVertical: 10 },
  time: { fontSize: 20, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btn: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  start: { backgroundColor: '#10b981' },
  stop: { backgroundColor: '#ef4444' },
  add: { backgroundColor: '#2563eb' },
  btnTxt: { color: '#fff', fontWeight: '800' },
  note: { flex: 1, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#fff' },
  moment: { flexDirection: 'row', gap: 8, paddingVertical: 6 },
  momentTs: { color: '#0ea5e9', fontWeight: '700' },
  momentNote: { color: '#111827' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff' },
  link: { color: '#2563eb', marginTop: 12 }
});
