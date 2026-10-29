/** Opening hours per weekday (0 = Sunday). `null` means closed. Times are 24h "HH:MM". */
type Hours = Record<number, [open: string, close: string] | null>;

export type Branch = {
  id: string;
  name: string;
  short: string;
  address: string;
  hoursLabel: string;
  hours: Hours;
  phone: string;
  coords: { latitude: number; longitude: number };
  /** A bundled image (the result of `require(...)`). */
  photo: number;
  /** This branch's Uber Eats store link (Share → Copy link in the Uber Eats app). */
  uberEatsUrl?: string;
};


const daily = (open: string, close: string): Hours =>
  Object.fromEntries([0, 1, 2, 3, 4, 5, 6].map((d) => [d, [open, close]]));

export const BRANCHES: Branch[] = [
  {
    id: "parkmore",
    name: "SouvLucky Parkmore",
    short: "Parkmore",
    address: "130 11th St, Parkmore, Johannesburg, 2196",
    hoursLabel: "Mon – Sun · 10:00 – 20:00",
    hours: daily("10:00", "20:00"),
    phone: "081 643 2195",
    coords: { latitude: -26.098904585234106, longitude: 28.04630114132294 },
    photo: require("@assets/images/photos/seaside-taverna.jpg"),
    uberEatsUrl: "https://www.ubereats.com/za/store/souvlucky-greek-kitchen-parkmore/CLT15TgIWD60R9mDVMVGiA",
  },
  {
    id: "prison-break",
    name: "Prison Break Market",
    short: "Prison Break",
    address: "Cnr. Main & 10 MacMillan Rd, Kyalami, 2191",
    hoursLabel: "Thu – Sun · 10:00 – 19:00",
    hours: { 0: ["10:00", "19:00"], 1: null, 2: null, 3: null, 4: ["10:00", "19:00"], 5: ["10:00", "19:00"], 6: ["10:00", "19:00"] },
    phone: "073 529 3187",
    coords: { latitude: -26.001806662951207, longitude: 28.040711120734926 },
    photo: require("@assets/images/photos/seaside-lunch.jpg"),
    uberEatsUrl: "https://www.ubereats.com/za/store/souvlucky-greek-kitchen-prison-break/4MuW1XnNTNy5PEiDJBkLJA",
  },
];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Whether a branch is open at `now`, plus a short human label like "Open · closes 20:00". */
export function openStatus(branch: Branch, now = new Date()) {
  const today = branch.hours[now.getDay()];
  const mins = now.getHours() * 60 + now.getMinutes();
  if (today && mins >= toMinutes(today[0]) && mins < toMinutes(today[1])) {
    return { open: true, label: `Open · closes ${today[1]}` };
  }
  if (today && mins < toMinutes(today[0])) {
    return { open: false, label: `Closed · opens ${today[0]}` };
  }
  for (let i = 1; i <= 7; i++) {
    const next = branch.hours[(now.getDay() + i) % 7];
    if (next) {
      const day = i === 1 ? "tomorrow" : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][(now.getDay() + i) % 7];
      return { open: false, label: `Closed · opens ${day} ${next[0]}` };
    }
  }
  return { open: false, label: "Closed" };
}
