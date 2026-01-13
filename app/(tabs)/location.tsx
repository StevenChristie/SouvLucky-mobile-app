import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LocationsScreen() {
  
  // This allows users to tap a number to call the restaurant directly
  const makeCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.mainTitle}>Locations</Text>

        {/* PARKMORE BRANCH */}
        <View style={styles.card}>
          <Text style={styles.branchName}>SouvLucky Parkmore</Text>
          <Text style={styles.statusOpen}>Open Daily</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color="#003366" />
            <Text style={styles.infoText}>130, 11th Street, Parkmore, Sandton</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#003366" />
            <Text style={styles.infoText}>Mon - Sun: 10:00 - 20:00</Text>
          </View>

          <TouchableOpacity style={styles.callButton} onPress={() => makeCall('0816432195')}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.callButtonText}>Call: 081 643 2195</Text>
          </TouchableOpacity>
        </View>

        {/* PRISON BREAK MARKET BRANCH */}
        <View style={styles.card}>
          <Text style={styles.branchName}>Prison Break Market</Text>
          <Text style={styles.statusWeekend}>Thu - Sun Only</Text>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color="#003366" />
            <Text style={styles.infoText}>The Yard Eatery, 10 MacMillan Rd, Glenferness</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#003366" />
            <Text style={styles.infoText}>Thu - Sun: 10:00 - 19:00</Text>
          </View>

          <TouchableOpacity style={styles.callButton} onPress={() => makeCall('0735293187')}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.callButtonText}>Call: 073 529 3187</Text>
          </TouchableOpacity>
        </View>

        {/* CATERING CONTACT */}
        <View style={styles.cateringCard}>
          <Text style={styles.cateringTitle}>Catering Services</Text>
          <Text style={styles.cateringText}>For events and corporate functions:</Text>
          <TouchableOpacity onPress={() => makeCall('0833262249')}>
            <Text style={styles.cateringLink}>083 326 2249</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  scrollContent: { padding: 20 },
  mainTitle: { fontSize: 32, fontWeight: 'bold', color: '#003366', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  branchName: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  statusOpen: { color: '#27ae60', fontWeight: 'bold', marginBottom: 15 },
  statusWeekend: { color: '#e67e22', fontWeight: 'bold', marginBottom: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoText: { fontSize: 16, color: '#555', marginLeft: 10, flexShrink: 1 },
  callButton: { backgroundColor: '#003366', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 8, marginTop: 10 },
  callButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  cateringCard: { padding: 20, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#ddd', marginTop: 10 },
  cateringTitle: { fontSize: 18, fontWeight: 'bold', color: '#003366' },
  cateringText: { color: '#666', marginTop: 5 },
  cateringLink: { color: '#003366', fontWeight: 'bold', fontSize: 18, marginTop: 5 }
});