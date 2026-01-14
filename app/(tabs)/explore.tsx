import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

// 1. Interfaces for your data
interface MenuItem {
  name: string;
  price: string;
  desc?: string;
  image?: any; 
}

interface MenuSection {
  title: string;
  data: MenuItem[];
}

// 2. Complete MENU_DATA with verified filenames
const MENU_DATA: MenuSection[] = [
  { 
    title: 'Meze & Dips', 
    data: [
      { name: 'Chips Medium', price: 'R 45.00', image: require('../../assets/images/chips.png') },
      { name: 'Zucchini Fries', price: 'R 62.00', desc: 'Crispy fried zucchini slices', image: require('../../assets/images/Zucchini-Fries.png') },
      { name: 'Zucchini Fries + Feta', price: 'R 76.00', desc: 'Sprinkled with authentic Greek feta', image: require('../../assets/images/Zucchini-Fries-Sprinkled-with-Feta-Cheese.png') },
      { name: 'Falafel (5 Pieces)', price: 'R 84.00', image: require('../../assets/images/Falafel-5-Pieces.png') },
      { name: 'Halloumi (4 Pieces)', price: 'R 84.00', image: require('../../assets/images/Halloumi-4-Pieces.png') },
      { name: 'Spanakopita (2 Pieces)', price: 'R 52.00', image: require('../../assets/images/Spanakopita-Spinach-and-Feta-Pie.png') },
      { name: 'Tiropita (2 Pieces)', price: 'R 52.00', image: require('../../assets/images/Tiropita-Feta-Cheese-Pie.png') },
      { name: 'Pita Bread', price: 'R 18.00', image: require('../../assets/images/Pita-Bread.png') },
      { name: 'Tzatziki', price: 'R 42.00', image: require('../../assets/images/Tzatziki.png') },
      { name: 'Hummus', price: 'R 42.00', image: require('../../assets/images/Hummus.png') },
      { name: 'Tarama (Fish Roe)', price: 'R 42.00' },
      { name: 'Tirokafteri (Chilli Feta)', price: 'R 42.00' }
    ] 
  },
  { 
    title: 'Gyros', 
    data: [
      { name: 'Lamb Gyro', price: 'R 110.00', desc: 'Tomato, onion, tzatziki in pita', image: require('../../assets/images/Lamb-Gyro.png') },
      { name: 'Beef Gyro', price: 'R 110.00', desc: 'Tomato, onion, tzatziki in pita', image: require('../../assets/images/Beef-Gyro.png') },
      { name: 'Chicken Gyro', price: 'R 95.00', desc: 'Tomato, onion, tzatziki in pita', image: require('../../assets/images/Chicken-Gyro.png') },
      { name: 'Pork Gyro', price: 'R 95.00', desc: 'Tomato, onion, tzatziki in pita', image: require('../../assets/images/Pork-Gyro.png') },
      { name: 'Calamari Gyro', price: 'R 115.00', image: require('../../assets/images/Calamari-Gyro.png') },
      { name: 'Halloumi Gyro', price: 'R 90.00', image: require('../../assets/images/Halloumi-Gyro.png') },
      { name: 'Falafel Gyro', price: 'R 90.00', image: require('../../assets/images/Falafel-Gyro.png') },
      { name: 'Add Extra Halloumi', price: 'R 40.00' }
    ] 
  },
  { 
    title: 'Combos', 
    data: [
      { name: 'Lamb / Beef Combo', price: 'R 150.00', desc: 'Incl. Chips & Soft Drink', image: require('../../assets/images/Lamb-Gyro-Combo.avif') },
      { name: 'Chicken / Pork Combo', price: 'R 140.00', desc: 'Incl. Chips & Soft Drink', image: require('../../assets/images/Beef-Gyro-Combo.png') },
      { name: 'Halloumi / Falafel Combo', price: 'R 130.00' },
      { name: 'Calamari Combo', price: 'R 155.00' }
    ] 
  },
  { 
    title: 'Souvlaki Meals', 
    data: [
      { name: 'Lamb Souvlaki Meal', price: 'R 175.00', desc: '2 Sticks, Pita/Salad & Tzatziki', image: require('../../assets/images/Lamb-Souvlaki-Meal.png') },
      { name: 'Beef Souvlaki Meal', price: 'R 190.00', desc: '2 Sticks, Pita/Salad & Tzatziki', image: require('../../assets/images/Beef-Souvlaki-Meal.png') },
      { name: 'Chicken Souvlaki Meal', price: 'R 115.00', image: require('../../assets/images/Chicken-Souvlaki-Meal.png') },
      { name: 'Pork Souvlaki Meal', price: 'R 115.00', image: require('../../assets/images/Pork-Souvlaki-Meal.png') }
    ] 
  },
  { 
    title: 'Sticks', 
    data: [
      { name: 'Lamb Stick (Single)', price: 'R 70.00', image: require('../../assets/images/Lamb-Single-Stick.png') },
      { name: 'Beef Stick (Single)', price: 'R 79.00', image: require('../../assets/images/Beef-Single-Stick.avif') },
      { name: 'Chicken Stick (Single)', price: 'R 42.00', image: require('../../assets/images/Chicken-Single-Stick.png') },
      { name: 'Pork Stick (Single)', price: 'R 42.00', image: require('../../assets/images/Pork-Single-Stick.png') }
    ] 
  },
  { 
    title: 'Calamari', 
    data: [
      { name: 'Calamari Tubes & Chips/Salad', price: 'R 175.00', image: require('../../assets/images/Calamari-Tubes-With-Chips-or-Salad.png') },
      { name: 'Calamari Tubes Plain', price: 'R 145.00' },
      { name: 'Calamari Heads & Chips/Salad', price: 'R 145.00' },
      { name: 'Calamari Heads Plain', price: 'R 145.00' },
      { name: 'Tubes & Heads & Chips/Salad', price: 'R 160.00' }
    ] 
  },
  { 
    title: 'Platters', 
    data: [
      { name: 'Gyro Platter', price: 'R 355.00', desc: '2 Mini Lamb, 2 Mini Chicken, Halloumi, Chips & Salad', image: require('../../assets/images/Gyro-Platter.png') },
      { name: 'Meat Platter', price: 'R 425.00', desc: 'Lamb, Halloumi, 4 Souvlaki, Chicken Strips, Chips & Pita', image: require('../../assets/images/Meat-Platter.png') },
      { name: 'Pescetarian Platter', price: 'R 445.00', desc: 'Calamari, Salad, Falafel, Pita & Dips', image: require('../../assets/images/Pescetarian-Platter.png') }
    ] 
  },
  { 
    title: 'Salads', 
    data: [
      { name: 'Traditional Greek Salad', price: 'R 99.00', image: require('../../assets/images/Greek-Salad.png') },
      { name: 'Chicken Salad', price: 'R 105.00', image: require('../../assets/images/Halloumi-Salad.png') },
      { name: 'Halloumi Salad', price: 'R 105.00' },
      { name: 'Calamari Salad', price: 'R 125.00' },
      { name: 'Side Greek Salad', price: 'R 70.00' }
    ] 
  },
  { 
    title: 'Kiddies', 
    data: [
      { name: 'Chicken Strips & Chips', price: 'R 105.00', image: require('../../assets/images/Chicken-Strips-With-Chips.png') },
      { name: 'Chicken Strips Only', price: 'R 75.00' }
    ] 
  },
  { 
    title: 'Desserts', 
    data: [
      { name: 'Baklava', price: 'R 58.00' },
      { name: 'Kourambethes', price: 'R 55.00' },
      { name: 'Ice Cream & Chocolate Sauce', price: 'R 59.00' },
      { name: 'Greek Yoghurt, Honey & Nuts', price: 'R 90.00' }
    ] 
  },
];

