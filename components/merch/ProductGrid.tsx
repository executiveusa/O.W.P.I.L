import { ProductCard } from "./ProductCard"
import products from "@/data/merch/products.json"

interface ProductGridProps {
  filter?: string
  featured?: boolean
}

export function ProductGrid({ filter = "all", featured = false }: ProductGridProps) {
  let filtered = products

  if (featured) {
    filtered = products.filter(p => p.featured)
  } else if (filter !== "all") {
    filtered = products.filter(p => p.collection === filter || p.category === filter)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {filtered.map((product, i) => (
        <div key={product.id} style={{ animationDelay: `${i * 50}ms` }}>
          <ProductCard
            id={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            image={product.image}
            shortDescription={product.shortDescription}
            collection={product.collection}
            protected={product.protected}
            digital={product.digital}
            status={product.status}
            featured={product.featured}
          />
        </div>
      ))}
    </div>
  )
}
