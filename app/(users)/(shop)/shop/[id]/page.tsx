import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { ArrowLeft, ShieldCheck, Star, Truck } from "lucide-react";
import ProductActions from "@/components/product-actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Get 3 similar products (excluding the current one)
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-zinc-950 min-h-screen text-zinc-100">
      {/* Back Button */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-green-500 transition-colors mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Shop</span>
      </Link>

      {/* Split Layout */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left Column: Image Gallery */}
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-transparent to-transparent opacity-60" />
          <div className="relative w-full h-full overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-w-768px) 100vw, 50vw"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>

        {/* Right Column: Details Info */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Tag & Rating */}
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center rounded-md bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-500 ring-1 ring-inset ring-green-500/20">
                {product.category} Collection
              </span>
              <div className="flex items-center gap-1.5 text-sm text-zinc-300">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="font-semibold text-white">{product.rating}</span>
                <span className="text-zinc-500">(120+ reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mt-4">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-bold text-white">Rs. {product.price}</span>
            </div>

            {/* Description */}
            <p className="mt-6 text-zinc-400 leading-relaxed text-base">
              {product.description}
            </p>

            {/* Product Specifications Table */}
            <div className="mt-8 border-t border-zinc-900 pt-6">
              <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
                Specifications
              </h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="border-b border-zinc-900 pb-2">
                  <dt className="text-xs text-zinc-500 font-medium">Frame Color</dt>
                  <dd className="mt-1 text-sm font-semibold text-zinc-200">
                    {product.details.frameColor}
                  </dd>
                </div>
                <div className="border-b border-zinc-900 pb-2">
                  <dt className="text-xs text-zinc-500 font-medium">Lens Color</dt>
                  <dd className="mt-1 text-sm font-semibold text-zinc-200">
                    {product.details.lensColor}
                  </dd>
                </div>
                <div className="border-b border-zinc-900 pb-2">
                  <dt className="text-xs text-zinc-500 font-medium">Material</dt>
                  <dd className="mt-1 text-sm font-semibold text-zinc-200">
                    {product.details.material}
                  </dd>
                </div>
                <div className="border-b border-zinc-900 pb-2">
                  <dt className="text-xs text-zinc-500 font-medium">Protection</dt>
                  <dd className="mt-1 text-sm font-semibold text-zinc-200">
                    {product.details.protection}
                  </dd>
                </div>
                <div className="col-span-1 sm:col-span-2 border-b border-zinc-900 pb-2">
                  <dt className="text-xs text-zinc-500 font-medium">Dimensions (lens-bridge-temple)</dt>
                  <dd className="mt-1 text-sm font-semibold text-zinc-200">
                    {product.details.dimensions} mm
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-8 pt-6 border-t border-zinc-900">
            {/* Stock status */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`h-2.5 w-2.5 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-xs text-zinc-400">
                {product.inStock ? "In Stock & Ready to Ship" : "Temporarily Out of Stock"}
              </span>
            </div>

            <ProductActions product={product} />

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Truck className="h-4 w-4 text-green-500" />
                <span>Free Worldwide Express Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span>100-Day Free Return Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {similarProducts.length > 0 && (
        <div className="mt-24 border-t border-zinc-900 pt-16">
          <h2 className="text-2xl font-bold text-white mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similarProducts.map((p) => (
              <Link
                key={p.id}
                href={`/shop/${p.id}`}
                className="group border border-zinc-900 bg-zinc-900/10 rounded-2xl p-4 transition-all hover:border-zinc-800 hover:bg-zinc-900/30"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-950 border border-zinc-900">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover object-center group-hover:scale-103 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4 flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-green-500 transition-colors text-sm">
                      {p.title}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1">{p.category} Collection</p>
                  </div>
                  <span className="font-bold text-zinc-200 text-sm">Rs. {p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
