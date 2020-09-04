import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useQuery, BlitzPage } from "blitz"
import getProducts from "app/products/queries/getProducts"

export const ProductsList = () => {
  const [products] = useQuery(getProducts, { orderBy: { id: "desc" } })

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href="/products/[productId]" as={`/products/${product.id}`}>
            <a>{product.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

const ProductsPage: BlitzPage = () => {
  return (
    <div>
      <Head>
        <title>Products</title>
      </Head>

      <main>
        <h1>Products</h1>

        <p>
          <Link href="/products/new">
            <a>Create Product</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ProductsList />
        </Suspense>
      </main>
    </div>
  )
}

ProductsPage.getLayout = (page) => <Layout title={"Products"}>{page}</Layout>

export default ProductsPage
