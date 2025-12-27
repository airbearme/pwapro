import { createClient } from "@/lib/supabase/server"
import { CheckoutButton } from "@/components/checkout-button"

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase.from("products").select("*").eq("available", true)

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Mobile Bodega</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-muted-foreground">{product.description}</p>
            <p className="text-2xl font-bold mt-4">${product.price}</p>
            <CheckoutButton
              items={[
                {
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                },
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  )
}