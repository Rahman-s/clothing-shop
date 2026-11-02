import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6 flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">Mera Clothing Shop</h1>
      <Link href="/mens" className="border px-6 py-3 rounded w-60 text-center">Mens</Link>
      <Link href="/womens" className="border px-6 py-3 rounded w-60 text-center">Women</Link>
      <Link href="/game" className="border px-6 py-3 rounded w-60 text-center">Game Mode</Link>
    </main>
  );
}