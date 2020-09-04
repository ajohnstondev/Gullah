import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useRouter, BlitzPage, ssrQuery } from "blitz"
import getProduct from "app/products/queries/getProduct"
import deleteProduct from "app/products/mutations/deleteProduct"
import getStorefront from "app/storefronts/queries/getStorefront"
import { Product as ProductType, Storefront, User } from "db"
import getCurrentUser from "app/users/queries/getCurrentUser"




type Props = {
  product: string,
  storefront: Storefront,
  currentUser: User
}

export const getServerSideProps = async ({params, req, res}) => {


  const product = await ssrQuery(getProduct, {
    where: { id: Number(params?.productId)},
  }, {req, res})


  const _storefront = await ssrQuery(getStorefront, {
    where: { id: product.storefrontId},
  }, {req, res})

  const currentUser = await ssrQuery(getCurrentUser, null, {req, res})
  


  return {
    props: {
      product: JSON.stringify(product),
      storefront: {
        id: _storefront.id,
        userId: _storefront.userId,
        name: _storefront.name
      },
      currentUser: JSON.stringify(currentUser)
    }
  }
}


    
const ShowProductPage: BlitzPage<Props> = (props) => {

  const router = useRouter()

  const product: ProductType = JSON.parse(props.product)
  

  return (
    <div>
      <Head>
        <title>Product</title>
      </Head>

      <main>

        <h1>{product.title}</h1>
        <p>Store: <Link href="/storefronts/[storefrontId]" as={`/storefronts/${props.storefront.id}`}><a>{props.storefront.name}</a></Link></p>
        <p>{product.description}</p>
        {props.currentUser.id == props.storefront.userId && <>
    
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

      </main>
    </div>
  )
}

ShowProductPage.getLayout = (page) => <Layout title={"Product"}>{page}</Layout>

export default ShowProductPage
