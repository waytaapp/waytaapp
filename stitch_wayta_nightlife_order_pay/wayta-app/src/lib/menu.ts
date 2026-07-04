export interface MenuItem {
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
        name: "Electric Sapphire",
        description: "Premium gin, blue curaçao, fresh lime, and a hint of elderflower fizz.",
        price: 125,
      },
      {
        name: "Neon Velvet",
        description: "Vodka infused with hibiscus, lemon juice, and simple syrup, topped with egg white foam.",
        price: 110,
      },
      {
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
        name: "Midnight IPA",
        description: "Hoppy, dark, and perfectly balanced with notes of chocolate and pine.",
        price: 65,
      },
      {
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
      { name: "Heineken", description: "330ml bottle, imported lager.", price: 42 },
      { name: "Savanna Dry", description: "330ml bottle, extra dry cider.", price: 45 },
    ],
  },
  {
    name: "Spirits",
    items: [
      { name: "Klipdrift Premium + Coke", description: "Single measure, served with Coca-Cola.", price: 65 },
      { name: "Jack Daniels", description: "Single measure, neat or on the rocks.", price: 95 },
    ],
  },
];

export function getMenuForVenue(slug: string): MenuCategory[] {
  return slug === "black-door" ? BLACK_DOOR_MENU : GENERIC_MENU;
}

export function formatZar(price: number): string {
  return `R${price.toFixed(2)}`;
}
