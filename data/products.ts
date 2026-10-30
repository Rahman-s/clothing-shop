// data/products.ts
export const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeykAxPoKr1N6H04ZJ0EZU1MAAJvh3zxl4F_UT2hvnj9bszPQ/viewform";

  export const FORM_ENTRY = {
    product: "entry.161265467",
    price: "entry.995744551",
    size: "entry.1351811303",
    quantity: "entry.1983613217",
  };
export type Section = "mens" | "womens";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  section: Section;
  sizes: string[];
};

const TEE_SIZES = ["S", "M", "L", "XL"];
const KURTI_SIZES = ["S", "M", "L", "XL"];

export const products: Product[] = [
  // ---------- MENS: 5 T-shirts ----------
  { id: "m1", name: "Black Oversized Tee", price: 799, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", section: "mens", sizes: TEE_SIZES },
  { id: "m2", name: "White Basic Tee", price: 499, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a", section: "mens", sizes: TEE_SIZES },
  { id: "m3", name: "Navy Polo Tee", price: 899, image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d", section: "mens", sizes: TEE_SIZES },
  { id: "m4", name: "Grey Graphic Tee", price: 699, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68", section: "mens", sizes: TEE_SIZES },
  { id: "m5", name: "Olive Printed Tee", price: 749, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c", section: "mens", sizes: TEE_SIZES },

  // ---------- WOMENS: 5 Kurtis ----------
  { id: "w1", name: "Printed Cotton Kurti", price: 1199, image: "https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe", section: "womens", sizes: KURTI_SIZES },
  { id: "w2", name: "Blue Anarkali Kurti", price: 1599, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2", section: "womens", sizes: KURTI_SIZES },
  { id: "w3", name: "Pink Straight Kurti", price: 999, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1", section: "womens", sizes: KURTI_SIZES },
  { id: "w4", name: "Green Embroidered Kurti", price: 1399, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c", section: "womens", sizes: KURTI_SIZES },
  { id: "w5", name: "Yellow Festive Kurti", price: 1799, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26", section: "womens", sizes: KURTI_SIZES },
];

export function buyLink(p: Product, size: string) {
    const params = new URLSearchParams({
      usp: "pp_url",
      [FORM_ENTRY.product]: p.name,
      [FORM_ENTRY.price]: String(p.price),
      [FORM_ENTRY.size]: size,
      [FORM_ENTRY.quantity]: "1",
    });
    return `${FORM_URL}?${params.toString()}`;
  }