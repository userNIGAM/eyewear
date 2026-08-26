export interface ProductDetails {
  frameColor: string;
  lensColor: string;
  material: string;
  protection: string;
  dimensions: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string; // Supports /avatar1.jpg, /avatar1.png, /avatar1.jpeg, /avatar1.svg
  rating: number;
  category: string;
  details: ProductDetails;
  inStock: boolean;
}
