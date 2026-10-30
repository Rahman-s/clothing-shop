import Link from "next/link";
import { products } from "@/data/products";

export default function MensPage() {
  const items = products.filter((p) => p.section === "mens");

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mens Collection</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`} className="border rounded-lg p-3">
            <img src={p.image} alt={p.name} className="w-full h-60 object-cover rounded" />
            <h2 className="mt-2 font-semibold">{p.name}</h2>
            <p>₹{p.price}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}