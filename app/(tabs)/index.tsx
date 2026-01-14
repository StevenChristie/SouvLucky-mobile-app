import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      
      {/* 1. THE PERFECT FRAME: Placing the border images on all 4 sides */}
      {/* Top Border */}
      <Image 
        source={require('../../assets/images/Greek-Paten.png')} 
        style={[styles.borderHorizontal, { top: 0 }]} 
        resizeMode="repeat" 
      />
      {/* Bottom Border */}
      <Image 
        source={require('../../assets/images/Greek-Paten.png')} 
        style={[styles.borderHorizontal, { bottom: 0 }]} 
        resizeMode="repeat" 
      />
      {/* Left Border */}
      <Image 
        source={require('../../assets/images/Greek-Paten.png')} 
        style={[styles.borderVertical, { left: 0 }]} 
        resizeMode="repeat" 
      />
      {/* Right Border */}
      <Image 
        source={require('../../assets/images/Greek-Paten.png')} 
        style={[styles.borderVertical, { right: 0 }]} 
        resizeMode="repeat" 
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/SouvLucky-Logo.avif')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Tagline and Button Section */}
          <View style={styles.bottomSection}>
            <Text style={styles.tagline}>Authentic Greek Street Food</Text>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => router.push('/explore')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>VIEW FULL MENU</Text>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', // Solid white background
  },
  // Border Styles to prevent distortion
  borderHorizontal: {
    position: 'absolute',
    width: width,
    height: 25, // Adjust this for border thickness
    zIndex: 10,
  },
  borderVertical: {
    position: 'absolute',
    width: 25, // Adjust this for border thickness
    height: height,
    zIndex: 10,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingVertical: 80, // High vertical padding to stay clear of borders
    paddingHorizontal: 40,
  },
  logoContainer: {
    width: width * 0.8,
    height: 180,
    marginTop: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '600',
    color: '#003366', 
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 45,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#003366', 
    paddingVertical: 18,
    width: width * 0.7,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
});