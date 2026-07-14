export interface CartLine {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export function cartKey(venueSlug: string): string {
  return `wayta_cart_${venueSlug}`;
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
