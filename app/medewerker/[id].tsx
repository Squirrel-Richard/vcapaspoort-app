import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Platform, Share
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

const getMockEmployee = (id: string) => ({
  id,
  naam: 'Peter Janssen',
  email: 'peter.janssen@bouwbedrijf.nl',
  telefoon: '06-12345678',
  company: 'Bouwbedrijf Janssen B.V.',
  certificates: [
    {
      id: 'cert-1',
      type: 'VCA VOL',
      certificaat_nummer: 'VCA-VOL-2023-089421',
      uitgever: 'SSVV',
      geldig_van: '2023-03-18',
      geldig_tot: '2026-03-18',
      status: 'verloopt_binnenkort',
      daysLeft: 28,
    },
    {
      id: 'cert-2',
      type: 'VCA BASIS',
      certificaat_nummer: 'VCA-BAS-2021-044321',
      uitgever: 'Exito',
      geldig_van: '2021-03-18',
      geldig_tot: '2024-03-18',
      status: 'verlopen',
      daysLeft: -330,
    },
  ],
});

function CertCard({ cert }: { cert: ReturnType<typeof getMockEmployee>['certificates'][0] }) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const progress = Math.max(0, Math.min(1, cert.daysLeft / 365));
    Animated.timing(progressAnim, {
      toValue: progress, duration: 1200, delay: 300, useNativeDriver: false,
    }).start();
  }, [cert.daysLeft, progressAnim]);

  const color = cert.daysLeft < 0 ? Colors.red[400] : cert.daysLeft < 30 ? Colors.red[400] : cert.daysLeft < 90 ? Colors.amber[400] : Colors.emerald[400];
  const bgColor = cert.daysLeft < 0 ? Colors.red.glow : cert.daysLeft < 90 ? Colors.amber.glow : Colors.emerald.glow;

  const barWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <BlurView intensity={15} tint="dark" style={[styles.certCard, { borderColor: color + '30' }]}>
      <View style={styles.certHeader}>
        <View>
          <Text style={styles.certType}>{cert.type}</Text>
          <Text style={styles.certNummer}>Nr: {cert.certificaat_nummer}</Text>
        </View>
        <View style={[styles.certStatusBadge, { backgroundColor: bgColor, borderColor: color + '40' }]}>
          <Ionicons
            name={cert.daysLeft < 0 ? 'close-circle' : cert.daysLeft < 90 ? 'time' : 'checkmark-circle'}
            size={14} color={color}
          />
          <Text style={[styles.certStatusText, { color }]}>
            {cert.daysLeft < 0 ? `Verlopen` : `${cert.daysLeft}d`}
          </Text>
        </View>
      </View>

      <View style={styles.certMeta}>
        <View style={styles.certMetaItem}>
          <Text style={styles.certMetaLabel}>Geldig van</Text>
          <Text style={styles.certMetaValue}>{new Date(cert.geldig_van).toLocaleDateString('nl-NL')}</Text>
        </View>
        <View style={styles.certMetaItem}>
          <Text style={styles.certMetaLabel}>Geldig tot</Text>
          <Text style={[styles.certMetaValue, { color }]}>{new Date(cert.geldig_tot).toLocaleDateString('nl-NL')}</Text>
        </View>
        <View style={styles.certMetaItem}>
          <Text style={styles.certMetaLabel}>Uitgever</Text>
          <Text style={styles.certMetaValue}>{cert.uitgever}</Text>
        </View>
      </View>

      {cert.daysLeft > 0 && (
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <Animated.View style={[styles.progressFill, { width: barWidth, backgroundColor: color }]} />
          </View>
        </View>
      )}
    </BlurView>
  );
}

export default function MedewerkerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const emp = getMockEmployee(id);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await Share.share({
      message: `VCA-pas van ${emp.naam}: https://vcapaspoort.nl/medewerker/${id}/pas`,
      title: `VCA Pas — ${emp.naam}`,
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <BlurView intensity={30} tint="dark" style={styles.headerBlur}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Medewerker</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
            <Ionicons name="share-outline" size={22} color={Colors.blue[400]} />
          </TouchableOpacity>
        </View>
      </BlurView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <BlurView intensity={20} tint="dark" style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>{emp.naam.charAt(0)}</Text>
          </View>
          <Text style={styles.naam}>{emp.naam}</Text>
          <Text style={styles.company}>{emp.company}</Text>
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="mail-outline" size={18} color={Colors.blue[400]} />
              <Text style={styles.contactBtnText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="call-outline" size={18} color={Colors.blue[400]} />
              <Text style={styles.contactBtnText}>Bellen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              style={[styles.contactBtn, { backgroundColor: Colors.blue[500] + '20', borderColor: Colors.blue[500] + '40' }]}
            >
              <Ionicons name="qr-code-outline" size={18} color={Colors.blue[400]} />
              <Text style={[styles.contactBtnText, { color: Colors.blue[400] }]}>QR Pas</Text>
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* Certificates */}
        <Text style={styles.sectionTitle}>VCA Certificaten</Text>
        {emp.certificates.map(cert => (
          <CertCard key={cert.id} cert={cert} />
        ))}

        <TouchableOpacity style={styles.addCertBtn}>
          <Ionicons name="add-circle-outline" size={20} color={Colors.blue[400]} />
          <Text style={styles.addCertText}>Certificaat toevoegen</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.deep },
  headerBlur: {
    paddingTop: Platform.OS === 'ios' ? 54 : 30, paddingBottom: 14,
    paddingHorizontal: 20, borderBottomWidth: 1, borderColor: Colors.border.subtle,
    overflow: 'hidden',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: Colors.text.primary },
  shareBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 20 },
  profileCard: {
    borderRadius: 24, padding: 24, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border.subtle,
    alignItems: 'center', marginBottom: 24,
  },
  avatarWrap: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: Colors.blue[500] + '20',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 30, fontWeight: '900', color: Colors.blue[400] },
  naam: { fontSize: 22, fontWeight: '800', color: Colors.text.primary, marginBottom: 4 },
  company: { fontSize: 14, color: Colors.text.muted, marginBottom: 20 },
  contactRow: { flexDirection: 'row', gap: 10 },
  contactBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
    backgroundColor: Colors.bg.glass, borderWidth: 1, borderColor: Colors.border.subtle,
  },
  contactBtnText: { fontSize: 13, fontWeight: '600', color: Colors.text.secondary },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.text.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  certCard: {
    borderRadius: 20, padding: 18, overflow: 'hidden',
    borderWidth: 1, marginBottom: 14,
  },
  certHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  certType: { fontSize: 18, fontWeight: '800', color: Colors.text.primary },
  certNummer: { fontSize: 12, color: Colors.text.muted, marginTop: 2 },
  certStatusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1,
  },
  certStatusText: { fontSize: 13, fontWeight: '700' },
  certMeta: { flexDirection: 'row', gap: 0, marginBottom: 14 },
  certMetaItem: { flex: 1 },
  certMetaLabel: { fontSize: 11, color: Colors.text.muted, marginBottom: 3 },
  certMetaValue: { fontSize: 13, fontWeight: '600', color: Colors.text.primary },
  progressWrap: { marginTop: 4 },
  progressBg: { height: 4, backgroundColor: Colors.bg.layer3, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  addCertBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.border.mid,
    borderRadius: 18, padding: 16, marginTop: 8,
  },
  addCertText: { color: Colors.blue[400], fontSize: 15, fontWeight: '600' },
});
