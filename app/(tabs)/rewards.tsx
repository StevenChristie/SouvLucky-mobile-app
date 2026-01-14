import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function RewardsScreen() {
  const [punches, setPunches] = useState(0); // Starts at 0 stamps
  const [showQR, setShowQR] = useState(false);
  const totalSpots = 10;

  // 1. Logic: What happens when they hit 10 stamps?
  useEffect(() => {
    if (punches === totalSpots) {
      Alert.alert(
        "OPA! 🎉",
        "You've earned a FREE Gyro! Show this message to the cashier to redeem.",
        [{ text: "Awesome!", onPress: () => console.log("Reward Ready") }]
      );
    }
  }, [punches]);

  // 2. Simulate earning a stamp (For your demo/testing)
  const addStamp = () => {
    if (punches < totalSpots) {
      setPunches(punches + 1);
    }
  };

  const resetCard = () => {
    setPunches(0);
    setShowQR(false);
  };

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
        <Text style={styles.subtitle}>{punches} of {totalSpots} Stamps Collected</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Digital Loyalty Card</Text>
        <FlatList
          data={Array.from({ length: totalSpots })}
          renderItem={renderSpot}
          keyExtractor={(_, index) => index.toString()}
          numColumns={5}
          contentContainerStyle={styles.grid}
          scrollEnabled={false}
        />
        
        {/* Progress Bar for extra visual feedback */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${(punches / totalSpots) * 100}%` }]} />
        </View>
      </View>

      {/* Main Interaction Button */}
      <TouchableOpacity 
        style={[styles.scanButton, punches === totalSpots && styles.redeemMode]} 
        onPress={() => setShowQR(true)}
      >
        <Ionicons 
          name={punches === totalSpots ? "gift-outline" : "qr-code-outline"} 
          size={24} 
          color="#FFF" 
          style={{marginRight: 10}} 
        />
        <Text style={styles.scanButtonText}>
          {punches === totalSpots ? "REDEEM FREE GYRO" : "EARN A STAMP"}
        </Text>
      </TouchableOpacity>

      {/* SECRET BUTTON: Use this to test the app during your demo */}
      <TouchableOpacity style={styles.debugButton} onPress={addStamp}>
        <Text style={styles.debugText}>[Debug] Add Stamp</Text>
      </TouchableOpacity>

      {/* QR MODAL */}
      <Modal visible={showQR} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.qrContainer}>
            <TouchableOpacity style={styles.closeModal} onPress={() => setShowQR(false)}>
              <Ionicons name="close" size={30} color="#333" />
            </TouchableOpacity>
            
            <Text style={styles.qrTitle}>
              {punches === totalSpots ? "Redeem Reward" : "Earn Stamp"}
            </Text>
            
            <View style={styles.qrPlaceholder}>
               <Ionicons name="qr-code" size={180} color={punches === totalSpots ? "#E74C3C" : "#003366"} />
            </View>
            
            <Text style={styles.qrInstructions}>
              {punches === totalSpots 
                ? "Staff: Please scan to process the free meal." 
                : "Ask your server to scan this code after your meal!"}
            </Text>

            {punches === totalSpots && (
              <TouchableOpacity style={styles.resetButton} onPress={resetCard}>
                <Text style={styles.resetText}>Finish Redemption</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F9', alignItems: 'center' },
  header: { backgroundColor: '#003366', width: '100%', paddingVertical: 40, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  title: { fontSize: 26, fontWeight: '900', color: '#FFF' },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 5 },
  card: { backgroundColor: '#FFF', width: width * 0.9, borderRadius: 20, padding: 20, marginTop: -30, elevation: 10 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#2C3E50', textAlign: 'center' },
  grid: { alignItems: 'center', marginTop: 15, marginBottom: 20 },
  spot: { width: 55, height: 55, borderRadius: 28, borderWidth: 2, borderColor: '#ECF0F1', margin: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  spotFilled: { backgroundColor: '#003366', borderColor: '#003366' },
  
  progressBarBg: { height: 10, backgroundColor: '#ECF0F1', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#27AE60' },

  scanButton: { backgroundColor: '#003366', flexDirection: 'row', width: width * 0.9, paddingVertical: 20, borderRadius: 15, marginTop: 40, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  redeemMode: { backgroundColor: '#E74C3C' }, // Changes to Red when free meal is earned
  scanButtonText: { color: '#FFF', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  
  debugButton: { marginTop: 20, padding: 10 },
  debugText: { color: '#BDC3C7', fontSize: 12, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  qrContainer: { backgroundColor: '#FFF', width: width * 0.85, padding: 30, borderRadius: 30, alignItems: 'center' },
  closeModal: { alignSelf: 'flex-end' },
  qrTitle: { fontSize: 20, fontWeight: '800', color: '#003366', marginBottom: 20 },
  qrPlaceholder: { padding: 20, backgroundColor: '#F9F9F9', borderRadius: 20, marginBottom: 20 },
  qrInstructions: { fontSize: 14, color: '#7F8C8D', textAlign: 'center', lineHeight: 20 },
  resetButton: { marginTop: 20, backgroundColor: '#003366', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  resetText: { color: '#FFF', fontWeight: '700' }
});