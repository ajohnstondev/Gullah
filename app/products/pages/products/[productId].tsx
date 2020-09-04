import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage } from "blitz"
import getProduct from "app/products/queries/getProduct"
import deleteProduct from "app/products/mutations/deleteProduct"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import getStorefront from "app/storefronts/queries/getStorefront"

export const Product = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()
  const productId = useParam("productId", "number")
  const [product] = useQuery(getProduct, { where: { id: productId } })
  const [storefront] = useQuery(getStorefront, {where: { id: product.storefrontId}} )

  return (
    <div>
      <h1>Product {product.id}</h1>
      <pre>{JSON.stringify(product, null, 2)}</pre>

    {currentUser?.id == storefront.userId && <>
    
      <Link href="/products/[productId]/edit" as={`/products/${product.id}/edit`}>
        <a>Edit</a>
      </Link>

      <button
        type="button"
        onClick={async () => {
          if (window.confirm("This will be deleted")) {
            await deleteProduct({ where: { id: product.id } })
            router.push("/products")
          }
        }}
      >
        Delete
      </button></>
    }
     
    </div>
  )
}

const ShowProductPage: BlitzPage = () => {
  return (
    <div>
      <Head>
        <title>Product</title>
      </Head>

      <main>
        <p>
          <Link href="/products">
            <a>Products</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <Product />
        </Suspense>
      </main>
    </div>
  )
}

ShowProductPage.getLayout = (page) => <Layout title={"Product"}>{page}</Layout>

export default ShowProductPage
