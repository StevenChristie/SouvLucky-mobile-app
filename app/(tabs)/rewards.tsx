import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function RewardsScreen() {
  // Mock data: 10 total spots, 6 are "punched"
  const [punches, setPunches] = useState(6);
  const totalSpots = 10;

  const renderSpot = ({ index }: { index: number }) => {
    const isFilled = index < punches;
    const isLast = index === totalSpots - 1;

    return (
      <View style={[styles.spot, isFilled && styles.spotFilled]}>
        {isLast ? (
          <Ionicons name="gift" size={30} color={isFilled ? "#FFF" : "#003366"} />
        ) : (
          <Ionicons 
            name={isFilled ? "checkmark-circle" : "ellipse-outline"} 
            size={28} 
            color={isFilled ? "#FFF" : "#BDC3C7"} 
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SouvLucky Rewards</Text>
        <Text style={styles.subtitle}>Eat. Earn. Repeat.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Loyalty Card</Text>
        <Text style={styles.cardDesc}>Collect 10 stamps to get a FREE Gyro!</Text>
        
        <FlatList
          data={Array.from({ length: totalSpots })}
          renderItem={renderSpot}
          keyExtractor={(_, index) => index.toString()}
          numColumns={5}
          contentContainerStyle={styles.grid}
          scrollEnabled={false}
        />

        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>{totalSpots - punches} more to go!</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.redeemButton}>
        <Text style={styles.redeemButtonText}>REDEEM AT COUNTER</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color="#7F8C8D" />
        <Text style={styles.infoText}>
          Ask your server to scan your code after every meal to earn stamps.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F9', alignItems: 'center' },
  header: { 
    backgroundColor: '#003366', 
    width: '100%', 
    paddingVertical: 40, 
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: { fontSize: 26, fontWeight: '900', color: '#FFF' },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 5 },
  card: {
    backgroundColor: '#FFF',
    width: width * 0.9,
    borderRadius: 20,
    padding: 20,
    marginTop: -30, // Overlaps the header for a modern look
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#2C3E50', textAlign: 'center' },
  cardDesc: { fontSize: 14, color: '#7F8C8D', textAlign: 'center', marginVertical: 10 },
  grid: { alignItems: 'center', marginTop: 20 },
  spot: {
    width: 55,
    height: 55,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#ECF0F1',
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  spotFilled: {
    backgroundColor: '#003366',
    borderColor: '#003366',
  },
  progressInfo: { marginTop: 20, alignItems: 'center' },
  progressText: { fontSize: 16, fontWeight: '700', color: '#003366' },
  redeemButton: {
    backgroundColor: '#003366',
    width: width * 0.9,
    paddingVertical: 18,
    borderRadius: 15,
    marginTop: 30,
    alignItems: 'center',
  },
  redeemButtonText: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  infoBox: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    marginTop: 30,
    alignItems: 'center',
  },
  infoText: { color: '#7F8C8D', fontSize: 12, marginLeft: 10, lineHeight: 18 },
});