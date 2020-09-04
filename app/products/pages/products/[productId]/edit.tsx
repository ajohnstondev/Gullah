import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, ssrQuery } from "blitz"
import getProduct from "app/products/queries/getProduct"
import updateProduct from "app/products/mutations/updateProduct"
import ProductForm from "app/products/components/ProductForm"
import { toast } from 'react-toastify';
import path from "path"
import {getSessionContext} from "@blitzjs/server"
import db from "db"
import getStorefront from "app/storefronts/queries/getStorefront"

export const EditProduct = () => {
  const router = useRouter()
  const productId = useParam("productId", "number")
  const [product, { mutate }] = useQuery(getProduct, { where: { id: productId } })

  return (
    <div>
      <h1>Edit Product {product.id}</h1>
      <pre>{JSON.stringify(product)}</pre>

      <ProductForm
        initialValues={product}
        onSubmit={async (data) => {
          try {

            const {id, createdAt,storefrontId, ...newData} = data;

            const updated = await updateProduct({
              where: { id: product.id },
              data: {
                ...newData
              },
            })
            mutate(updated)
            toast.success('Product updated');
            router.push("/products/[productId]", `/products/${updated.id}`)
          } catch (error) {
            toast.error(error.message);
          }
        }}
      />
    </div>
  )
}

const EditProductPage: BlitzPage = () => {
  return (
    <div>
      <Head>
        <title>Edit Product</title>
      </Head>

      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <EditProduct />
        </Suspense>

        <p>
          <Link href="/products">
            <a>Products</a>
          </Link>
        </p>
      </main>
    </div>
  )
}

EditProductPage.getLayout = (page) => <Layout title={"Edit Product"}>{page}</Layout>

export const getServerSideProps = async ({params, req, res }) => {
  // Ensure these files are not eliminated by trace-based tree-shaking (like Vercel)
  // https://github.com/blitz-js/blitz/issues/794
    path.resolve("next.config.js")
    path.resolve("blitz.config.js")
    path.resolve(".next/__db.js")
  // End anti-tree-shaking



  const session = await getSessionContext(req, res)


  if(session.userId) {

    const user = await db.user.findOne({where: {id: session.userId}, include: {storefront: true}})
    const currentProduct = await ssrQuery(getProduct, {where: { id: Number(params.productId)}}, {req, res})
    const storefront = await ssrQuery(getStorefront, {where: { id: currentProduct.storefrontId}}, {req, res})

    if(user && user.id !== storefront?.userId) {
      res.writeHead(302, {location: "/?authError=You don't own this product"})
      res.end()
    }

    return {props: {user: session.userId}}

  } else {
    res.writeHead(302, {location: "/login?authError=You have to be logged in"})
    res.end()
    return {props: {}}
  }

  
}

export default EditProductPage
