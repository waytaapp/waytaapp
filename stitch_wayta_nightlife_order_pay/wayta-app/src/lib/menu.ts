export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

const BLACK_DOOR_MENU: MenuCategory[] = [
  {
    name: "Signature Cocktails",
    items: [
      {
        id: "bd-electric-sapphire",
        name: "Electric Sapphire",
        description: "Premium gin, blue curaçao, fresh lime, and a hint of elderflower fizz.",
        price: 125,
      },
      {
        id: "bd-neon-velvet",
        name: "Neon Velvet",
        description: "Vodka infused with hibiscus, lemon juice, and simple syrup, topped with egg white foam.",
        price: 110,
      },
      {
        id: "bd-aged-single-malt",
        name: "Aged Single Malt",
        description: "12-year house selection. Served neat or with a single ice sphere.",
        price: 85,
      },
    ],
  },
  {
    name: "Craft Beer & Cider",
    items: [
      {
        id: "bd-midnight-ipa",
        name: "Midnight IPA",
        description: "Hoppy, dark, and perfectly balanced with notes of chocolate and pine.",
        price: 65,
      },
      {
        id: "bd-citrus-lager",
        name: "Citrus Lager",
        description: "Light and refreshing lager with a crisp grapefruit finish.",
        price: 55,
      },
    ],
  },
];

const GENERIC_MENU: MenuCategory[] = [
  {
    name: "Beers & Ciders",
    items: [
      { id: "gen-heineken", name: "Heineken", description: "330ml bottle, imported lager.", price: 42 },
      { id: "gen-savanna-dry", name: "Savanna Dry", description: "330ml bottle, extra dry cider.", price: 45 },
    ],
  },
  {
    name: "Spirits",
    items: [
      { id: "gen-klipdrift-coke", name: "Klipdrift Premium + Coke", description: "Single measure, served with Coca-Cola.", price: 65 },
      { id: "gen-jack-daniels", name: "Jack Daniels", description: "Single measure, neat or on the rocks.", price: 95 },
    ],
  },
];

export function getMenuForVenue(slug: string): MenuCategory[] {
  return slug === "black-door" ? BLACK_DOOR_MENU : GENERIC_MENU;
}

export function findMenuItem(slug: string, itemId: string): MenuItem | undefined {
  const categories = getMenuForVenue(slug);
  for (const category of categories) {
    const item = category.items.find((i) => i.id === itemId);
    if (item) return item;
  }
  return undefined;
}

export function formatZar(price: number): string {
  return `R${price.toFixed(2)}`;
}
