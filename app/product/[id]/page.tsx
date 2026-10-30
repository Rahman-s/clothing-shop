import { products } from "@/data/products";
import BuyBox from "./BuyBox";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = products.find((x) => x.id === id);

  if (!p) return <p className="p-6">Product nahi mila</p>;

  return (
    <main className="p-6 max-w-xl mx-auto">
      <img src={p.image} alt={p.name} className="w-full rounded" />
      <h1 className="text-2xl font-bold mt-4">{p.name}</h1>
      <p className="text-xl mt-2">₹{p.price}</p>
      <BuyBox product={p} />
    </main>
  );
}