import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 1. Font Loaders
import { exploreStyles as styles } from "@/styles/styles";
import { GFSDidot_400Regular, useFonts } from "@expo-google-fonts/gfs-didot";

// 2. FULL MENU DATA
const MENU_DATA = [
  {
    title: "Meze & Dips",
    data: [
      {
        name: "Chips Medium",
        price: "R 45.00",
        image: require("../../assets/images/chips.png"),
      },
      {
        name: "Zucchini Fries",
        price: "R 62.00",
        desc: "Crispy fried zucchini slices",
        image: require("../../assets/images/Zucchini-Fries.png"),
      },
      {
        name: "Zucchini Fries + Feta",
        price: "R 76.00",
        desc: "Sprinkled with authentic Greek feta",
        image: require("../../assets/images/Zucchini-Fries-Sprinkled-with-Feta-Cheese.png"),
      },
      {
        name: "Falafel (5 Pieces)",
        price: "R 84.00",
        image: require("../../assets/images/Falafel-5-Pieces.png"),
      },
      {
        name: "Halloumi (4 Pieces)",
        price: "R 84.00",
        image: require("../../assets/images/Halloumi-4-Pieces.png"),
      },
      {
        name: "Spanakopita (2 Pieces)",
        price: "R 52.00",
        image: require("../../assets/images/Spanakopita-Spinach-and-Feta-Pie.png"),
      },
      {
        name: "Tiropita (2 Pieces)",
        price: "R 52.00",
        image: require("../../assets/images/Tiropita-Feta-Cheese-Pie.png"),
      },
      {
        name: "Pita Bread",
        price: "R 18.00",
        image: require("../../assets/images/Pita-Bread.png"),
      },
      {
        name: "Tzatziki",
        price: "R 42.00",
        image: require("../../assets/images/Tzatziki.png"),
      },
      {
        name: "Hummus",
        price: "R 42.00",
        image: require("../../assets/images/Hummus.png"),
      },
      { name: "Tarama (Fish Roe)", price: "R 42.00" },
      { name: "Tirokafteri (Chilli Feta)", price: "R 42.00" },
    ],
  },
  {
    title: "Gyros",
    data: [
      {
        name: "Lamb Gyro",
        price: "R 110.00",
        desc: "Tomato, onion, tzatziki in pita",
        image: require("../../assets/images/Lamb-Gyro.png"),
      },
      {
        name: "Beef Gyro",
        price: "R 110.00",
        desc: "Tomato, onion, tzatziki in pita",
        image: require("../../assets/images/Beef-Gyro.png"),
      },
      {
        name: "Chicken Gyro",
        price: "R 95.00",
        desc: "Tomato, onion, tzatziki in pita",
        image: require("../../assets/images/Chicken-Gyro.png"),
      },
      {
        name: "Pork Gyro",
        price: "R 95.00",
        desc: "Tomato, onion, tzatziki in pita",
        image: require("../../assets/images/Pork-Gyro.png"),
      },
      {
        name: "Calamari Gyro",
        price: "R 115.00",
        image: require("../../assets/images/Calamari-Gyro.png"),
      },
      {
        name: "Halloumi Gyro",
        price: "R 90.00",
        image: require("../../assets/images/Halloumi-Gyro.png"),
      },
      {
        name: "Falafel Gyro",
        price: "R 90.00",
        image: require("../../assets/images/Falafel-Gyro.png"),
      },
      { name: "Add Extra Halloumi", price: "R 40.00" },
    ],
  },
  {
    title: "Combos",
    data: [
      {
        name: "Lamb / Beef Combo",
        price: "R 150.00",
        desc: "Incl. Chips & Soft Drink",
        image: require("../../assets/images/Lamb-Gyro-Combo.avif"),
      },
      {
        name: "Chicken / Pork Combo",
        price: "R 140.00",
        desc: "Incl. Chips & Soft Drink",
        image: require("../../assets/images/Beef-Gyro-Combo.png"),
      },
      { name: "Halloumi / Falafel Combo", price: "R 130.00" },
      { name: "Calamari Combo", price: "R 155.00" },
    ],
  },
  {
    title: "Souvlaki Meals",
    data: [
      {
        name: "Lamb Souvlaki Meal",
        price: "R 175.00",
        desc: "2 Sticks, Pita/Salad & Tzatziki",
        image: require("../../assets/images/Lamb-Souvlaki-Meal.png"),
      },
      {
        name: "Beef Souvlaki Meal",
        price: "R 190.00",
        desc: "2 Sticks, Pita/Salad & Tzatziki",
        image: require("../../assets/images/Beef-Souvlaki-Meal.png"),
      },
      {
        name: "Chicken Souvlaki Meal",
        price: "R 115.00",
        image: require("../../assets/images/Chicken-Souvlaki-Meal.png"),
      },
      {
        name: "Pork Souvlaki Meal",
        price: "R 115.00",
        image: require("../../assets/images/Pork-Souvlaki-Meal.png"),
      },
    ],
  },
  {
    title: "Sticks",
    data: [
      {
        name: "Lamb Stick (Single)",
        price: "R 70.00",
        image: require("../../assets/images/Lamb-Single-Stick.png"),
      },
      {
        name: "Beef Stick (Single)",
        price: "R 79.00",
        image: require("../../assets/images/Beef-Single-Stick.avif"),
      },
      {
        name: "Chicken Stick (Single)",
        price: "R 42.00",
        image: require("../../assets/images/Chicken-Single-Stick.png"),
      },
      {
        name: "Pork Stick (Single)",
        price: "R 42.00",
        image: require("../../assets/images/Pork-Single-Stick.png"),
      },
    ],
  },
  {
    title: "Calamari",
    data: [
      {
        name: "Calamari Tubes & Chips/Salad",
        price: "R 175.00",
        image: require("../../assets/images/Calamari-Tubes-With-Chips-or-Salad.png"),
      },
      { name: "Calamari Tubes Plain", price: "R 145.00" },
      { name: "Calamari Heads & Chips/Salad", price: "R 145.00" },
      { name: "Calamari Heads Plain", price: "R 145.00" },
      { name: "Tubes & Heads & Chips/Salad", price: "R 160.00" },
    ],
  },
  {
    title: "Platters",
    data: [
      {
        name: "Gyro Platter",
        price: "R 355.00",
        desc: "2 Mini Lamb, 2 Mini Chicken, Halloumi, Chips & Salad",
        image: require("../../assets/images/Gyro-Platter.png"),
      },
      {
        name: "Meat Platter",
        price: "R 425.00",
        desc: "Lamb, Halloumi, 4 Souvlaki, Chicken Strips, Chips & Pita",
        image: require("../../assets/images/Meat-Platter.png"),
      },
      {
        name: "Pescetarian Platter",
        price: "R 445.00",
        desc: "Calamari, Salad, Falafel, Pita & Dips",
        image: require("../../assets/images/Pescetarian-Platter.png"),
      },
    ],
  },
  {
    title: "Salads",
    data: [
      {
        name: "Traditional Greek Salad",
        price: "R 99.00",
        image: require("../../assets/images/Greek-Salad.png"),
      },
      {
        name: "Chicken Salad",
        price: "R 105.00",
        image: require("../../assets/images/Halloumi-Salad.png"),
      },
      { name: "Halloumi Salad", price: "R 105.00" },
      { name: "Calamari Salad", price: "R 125.00" },
      { name: "Side Greek Salad", price: "R 70.00" },
    ],
  },
  {
    title: "Kiddies",
    data: [
      {
        name: "Chicken Strips & Chips",
        price: "R 105.00",
        image: require("../../assets/images/Chicken-Strips-With-Chips.png"),
      },
      { name: "Chicken Strips Only", price: "R 75.00" },
    ],
  },
  {
    title: "Desserts",
    data: [
      { name: "Baklava", price: "R 58.00" },
      { name: "Kourambethes", price: "R 55.00" },
      { name: "Ice Cream & Chocolate Sauce", price: "R 59.00" },
      { name: "Greek Yoghurt, Honey & Nuts", price: "R 90.00" },
    ],
  },
];

