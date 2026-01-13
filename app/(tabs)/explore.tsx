import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface MenuItem {
  name: string;
  price: string;
  desc?: string;
}

interface MenuSection {
  title: string;
  data: MenuItem[];
}

const MENU_DATA: MenuSection[] = [
  {
    title: 'Meze & Dips',
    data: [
      { name: 'Zucchini Fries', price: 'R 62.00', desc: 'Crispy fried zucchini slices' },
      { name: 'Zucchini Fries with Feta', price: 'R 76.00', desc: 'Topped with authentic Greek feta' },
      { name: 'Falafel (5 Pieces)', price: 'R 84.00', desc: 'Handmade chickpea croquettes' },
      { name: 'Halloumi (4 Pieces)', price: 'R 84.00', desc: 'Grilled traditional Cypriot cheese' },
      { name: 'Spanakopita', price: 'R 52.00', desc: 'Spinach and feta phyllo pastry' },
      { name: 'Tzatziki or Hummus', price: 'R 42.00', desc: 'Classic Greek dips with pita' },
    ],
  },
  {
    title: 'Gyros',
    data: [
      { name: 'Lamb Gyro', price: 'R 110.00', desc: 'Tomato, onion, tzatziki in warm pita' },
      { name: 'Beef Gyro', price: 'R 110.00', desc: 'Thinly sliced beef with traditional garnish' },
      { name: 'Chicken Gyro', price: 'R 95.00', desc: 'Basted in Greek herbs and spices' },
      { name: 'Calamari Gyro', price: 'R 115.00', desc: 'Fried calamari tubes and heads' },
      { name: 'Halloumi Gyro', price: 'R 90.00', desc: 'Vegetarian friendly wrap' },
    ],
  },
  {
    title: 'Combos',
    data: [
      { name: 'Lamb / Beef Combo', price: 'R 150.00', desc: 'Includes chips & soft drink' },
      { name: 'Chicken / Pork Combo', price: 'R 140.00', desc: 'Includes chips & soft drink' },
    ],
  },
  {
    title: 'Platters',
    data: [
      { name: 'Meat Platter', price: 'R 425.00', desc: 'Lamb strips, Halloumi, 4 Souvlaki, Chicken strips, Chips, Pita & 2 Dips' },
      { name: 'Gyro Platter', price: 'R 355.00', desc: '2x Mini Lamb, 2x Mini Chicken, Halloumi, Chips & Salad' },
      { name: 'Pescetarian Platter', price: 'R 445.00', desc: 'Calamari, Greek Salad, Falafel, Pita & 2 Dips' },
    ],
  },
  {
    title: 'Desserts',
    data: [
      { name: 'Baklava', price: 'R 58.00', desc: 'Walnuts and honey in phyllo layers' },
      { name: 'Greek Yoghurt & Honey', price: 'R 90.00', desc: 'Thick yoghurt with honey and nuts' },
    ],
  },
];

export default function MenuScreen() {
  const sectionListRef = useRef<SectionList>(null);
  const [activeTab, setActiveTab] = useState(0);

  const scrollToSection = (index: number) => {
    setActiveTab(index);
    sectionListRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      animated: true,
      viewOffset: Platform.OS === 'ios' ? 0 : 20,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Visual Hero Header */}
      <View style={styles.heroHeader}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.mainTitle}>SOUVLUCKY</Text>
          <Text style={styles.headerSubtitle}>Greek Kitchen</Text>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={MENU_DATA}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.filterList}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={[styles.filterChip, activeTab === index && styles.activeChip]} 
              onPress={() => scrollToSection(index)}
            >
              <Text style={[styles.filterText, activeTab === index && styles.activeChipText]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      
      <SectionList
        ref={sectionListRef}
        sections={MENU_DATA}
        keyExtractor={(item, index) => item.name + index}
        contentContainerStyle={styles.listPadding}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeaderContainer}>
            <View style={styles.accentLine} />
            <Text style={styles.sectionHeader}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8} style={styles.menuCard}>
            <View style={styles.textContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.desc && <Text style={styles.itemDesc}>{item.desc}</Text>}
              <View style={styles.priceContainer}>
                <Text style={styles.itemPrice}>{item.price}</Text>
              </View>
            </View>
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={24} color="#003366" opacity={0.2} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  heroHeader: {
    backgroundColor: '#003366',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    borderBottomLeftRadius: 40,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  headerTextContainer: {
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  mainTitle: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#FFF', 
    letterSpacing: 4 
  },
  headerSubtitle: { 
    fontSize: 12, 
    color: '#BDC3C7', 
    letterSpacing: 6, 
    textTransform: 'uppercase' 
  },
  filterList: { 
    paddingHorizontal: 20, 
    paddingBottom: 25 
  },
  filterChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
  },
  activeChip: {
    backgroundColor: '#FFF',
  },
  filterText: { color: 'rgba(255,255,255,0.8)', fontWeight: '700', fontSize: 13 },
  activeChipText: { color: '#003366' },
  
  listPadding: { paddingBottom: 60, paddingTop: 10 },
  sectionHeaderContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    marginTop: 30, 
    marginBottom: 10 
  },
  accentLine: { 
    width: 4, 
    height: 24, 
    backgroundColor: '#003366', 
    marginRight: 10, 
    borderRadius: 2 
  },
  sectionHeader: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#1C2833' 
  },
  
  menuCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 25,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#003366',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  textContainer: { flex: 1, paddingRight: 15 },
  itemName: { fontSize: 18, fontWeight: '700', color: '#2C3E50', marginBottom: 4 },
  itemDesc: { fontSize: 13, color: '#95A5A6', lineHeight: 18, marginBottom: 12 },
  priceContainer: {
    backgroundColor: '#F0F4F8',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  itemPrice: { fontSize: 15, fontWeight: '900', color: '#003366' },
  imagePlaceholder: { 
    width: 90, 
    height: 90, 
    backgroundColor: '#F8FAFC', 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
});