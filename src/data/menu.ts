export type MenuItem = {
  id: string;
  name: string;
  price: number;
  desc?: string;
  /** A bundled image (the result of `require(...)`). */
  image?: number;
  veg?: boolean;
  popular?: boolean;
};

export type MenuCategory = {
  id: string;
  title: string;
  icon: string; // Ionicons name
  items: MenuItem[];
};

const img = {
  chips: require("@assets/images/menu/chips.png"),
  zucchini: require("@assets/images/menu/zucchini-fries.png"),
  zucchiniFeta: require("@assets/images/menu/zucchini-fries-sprinkled-with-feta-cheese.png"),
  falafel: require("@assets/images/menu/falafel-5-pieces.png"),
  halloumi: require("@assets/images/menu/halloumi-4-pieces.png"),
  spanakopita: require("@assets/images/menu/spanakopita-spinach-and-feta-pie.png"),
  tiropita: require("@assets/images/menu/tiropita-feta-cheese-pie.png"),
  pita: require("@assets/images/menu/pita-bread.png"),
  tzatziki: require("@assets/images/menu/tzatziki.png"),
  hummus: require("@assets/images/menu/hummus.png"),
  dips: require("@assets/images/menu/dip-hummus-or-tzatziki.png"),
  lambGyro: require("@assets/images/menu/lamb-gyro.png"),
  beefGyro: require("@assets/images/menu/beef-gyro.png"),
  chickenGyro: require("@assets/images/menu/chicken-gyro.png"),
  porkGyro: require("@assets/images/menu/pork-gyro.png"),
  calamariGyro: require("@assets/images/menu/calamari-gyro.png"),
  halloumiGyro: require("@assets/images/menu/halloumi-gyro.png"),
  falafelGyro: require("@assets/images/menu/falafel-gyro.png"),
  lambCombo: require("@assets/images/menu/lamb-gyro-combo.png"),
  porkCombo: require("@assets/images/menu/pork-gyro-combo.png"),
  lambMeal: require("@assets/images/menu/lamb-souvlaki-meal.png"),
  beefMeal: require("@assets/images/menu/beef-souvlaki-meal.png"),
  chickenMeal: require("@assets/images/menu/chicken-souvlaki-meal.png"),
  porkMeal: require("@assets/images/menu/pork-souvlaki-meal.png"),
  lambStick: require("@assets/images/menu/lamb-single-stick.png"),
  beefStick: require("@assets/images/menu/beef-single-stick.png"),
  chickenStick: require("@assets/images/menu/chicken-single-stick.png"),
  porkStick: require("@assets/images/menu/pork-single-stick.png"),
  calamariTubes: require("@assets/images/menu/calamari-tubes-with-chips-or-salad.png"),
  gyroPlatter: require("@assets/images/menu/gyro-platter.png"),
  meatPlatter: require("@assets/images/menu/meat-platter.png"),
  pescPlatter: require("@assets/images/menu/pescetarian-platter.png"),
  greekSalad: require("@assets/images/menu/greek-salad.png"),
  halloumiSalad: require("@assets/images/menu/halloumi-salad.png"),
  chickenStrips: require("@assets/images/menu/chicken-strips-with-chips.png"),
};

const PITA_FILLING = "Tomato, onion and tzatziki wrapped in a warm pita";