export default function MenuScreen() {
  const mainScrollRef = useRef<ScrollView>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const sectionPositions = useRef<{ [key: string]: number }>({});

  let [fontsLoaded] = useFonts({
    GreekFont: GFSDidot_400Regular,
  });

  const scrollToSection = (title: string) => {
    setModalVisible(false);
    const yCoordinate = sectionPositions.current[title];

    setTimeout(() => {
      if (mainScrollRef.current && yCoordinate !== undefined) {
        mainScrollRef.current.scrollTo({
          y: yCoordinate,
          animated: true,
        });
      }
    }, 450);
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER SECTION */}
      <View style={styles.headerContainer}>
        <Text style={[styles.mainTitle, { fontFamily: "GreekFont" }]}>
          SOUVLUCKY
        </Text>
        <TouchableOpacity
          style={styles.categoryPickerButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color="#C5A059"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.categoryPickerText}>SELECT CATEGORY</Text>
        </TouchableOpacity>
      </View>

      {/* DARK THEME MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontFamily: "GreekFont" }]}>
                Menu
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {MENU_DATA.map((section) => (
                <TouchableOpacity
                  key={section.title}
                  style={styles.modalItem}
                  onPress={() => scrollToSection(section.title)}
                >
                  <Text style={styles.modalItemText}>{section.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MAIN CONTENT */}
      <ScrollView
        ref={mainScrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      >
        {MENU_DATA.map((section) => (
          <View
            key={section.title}
            onLayout={(event) => {
              sectionPositions.current[section.title] =
                event.nativeEvent.layout.y;
            }}
          >
            {/* SECTION HEADER WITH LINES */}
            <View style={styles.sectionHeaderContainer}>
              <View style={styles.sectionHeaderLine} />
              <Text style={[styles.sectionHeader, { fontFamily: "GreekFont" }]}>
                {section.title}
              </Text>
              <View style={styles.sectionHeaderLine} />
            </View>

            {section.data.map((item, index) => (
              <View key={item.name + index} style={styles.menuCard}>
                <View style={styles.textContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.desc && (
                    <Text style={styles.itemDesc}>{item.desc}</Text>
                  )}
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
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
