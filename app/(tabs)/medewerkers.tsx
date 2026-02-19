import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Animated, Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

const mockEmployees = [
  { id: '1', naam: 'Peter Janssen', type: 'VCA VOL', status: 'verloopt_binnenkort', expires: '2026-03-18' },
  { id: '2', naam: 'Maria de Groot', type: 'VCA BASIS', status: 'verloopt_binnenkort', expires: '2026-04-05' },
  { id: '3', naam: 'Kees van Dam', type: 'VCA VOL', status: 'verlopen', expires: '2026-02-14' },
  { id: '4', naam: 'Linda Smits', type: 'VCA BASIS', status: 'geldig', expires: '2026-08-22' },
  { id: '5', naam: 'Tom Vermeer', type: 'VCA VOL', status: 'geldig', expires: '2027-01-10' },
  { id: '6', naam: 'Annelies Bakker', type: 'VCA VOL', status: 'geldig', expires: '2027-03-25' },
  { id: '7', naam: 'Roel Hendriks', type: 'VCA BASIS', status: 'geldig', expires: '2026-11-08' },
  { id: '8', naam: 'Sandra Pietersen', type: 'VCA VOL Petrochemie', status: 'geldig', expires: '2027-06-15' },
];

const statusConfig: Record<string, { color: string; icon: string; label: string }> = {
  geldig: { color: Colors.emerald[400], icon: 'shield-checkmark', label: 'Geldig' },
  verloopt_binnenkort: { color: Colors.amber[400], icon: 'time', label: 'Verloopt' },
  verlopen: { color: Colors.red[400], icon: 'warning', label: 'Verlopen' },
};

function EmployeeCard({ item, index }: { item: typeof mockEmployees[0]; index: number }) {
  const scale = useRef(new Animated.Value(1)).current;
  const cfg = statusConfig[item.status];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 8, tension: 200 }),
    ]).start(() => router.push(`/medewerker/${item.id}`));
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <BlurView intensity={15} tint="dark" style={styles.card}>
          {/* Avatar */}
          <View style={[styles.avatar, { backgroundColor: cfg.color + '20' }]}>
            <Text style={[styles.avatarText, { color: cfg.color }]}>
              {item.naam.charAt(0)}
            </Text>
          </View>

          {/* Info */}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.naam}>{item.naam}</Text>
            <Text style={styles.type}>{item.type}</Text>
          </View>

          {/* Status */}
          <View style={[styles.statusBadge, { backgroundColor: cfg.color + '15', borderColor: cfg.color + '30' }]}>
            <Ionicons name={cfg.icon as React.ComponentProps<typeof Ionicons>['name']} size={12} color={cfg.color} />
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>

          <Ionicons name="chevron-forward" size={16} color={Colors.text.muted} style={{ marginLeft: 8 }} />
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function MedewerkersScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'geldig' | 'verloopt_binnenkort' | 'verlopen'>('all');

  const filtered = mockEmployees.filter(e => {
    const matchSearch = e.naam.toLowerCase().includes(search.toLowerCase()) || e.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || e.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <Text style={styles.title}>Medewerkers</Text>
        <TouchableOpacity
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          style={styles.addButton}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color={Colors.text.muted} style={styles.searchIcon} />
        <TextInput
          placeholder="Zoek medewerker..."
          placeholderTextColor={Colors.text.muted}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {(['all', 'geldig', 'verloopt_binnenkort', 'verlopen'] as const).map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => { Haptics.selectionAsync(); setFilter(f); }}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'Alle' : f === 'geldig' ? 'Geldig' : f === 'verloopt_binnenkort' ? 'Verloopt' : 'Verlopen'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item, index }) => <EmployeeCard item={item} index={index} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={40} color={Colors.text.muted} />
            <Text style={styles.emptyText}>Geen medewerkers gevonden</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.deep },
  headerWrap: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '900', color: Colors.text.primary },
  addButton: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.blue[500], alignItems: 'center', justifyContent: 'center',
  },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bg.glass, borderRadius: 14,
    marginHorizontal: 20, marginBottom: 12, paddingHorizontal: 14,
    borderWidth: 1, borderColor: Colors.border.subtle, height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: Colors.text.primary, fontSize: 15 },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10,
    backgroundColor: Colors.bg.glass, borderWidth: 1, borderColor: Colors.border.subtle,
  },
  filterChipActive: { backgroundColor: Colors.blue[500] + '30', borderColor: Colors.blue[500] + '60' },
  filterText: { fontSize: 12, fontWeight: '600', color: Colors.text.muted },
  filterTextActive: { color: Colors.blue[400] },
  list: { paddingHorizontal: 20, paddingBottom: 120 },
  card: {
    borderRadius: 16, padding: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border.subtle,
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
  },
  avatar: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800' },
  naam: { fontSize: 15, fontWeight: '700', color: Colors.text.primary },
  type: { fontSize: 12, color: Colors.text.muted, marginTop: 1 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: Colors.text.muted, fontSize: 15 },
});
