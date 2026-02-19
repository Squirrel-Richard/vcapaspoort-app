import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';

// Redirect to scanner screen (fullscreen modal)
export default function ScannerTab() {
  useEffect(() => {
    router.push('/scanner');
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="qr-code-outline" size={48} color={Colors.blue[400]} />
      <Text style={styles.text}>Scanner openen...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.deep, alignItems: 'center', justifyContent: 'center', gap: 16 },
  text: { color: Colors.text.secondary, fontSize: 16 },
});