export const MENU: MenuCategory[] = [
  {
    id: "meze",
    title: "Meze & Dips",
    icon: "leaf-outline",
    items: [
      { id: "chips-medium", name: "Chips Medium", price: 45, image: img.chips, veg: true },
      { id: "zucchini-fries", name: "Zucchini Fries", price: 62, desc: "Crispy fried zucchini slices", image: img.zucchini, veg: true },
      { id: "zucchini-fries-feta", name: "Zucchini Fries + Feta", price: 76, desc: "Sprinkled with authentic Greek feta", image: img.zucchiniFeta, veg: true, popular: true },
      { id: "falafel-5", name: "Falafel (5 Pieces)", price: 84, image: img.falafel, veg: true },
      { id: "halloumi-4", name: "Halloumi (4 Pieces)", price: 84, desc: "Grilled until golden", image: img.halloumi, veg: true, popular: true },
      { id: "spanakopita", name: "Spanakopita (2 Pieces)", price: 52, desc: "Spinach and feta in crisp filo", image: img.spanakopita, veg: true },
      { id: "tiropita", name: "Tiropita (2 Pieces)", price: 52, desc: "Feta cheese pie in crisp filo", image: img.tiropita, veg: true },
      { id: "pita-bread", name: "Pita Bread", price: 18, image: img.pita, veg: true },
      { id: "tzatziki", name: "Tzatziki", price: 42, desc: "Yoghurt, cucumber and garlic", image: img.tzatziki, veg: true },
      { id: "hummus", name: "Hummus", price: 42, image: img.hummus, veg: true },
      { id: "tarama", name: "Tarama (Fish Roe)", price: 42, image: img.dips },
      { id: "tirokafteri", name: "Tirokafteri (Chilli Feta)", price: 42, image: img.dips, veg: true },
    ],
  },
  {
    id: "gyros",
    title: "Gyros",
    icon: "flame-outline",
    items: [
      { id: "lamb-gyro", name: "Lamb Gyro", price: 110, desc: PITA_FILLING, image: img.lambGyro, popular: true },
      { id: "beef-gyro", name: "Beef Gyro", price: 110, desc: PITA_FILLING, image: img.beefGyro },
      { id: "chicken-gyro", name: "Chicken Gyro", price: 95, desc: PITA_FILLING, image: img.chickenGyro, popular: true },
      { id: "pork-gyro", name: "Pork Gyro", price: 95, desc: PITA_FILLING, image: img.porkGyro },
      { id: "calamari-gyro", name: "Calamari Gyro", price: 115, image: img.calamariGyro },
      { id: "halloumi-gyro", name: "Halloumi Gyro", price: 90, image: img.halloumiGyro, veg: true },
      { id: "falafel-gyro", name: "Falafel Gyro", price: 90, image: img.falafelGyro, veg: true },
      { id: "extra-halloumi", name: "Add Extra Halloumi", price: 40, veg: true },
    ],
  },
  {
    id: "combos",
    title: "Combos",
    icon: "fast-food-outline",
    items: [
      { id: "lamb-beef-combo", name: "Lamb / Beef Combo", price: 150, desc: "Gyro with chips and a soft drink", image: img.lambCombo, popular: true },
      { id: "chicken-pork-combo", name: "Chicken / Pork Combo", price: 140, desc: "Gyro with chips and a soft drink", image: img.porkCombo },
      { id: "halloumi-falafel-combo", name: "Halloumi / Falafel Combo", price: 130, desc: "Gyro with chips and a soft drink", veg: true },
      { id: "calamari-combo", name: "Calamari Combo", price: 155, desc: "Gyro with chips and a soft drink" },
    ],
  },
  {
    id: "souvlaki",
    title: "Souvlaki Meals",
    icon: "restaurant-outline",
    items: [
      { id: "lamb-souvlaki-meal", name: "Lamb Souvlaki Meal", price: 175, desc: "2 sticks, pita or salad and tzatziki", image: img.lambMeal },
      { id: "beef-souvlaki-meal", name: "Beef Souvlaki Meal", price: 190, desc: "2 sticks, pita or salad and tzatziki", image: img.beefMeal, popular: true },
      { id: "chicken-souvlaki-meal", name: "Chicken Souvlaki Meal", price: 115, desc: "2 sticks, pita or salad and tzatziki", image: img.chickenMeal },
      { id: "pork-souvlaki-meal", name: "Pork Souvlaki Meal", price: 115, desc: "2 sticks, pita or salad and tzatziki", image: img.porkMeal },
    ],
  },
  {
    id: "sticks",
    title: "Sticks",
    icon: "remove-outline",
    items: [
      { id: "lamb-stick", name: "Lamb Stick (Single)", price: 70, image: img.lambStick },
      { id: "beef-stick", name: "Beef Stick (Single)", price: 79, image: img.beefStick },
      { id: "chicken-stick", name: "Chicken Stick (Single)", price: 42, image: img.chickenStick },
      { id: "pork-stick", name: "Pork Stick (Single)", price: 42, image: img.porkStick },
    ],
  },
  {
    id: "calamari",
    title: "Calamari",
    icon: "water-outline",
    items: [
      { id: "calamari-tubes-chips", name: "Calamari Tubes & Chips/Salad", price: 175, image: img.calamariTubes },
      { id: "calamari-tubes-plain", name: "Calamari Tubes Plain", price: 145 },
      { id: "calamari-heads-chips", name: "Calamari Heads & Chips/Salad", price: 145 },
      { id: "calamari-heads-plain", name: "Calamari Heads Plain", price: 145 },
      { id: "calamari-tubes-heads", name: "Tubes & Heads & Chips/Salad", price: 160 },
    ],
  },
  {
    id: "platters",
    title: "Platters",
    icon: "people-outline",
    items: [
      { id: "gyro-platter", name: "Gyro Platter", price: 355, desc: "2 mini lamb, 2 mini chicken, halloumi, chips and salad", image: img.gyroPlatter, popular: true },
      { id: "meat-platter", name: "Meat Platter", price: 425, desc: "Lamb, halloumi, 4 souvlaki, chicken strips, chips and pita", image: img.meatPlatter },
      { id: "pescetarian-platter", name: "Pescetarian Platter", price: 445, desc: "Calamari, salad, falafel, pita and dips", image: img.pescPlatter },
    ],
  },
  {
    id: "salads",
    title: "Salads",
    icon: "nutrition-outline",
    items: [
      { id: "greek-salad", name: "Traditional Greek Salad", price: 99, desc: "Tomato, cucumber, olives, onion and feta", image: img.greekSalad, veg: true },
      { id: "chicken-salad", name: "Chicken Salad", price: 105 },
      { id: "halloumi-salad", name: "Halloumi Salad", price: 105, image: img.halloumiSalad, veg: true },
      { id: "calamari-salad", name: "Calamari Salad", price: 125 },
      { id: "side-greek-salad", name: "Side Greek Salad", price: 70, veg: true },
    ],
  },
  {
    id: "kiddies",
    title: "Kiddies",
    icon: "happy-outline",
    items: [
      { id: "chicken-strips-chips", name: "Chicken Strips & Chips", price: 105, image: img.chickenStrips },
      { id: "chicken-strips", name: "Chicken Strips Only", price: 75 },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    icon: "ice-cream-outline",
    items: [
      { id: "baklava", name: "Baklava", price: 58, desc: "Filo, walnuts and honey syrup", veg: true },
      { id: "kourambethes", name: "Kourambethes", price: 55, desc: "Butter almond shortbread", veg: true },
      { id: "ice-cream", name: "Ice Cream & Chocolate Sauce", price: 59, veg: true },
      { id: "yoghurt-honey", name: "Greek Yoghurt, Honey & Nuts", price: 90, veg: true },
    ],
  },
];

const byId = new Map(MENU.flatMap((c) => c.items.map((i) => [i.id, { ...i, category: c.title }] as const)));

export const getMenuItem = (id: string) => byId.get(id);
export const POPULAR = MENU.flatMap((c) => c.items).filter((i) => i.popular);
export const formatPrice = (rand: number) => `R ${rand.toFixed(2)}`;