export default function MenuScreen() {
  const sectionListRef = useRef<SectionList>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 3. FIXED SCROLL LOGIC
  const scrollToSection = (index: number) => {
    // A: Dismiss the Modal
    setModalVisible(false);
    
    // B: Wait for the Modal to disappear, then Jump to Section
    // Using a 300ms timeout provides enough time for the Modal to close smoothly
    setTimeout(() => {
      sectionListRef.current?.scrollToLocation({
        sectionIndex: index,
        itemIndex: 0,
        animated: true,
        // viewOffset keeps the sticky header from blocking the first item
        viewOffset: Platform.OS === 'ios' ? 0 : 30, 
      });
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER SECTION */}
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>SouvLucky Menu</Text>
        <TouchableOpacity 
          style={styles.categoryPickerButton} 
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="grid-outline" size={18} color="#FFF" style={{marginRight: 8}} />
          <Text style={styles.categoryPickerText}>BROWSE CATEGORIES</Text>
        </TouchableOpacity>
      </View>

      {/* CATEGORY PICKER POP-UP */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Categories</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#003366" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {MENU_DATA.map((section, index) => (
                <TouchableOpacity 
                  key={section.title} 
                  style={styles.modalItem} 
                  onPress={() => scrollToSection(index)}
                >
                  <Text style={styles.modalItemText}>{section.title}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#003366" opacity={0.3} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MAIN MENU SECTION LIST */}
      <SectionList
        ref={sectionListRef}
        sections={MENU_DATA}
        keyExtractor={(item, index) => item.name + index}
        contentContainerStyle={styles.listPadding}
        stickySectionHeadersEnabled={true}
        
        // Critical for allowing jumping to sections at the bottom
        onScrollToIndexFailed={(info) => {
           sectionListRef.current?.scrollToLocation({
             sectionIndex: info.index,
             itemIndex: 0,
             animated: false,
           });
        }}

        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.menuCard}>
            <View style={styles.textContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.desc && <Text style={styles.itemDesc}>{item.desc}</Text>}
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
            
            {item.image && (
              <View style={styles.imageContainer}>
                <Image 
                  source={item.image} 
                  style={styles.foodImage}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F9' },
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    backgroundColor: '#003366',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingBottom: 20,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10,
  },
  mainTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 15 },
  categoryPickerButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  categoryPickerText: { color: '#FFF', fontWeight: '800', fontSize: 12, letterSpacing: 1 },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '70%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 15,
  },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#003366' },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalItemText: { fontSize: 17, fontWeight: '600', color: '#2C3E50' },

  // LIST & CARD STYLES
  listPadding: { paddingBottom: 60 },
  sectionHeaderContainer: { backgroundColor: '#F4F7F9', paddingVertical: 10 },
  sectionHeader: {
    fontSize: 13, fontWeight: '800', backgroundColor: '#003366', color: '#FFF',
    paddingVertical: 8, paddingHorizontal: 20, textTransform: 'uppercase',
    letterSpacing: 1.5, alignSelf: 'flex-start', borderTopRightRadius: 20, borderBottomRightRadius: 20,
  },
  menuCard: {
    backgroundColor: '#FFF', marginHorizontal: 16, marginVertical: 8, borderRadius: 20, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
  },
  textContainer: { flex: 1, paddingRight: 10 },
  itemName: { fontSize: 17, fontWeight: '700', color: '#2C3E50', marginBottom: 4 },
  itemDesc: { fontSize: 12, color: '#7F8C8D', lineHeight: 18, marginBottom: 8 },
  itemPrice: { fontSize: 16, fontWeight: '800', color: '#003366' },
  imageContainer: { width: 85, height: 85, borderRadius: 15, overflow: 'hidden', backgroundColor: '#F0F4F8' },
  foodImage: { width: '100%', height: '100%' },
});