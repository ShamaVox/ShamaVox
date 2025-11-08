import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';

type Reflection = {
  feeling: string;
  thought: string;
  alternative_thought: string;
};

type Props = {
  visible: boolean;
  transaction?: { id: string; name: string; amount: number } | null;
  onClose: () => void;
  onSubmit: (tId: string, payload: Reflection) => Promise<void>;
};

const OPTIONS = {
  feeling: ['Lonely', 'Anxious', 'Celebratory', 'Justified'],
  thought: ['I deserve this.', 'It’s just a small treat.', 'I need it right now.'],
  reframe: ['Can I pause before spending?', 'Is this aligned with my goals?'],
};

export default function CognitiveReflectionModal({ visible, transaction, onClose, onSubmit }: Props) {
  const [feeling, setFeeling] = useState('');
  const [thought, setThought] = useState('');
  const [reframe, setReframe] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (visible) { setFeeling(''); setThought(''); setReframe(''); } }, [visible, transaction?.id]);

  const renderOptions = (type: keyof typeof OPTIONS, value: string, setValue: (s: string) => void) => (
    <View style={styles.optionGroup}>
      {OPTIONS[type].map(opt => (
        <TouchableOpacity key={opt} style={[styles.optionButton, value === opt && styles.optionButtonSelected]} onPress={() => setValue(opt)}>
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const handleSubmit = async () => {
    if (!transaction) return;
    if (!feeling || !thought || !reframe) { Alert.alert('Incomplete', 'Please select all three options.'); return; }
    setLoading(true);
    try {
      await onSubmit(transaction.id, { feeling, thought, alternative_thought: reframe });
      Alert.alert('Saved', 'Reflection saved successfully.');
      onClose();
    } catch(e) {
      Alert.alert('Error', 'Failed to save reflection.');
    } finally { setLoading(false); }
  };

  if (!transaction) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.header}>🧠 Mindful Reflection</Text>
        {loading ? (
          <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={styles.txnText}>
              {transaction.name} - ${transaction.amount.toFixed(2)}
            </Text>
            <Text style={styles.question}>💬 What were you feeling before this purchase?</Text>
            {renderOptions('feeling', feeling, setFeeling)}
            <Text style={styles.question}>🧠 What thought crossed your mind?</Text>
            {renderOptions('thought', thought, setThought)}
            <Text style={styles.question}>🔄 What could you try thinking next time?</Text>
            {renderOptions('reframe', reframe, setReframe)}
            <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48, backgroundColor: '#fff' },
  header: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  txnText: { marginBottom: 12, fontSize: 16, color: '#444' },
  question: { fontSize: 16, fontWeight: '600', marginVertical: 8 },
  optionGroup: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  optionButton: { padding: 10, borderRadius: 8, backgroundColor: '#eee', margin: 5 },
  optionButtonSelected: { backgroundColor: '#4CAF50' },
  optionText: { fontSize: 14 },
  submit: { marginTop: 16, paddingVertical: 12, backgroundColor: '#2B6168', borderRadius: 12, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700' },
});
