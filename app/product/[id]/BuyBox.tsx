"use client";

import { useState } from "react";
import { Product, buyLink } from "@/data/products";

export default function BuyBox({ product }: { product: Product }) {
  const [size, setSize] = useState<string | null>(null);

  return (
    <div className="mt-4">
      <p className="font-semibold">Size chuno:</p>
      <div className="flex gap-2 mt-2">
        {product.sizes.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`border px-4 py-2 rounded ${size === s ? "bg-black text-white" : ""}`}
          >
            {s}
          </button>
        ))}
      </div>

      {size ? (
        <a
          href={buyLink(product, size)}
          target="_blank"
          className="inline-block mt-6 bg-black text-white px-6 py-3 rounded"
        >
          Buy Now ({size})
        </a>
      ) : (
        <p className="mt-6 text-sm text-gray-500">Pehle size chuniye</p>
      )}
    </div>
  );
}