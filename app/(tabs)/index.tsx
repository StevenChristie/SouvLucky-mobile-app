import { useRouter } from 'expo-router';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* The Logo you successfully linked */}
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />

        {/* Branding Section */}
        <View style={styles.header}>
          <Text style={styles.title}>SouvLucky</Text>
          <Text style={styles.subtitle}>GREEK KITCHEN</Text>
        </View>

        <Text style={styles.tagline}>Authentic Greek Recipes</Text>

        {/* Navigation Button */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/explore')}
        >
          <Text style={styles.buttonText}>VIEW FULL MENU</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#003366', // Official SouvLucky Blue
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 50,
    fontStyle: 'italic',
    color: '#333',
  },
  button: {
    backgroundColor: '#003366',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Adds a nice shadow on Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});