export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Veg' | 'Non-Veg';
  isSignature: boolean;
  image: string;
}
