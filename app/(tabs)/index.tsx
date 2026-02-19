import React, { useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Animated, Dimensions, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

const mockStats = {
  totalEmployees: 12,
  certified: 9,
  expiringWithin90: 3,
  expired: 1,
  complianceRate: 75,
};

const mockAlerts = [
  { id: '1', naam: 'Peter Janssen', type: 'VCA VOL', daysLeft: 28 },
  { id: '2', naam: 'Maria de Groot', type: 'VCA BASIS', daysLeft: 45 },
  { id: '3', naam: 'Kees van Dam', type: 'VCA VOL', daysLeft: -5 },
];

function AnimatedGlow({ color, style }: { color: string; style?: object }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  }, [anim]);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });
  return (
    <Animated.View style={[{ position: 'absolute', opacity }, style]}>
      <View style={{ width: 200, height: 200, borderRadius: 100, backgroundColor: color, opacity: 0.15 }} />
    </Animated.View>
  );
}

function StatCard({ label, value, icon, color, glow }: {
  label: string; value: number | string; icon: string; color: string; glow: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }),
    ]).start();
  };

  return (
    <TouchableOpacity onPress={press} activeOpacity={0.8} style={{ width: (width - 52) / 2 }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <BlurView intensity={20} tint="dark" style={[styles.statCard, { shadowColor: color, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }]}>
          <View style={[styles.statIcon, { backgroundColor: glow }]}>
            <Ionicons name={icon as React.ComponentProps<typeof Ionicons>['name']} size={18} color={color} />
          </View>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{label}</Text>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function DashboardScreen() {
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1, duration: 600, useNativeDriver: true,
    }).start();
  }, [headerAnim]);

  const compliancePct = mockStats.complianceRate;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - compliancePct / 100);

  return (
    <View style={styles.container}>
      {/* Background glows */}
      <AnimatedGlow color={Colors.blue[500]} style={{ top: -60, left: -60 }} />
      <AnimatedGlow color={Colors.emerald[500]} style={{ top: 200, right: -80 }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
          <View>
            <Text style={styles.greeting}>Goedemorgen 👋</Text>
            <Text style={styles.companyName}>Bouwbedrijf Janssen</Text>
          </View>
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/scanner'); }}
            style={styles.qrButton}
          >
            <Ionicons name="qr-code-outline" size={22} color={Colors.blue[400]} />
          </TouchableOpacity>
        </Animated.View>

        {/* Stats */}
        <Text style={styles.sectionTitle}>Overzicht</Text>
        <View style={styles.statsGrid}>
          <StatCard label="Medewerkers" value={mockStats.totalEmployees} icon="people-outline" color={Colors.blue[400]} glow={Colors.blue.glow} />
          <StatCard label="Gecertificeerd" value={mockStats.certified} icon="shield-checkmark-outline" color={Colors.emerald[400]} glow={Colors.emerald.glow} />
          <StatCard label="Verloopt binnenkort" value={mockStats.expiringWithin90} icon="time-outline" color={Colors.amber[400]} glow={Colors.amber.glow} />
          <StatCard label="Verlopen" value={mockStats.expired} icon="warning-outline" color={Colors.red[400]} glow={Colors.red.glow} />
        </View>

        {/* Compliance Ring */}
        <BlurView intensity={20} tint="dark" style={styles.complianceCard}>
          <Text style={styles.cardTitle}>VCA Compliance</Text>
          <View style={styles.complianceRow}>
            <View style={styles.ringContainer}>
              {/* SVG-less ring using border radius trick */}
              <View style={[styles.ringOuter, { borderColor: Colors.bg.layer3 }]}>
                <View style={[styles.ringInner, {
                  borderColor: compliancePct >= 80 ? Colors.emerald[500] : compliancePct >= 60 ? Colors.amber[500] : Colors.red[500],
                  shadowColor: compliancePct >= 80 ? Colors.emerald[500] : compliancePct >= 60 ? Colors.amber[500] : Colors.red[500],
                  shadowOpacity: 0.6,
                  shadowRadius: 8,
                }]}>
                  <Text style={styles.ringPct}>{compliancePct}%</Text>
                  <Text style={styles.ringLabel}>compliant</Text>
                </View>
              </View>
            </View>
            <View style={styles.complianceLegend}>
              {[
                { label: 'Gecertificeerd', count: mockStats.certified, color: Colors.emerald[400] },
                { label: 'Verloopt binnenkort', count: mockStats.expiringWithin90, color: Colors.amber[400] },
                { label: 'Verlopen', count: mockStats.expired, color: Colors.red[400] },
              ].map(item => (
                <View key={item.label} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <View>
                    <Text style={styles.legendCount}>{item.count}</Text>
                    <Text style={styles.legendLabel}>{item.label}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </BlurView>

        {/* Alerts */}
        <Text style={styles.sectionTitle}>🔔 Vervaldatum alerts</Text>
        {mockAlerts.map((alert) => (
          <TouchableOpacity
            key={alert.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/medewerker/${alert.id}`);
            }}
            activeOpacity={0.8}
          >
            <BlurView intensity={20} tint="dark" style={[styles.alertCard, {
              borderColor: alert.daysLeft < 0 ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)',
            }]}>
              <View style={[styles.alertDot, { backgroundColor: alert.daysLeft < 0 ? Colors.red[400] : Colors.amber[400] }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.alertName}>{alert.naam}</Text>
                <Text style={styles.alertType}>{alert.type}</Text>
              </View>
              <Text style={[styles.alertDays, { color: alert.daysLeft < 0 ? Colors.red[400] : Colors.amber[400] }]}>
                {alert.daysLeft < 0 ? `${Math.abs(alert.daysLeft)}d verlopen` : `${alert.daysLeft}d resterend`}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.text.muted} style={{ marginLeft: 8 }} />
            </BlurView>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.deep },
  scroll: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  greeting: { fontSize: 14, color: Colors.text.muted, marginBottom: 2 },
  companyName: { fontSize: 22, fontWeight: '800', color: Colors.text.primary },
  qrButton: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: Colors.bg.glass,
    borderWidth: 1, borderColor: Colors.border.subtle,
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.text.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  statCard: {
    borderRadius: 20, padding: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border.subtle,
  },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: 28, fontWeight: '900', color: Colors.text.primary, marginBottom: 2 },
  statLabel: { fontSize: 12, color: Colors.text.muted, fontWeight: '500' },
  complianceCard: {
    borderRadius: 24, padding: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border.subtle, marginBottom: 24,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.text.primary, marginBottom: 16 },
  complianceRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  ringContainer: { alignItems: 'center', justifyContent: 'center' },
  ringOuter: { width: 110, height: 110, borderRadius: 55, borderWidth: 10, alignItems: 'center', justifyContent: 'center' },
  ringInner: { width: 90, height: 90, borderRadius: 45, borderWidth: 10, alignItems: 'center', justifyContent: 'center' },
  ringPct: { fontSize: 22, fontWeight: '900', color: Colors.text.primary },
  ringLabel: { fontSize: 10, color: Colors.text.muted },
  complianceLegend: { flex: 1, gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendCount: { fontSize: 16, fontWeight: '800', color: Colors.text.primary },
  legendLabel: { fontSize: 11, color: Colors.text.muted },
  alertCard: {
    borderRadius: 16, padding: 14, overflow: 'hidden',
    borderWidth: 1, flexDirection: 'row', alignItems: 'center',
    marginBottom: 10,
  },
  alertDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  alertName: { fontSize: 15, fontWeight: '700', color: Colors.text.primary },
  alertType: { fontSize: 12, color: Colors.text.muted, marginTop: 1 },
  alertDays: { fontSize: 13, fontWeight: '600' },
});
