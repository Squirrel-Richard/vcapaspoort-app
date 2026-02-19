import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Alert
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation on scanner frame
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Fade in
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [pulseAnim, fadeAnim]);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="camera-outline" size={48} color={Colors.blue[400]} />
        <Text style={styles.permText}>Camera toegang nodig</Text>
        <Text style={styles.permSub}>Om QR-codes te scannen heeft de app camera-toegang nodig.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permBtn}>
          <Text style={styles.permBtnText}>Toegang verlenen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Terug</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    setScanResult(data);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Check if it's a VCA Paspoort QR
    if (data.includes('vcapaspoort.nl') || data.includes('medewerker')) {
      Alert.alert(
        '✅ VCA QR-code gevonden',
        `Certificaat gevonden: ${data}`,
        [
          {
            text: 'Bekijk certificaat',
            onPress: () => {
              router.back();
              // Navigate to certificate
            },
          },
          {
            text: 'Opnieuw scannen',
            onPress: () => {
              setScanned(false);
              setScanResult(null);
            },
          },
        ]
      );
    } else {
      Alert.alert(
        '⚠️ Onbekende QR-code',
        'Dit is geen VCA Paspoort QR-code.',
        [{ text: 'OK', onPress: () => { setScanned(false); setScanResult(null); } }]
      );
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Top */}
        <View style={styles.overlayTop}>
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Scan VCA-pas</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Scanner frame */}
        <View style={styles.frameWrap}>
          <Animated.View
            style={[styles.frame, { transform: [{ scale: pulseAnim }] }]}
          >
            {/* Corner borders */}
            {[
              { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
              { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
              { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
              { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
            ].map((cornerStyle, i) => (
              <View
                key={i}
                style={[styles.corner, cornerStyle, { borderColor: Colors.blue[400] }]}
              />
            ))}
          </Animated.View>
        </View>

        {/* Bottom */}
        <View style={styles.overlayBottom}>
          <Ionicons name="qr-code-outline" size={24} color="rgba(255,255,255,0.6)" style={{ marginBottom: 8 }} />
          <Text style={styles.hint}>Richt de camera op de QR-code</Text>
          <Text style={styles.hintSub}>van de digitale VCA-pas</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const FRAME_SIZE = 260;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16, backgroundColor: Colors.bg.deep },
  permText: { fontSize: 22, fontWeight: '800', color: Colors.text.primary, textAlign: 'center' },
  permSub: { fontSize: 15, color: Colors.text.secondary, textAlign: 'center', lineHeight: 22 },
  permBtn: {
    backgroundColor: Colors.blue[500], borderRadius: 16,
    paddingHorizontal: 32, paddingVertical: 14, marginTop: 8,
  },
  permBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  backBtn: { paddingHorizontal: 32, paddingVertical: 12 },
  backBtnText: { color: Colors.text.muted, fontSize: 15 },
  overlay: { flex: 1 },
  overlayTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 20, paddingTop: 60,
  },
  closeBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  frameWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame: {
    width: FRAME_SIZE, height: FRAME_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 32, height: 32,
    borderRadius: 2,
  },
  overlayBottom: { padding: 40, alignItems: 'center', paddingBottom: 60 },
  hint: { color: 'rgba(255,255,255,0.85)', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  hintSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', marginTop: 4 },
});
