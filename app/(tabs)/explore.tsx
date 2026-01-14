import React, { useRef } from 'react';
import { FlatList, Image, Platform, SafeAreaView, SectionList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MenuItem {
  name: string;
  price: string;
  desc?: string;
  image?: any; // Made optional to handle items without photos
}

interface MenuSection {
  title: string;
  data: MenuItem[];
}

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
      { name: 'Tarama (Fish Roe)', price: 'R 42.00' }, // No image
      { name: 'Tirokafteri (Chilli Feta)', price: 'R 42.00' } // No image
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

  const scrollToSection = (index: number) => {
    sectionListRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      animated: true,
      viewOffset: Platform.OS === 'ios' ? 0 : 40,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>SouvLucky Menu</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={MENU_DATA}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.filterList}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.filterChip} onPress={() => scrollToSection(index)}>
              <Text style={styles.filterText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <SectionList
        ref={sectionListRef}
        sections={MENU_DATA}
        keyExtractor={(item, index) => item.name + index}
        contentContainerStyle={styles.listPadding}
        stickySectionHeadersEnabled={true}
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
            
            {/* Condition: Only show image box if an image is provided */}
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
    elevation: 5,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10,
  },
  mainTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', textAlign: 'center', marginBottom: 15 },
  filterList: { paddingHorizontal: 15, paddingBottom: 15 },
  filterChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  filterText: { color: '#FFF', fontWeight: '600', fontSize: 13 },
  listPadding: { paddingBottom: 40 },
  sectionHeaderContainer: { backgroundColor: '#F4F7F9', paddingVertical: 10 },
  sectionHeader: {
    fontSize: 13, fontWeight: '800', backgroundColor: '#003366', color: '#FFF',
    paddingVertical: 6, paddingHorizontal: 15, textTransform: 'uppercase',
    letterSpacing: 1, alignSelf: 'flex-start', borderTopRightRadius: 15, borderBottomRightRadius: 15,
  },
  menuCard: {
    backgroundColor: '#FFF', marginHorizontal: 16, marginVertical: 6, borderRadius: 15, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
  },
  textContainer: { flex: 1, paddingRight: 10 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 2 },
  itemDesc: { fontSize: 12, color: '#7F8C8D', lineHeight: 16, marginBottom: 6 },
  itemPrice: { fontSize: 15, fontWeight: '800', color: '#003366' },
  imageContainer: { width: 75, height: 75, borderRadius: 12, overflow: 'hidden', backgroundColor: '#EEE' },
  foodImage: { width: '100%', height: '100%' },
});