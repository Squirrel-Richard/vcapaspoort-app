import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

const menuItems = [
  { icon: 'business-outline', label: 'Bedrijfsinstellingen', sub: 'Naam, KvK, contactgegevens' },
  { icon: 'notifications-outline', label: 'Notificaties', sub: 'Email en WhatsApp alerts' },
  { icon: 'card-outline', label: 'Abonnement', sub: 'Gratis plan · Upgrade naar Pro' },
  { icon: 'shield-checkmark-outline', label: 'Beveiliging & AVG', sub: 'Privacy instellingen' },
  { icon: 'help-circle-outline', label: 'Hulp & Support', sub: 'Documentatie en contact' },
];

export default function ProfielScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profiel</Text>
      </View>

      {/* Company Card */}
      <BlurView intensity={20} tint="dark" style={styles.companyCard}>
        <View style={styles.companyAvatar}>
          <Text style={styles.companyInitial}>BJ</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.companyName}>Bouwbedrijf Janssen B.V.</Text>
          <Text style={styles.companySub}>KvK: 12345678 · Pro plan</Text>
        </View>
        <View style={[styles.planBadge, { backgroundColor: Colors.blue[500] + '20', borderColor: Colors.blue[500] + '40' }]}>
          <Text style={[styles.planText, { color: Colors.blue[400] }]}>Pro</Text>
        </View>
      </BlurView>

      {/* Menu items */}
      <View style={styles.section}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            activeOpacity={0.8}
          >
            <BlurView intensity={10} tint="dark" style={[
              styles.menuItem,
              index === 0 && styles.menuItemFirst,
              index === menuItems.length - 1 && styles.menuItemLast,
            ]}>
              <View style={styles.menuIconWrap}>
                <Ionicons name={item.icon as React.ComponentProps<typeof Ionicons>['name']} size={20} color={Colors.blue[400]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.text.muted} />
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          Alert.alert('Uitloggen', 'Weet u zeker dat u wilt uitloggen?', [
            { text: 'Annuleren', style: 'cancel' },
            { text: 'Uitloggen', style: 'destructive', onPress: () => {} },
          ]);
        }}
        activeOpacity={0.8}
      >
        <BlurView intensity={10} tint="dark" style={[styles.menuItem, { borderColor: Colors.red[400] + '20', marginTop: 16 }]}>
          <View style={[styles.menuIconWrap, { backgroundColor: Colors.red[400] + '15' }]}>
            <Ionicons name="log-out-outline" size={20} color={Colors.red[400]} />
          </View>
          <Text style={[styles.menuLabel, { color: Colors.red[400] }]}>Uitloggen</Text>
        </BlurView>
      </TouchableOpacity>

      <Text style={styles.version}>VCA Paspoort NL v1.0.0 · vcapaspoort.nl</Text>

      <View style={{ height: 100 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.deep, paddingHorizontal: 20 },
  header: { paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', color: Colors.text.primary },
  companyCard: {
    borderRadius: 20, padding: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border.subtle,
    flexDirection: 'row', alignItems: 'center', marginBottom: 24,
  },
  companyAvatar: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: Colors.blue[500] + '25',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  companyInitial: { fontSize: 20, fontWeight: '800', color: Colors.blue[400] },
  companyName: { fontSize: 16, fontWeight: '700', color: Colors.text.primary },
  companySub: { fontSize: 12, color: Colors.text.muted, marginTop: 2 },
  planBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  planText: { fontSize: 12, fontWeight: '700' },
  section: { gap: 1, borderRadius: 20, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderWidth: 1, borderColor: Colors.border.subtle,
    overflow: 'hidden', marginBottom: 2, borderRadius: 16,
  },
  menuItemFirst: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  menuItemLast: { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  menuIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.blue[500] + '15',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  menuLabel: { fontSize: 15, fontWeight: '600', color: Colors.text.primary },
  menuSub: { fontSize: 12, color: Colors.text.muted, marginTop: 1 },
  version: { textAlign: 'center', color: Colors.text.muted, fontSize: 12, marginTop: 24 },
});
