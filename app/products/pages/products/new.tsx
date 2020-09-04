import React from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useRouter, BlitzPage } from "blitz"
import createProduct from "app/products/mutations/createProduct"
import ProductForm from "app/products/components/ProductForm"
import { toast } from 'react-toastify';
import db from "db"
import {getSessionContext} from "@blitzjs/server"
import path from "path"

const NewProductPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <Head>
        <title>New Product</title>
      </Head>

      <main>
        <h1>Create New Product</h1>

        <ProductForm
          initialValues={{}}
          onSubmit={async (data) => {
            try {
              const product = await createProduct({ 
                data: {
                  ...data
                }
              })
              toast.success('Product created');
              router.push("/products/[productId]", `/products/${product.id}`)
            } catch (error) {
              toast.error(error.message);
            }
          }}
        />


      </main>
    </div>
  )
}

NewProductPage.getLayout = (page) => <Layout title={"Create New Product"}>{page}</Layout>


export const getServerSideProps = async ({req, res}) => {
  // Ensure these files are not eliminated by trace-based tree-shaking (like Vercel)
  // https://github.com/blitz-js/blitz/issues/794
    path.resolve("next.config.js")
    path.resolve("blitz.config.js")
    path.resolve(".next/__db.js")
  // End anti-tree-shaking


  const session = await getSessionContext(req, res)
  

  if(session.userId) {
    const user = await db.user.findOne({where: {id: session.userId}, include: {storefront: true}})

    if(!user?.storefront) {
      res.writeHead(302, {location: "/storefronts/new?authError=You don't have a storefront"})
      res.end()
    }

    return {props: {user: session.userId}}
    
  } else {
    res.writeHead(302, {location: "/login?authError=You have to be logged in"})
    res.end()
    return {props: {}}
  }

}

export default NewProductPage
