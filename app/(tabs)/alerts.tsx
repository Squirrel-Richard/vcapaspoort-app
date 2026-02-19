import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

const mockAlerts = [
  { id: '1', naam: 'Kees van Dam', type: 'VCA VOL', daysLeft: -5, priority: 'critical' },
  { id: '2', naam: 'Peter Janssen', type: 'VCA VOL', daysLeft: 28, priority: 'high' },
  { id: '3', naam: 'Maria de Groot', type: 'VCA BASIS', daysLeft: 45, priority: 'medium' },
  { id: '4', naam: 'Linda Smits', type: 'VCA BASIS', daysLeft: 67, priority: 'low' },
];

const priorityConfig: Record<string, { color: string; icon: string; label: string }> = {
  critical: { color: Colors.red[400], icon: 'alert-circle', label: 'Kritiek' },
  high: { color: Colors.amber[400], icon: 'warning', label: 'Hoog' },
  medium: { color: '#f97316', icon: 'time', label: 'Medium' },
  low: { color: Colors.emerald[400], icon: 'checkmark-circle', label: 'Laag' },
};

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        <View style={[styles.badge, { backgroundColor: Colors.red[400] + '20' }]}>
          <Text style={[styles.badgeText, { color: Colors.red[400] }]}>{mockAlerts.filter(a => a.daysLeft < 0).length} kritiek</Text>
        </View>
      </View>

      <FlatList
        data={mockAlerts}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const cfg = priorityConfig[item.priority];
          return (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(`/medewerker/${item.id}`);
              }}
              activeOpacity={0.8}
            >
              <BlurView intensity={15} tint="dark" style={[styles.card, { borderColor: cfg.color + '30' }]}>
                <View style={[styles.iconWrap, { backgroundColor: cfg.color + '15' }]}>
                  <Ionicons name={cfg.icon as React.ComponentProps<typeof Ionicons>['name']} size={22} color={cfg.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.naam}>{item.naam}</Text>
                  <Text style={styles.type}>{item.type}</Text>
                  <View style={[styles.pill, { backgroundColor: cfg.color + '15' }]}>
                    <Text style={[styles.pillText, { color: cfg.color }]}>
                      {item.daysLeft < 0
                        ? `❌ Verlopen — ${Math.abs(item.daysLeft)} dagen geleden`
                        : `⚠️ Verloopt over ${item.daysLeft} dagen`}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.text.muted} />
              </BlurView>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={40} color={Colors.text.muted} />
            <Text style={styles.emptyText}>Geen actieve alerts</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.deep },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '900', color: Colors.text.primary, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  list: { paddingHorizontal: 20, paddingBottom: 120 },
  card: {
    borderRadius: 18, padding: 16, overflow: 'hidden',
    borderWidth: 1, flexDirection: 'row', alignItems: 'center', marginBottom: 12,
  },
  iconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  naam: { fontSize: 16, fontWeight: '700', color: Colors.text.primary, marginBottom: 2 },
  type: { fontSize: 12, color: Colors.text.muted, marginBottom: 8 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  pillText: { fontSize: 12, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { color: Colors.text.muted, fontSize: 15 },
});
