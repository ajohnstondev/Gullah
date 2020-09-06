import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useRouter, BlitzPage, ssrQuery } from "blitz"
import getProduct from "app/products/queries/getProduct"
import deleteProduct from "app/products/mutations/deleteProduct"
import getStorefront from "app/storefronts/queries/getStorefront"
import { Product as ProductType, Storefront, User, Category } from "db"
import getCurrentUser from "app/users/queries/getCurrentUser"




type Props = {
  product: string,
  storefront: Storefront,
  currentUser: string
}



export const getServerSideProps = async ({params, req, res}) => {


  const product = await ssrQuery(getProduct, {
    where: { id: Number(params?.productId)},
    include: {categories: true},
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


  interface ExtendedProductType extends ProductType {
    categories: []
  }
  const product: ExtendedProductType = JSON.parse(props.product)


  const currentUser: User = JSON.parse(props.currentUser)

  
  return (
    <div>
      <Head>
        <title>Product</title>
      </Head>

      <main>

        <h1>{product.title}</h1>
        {product.categories.map((cat: Category) => {
          return (
            <span style={{marginRight: '14px'}}>{cat.title}</span>
          )
        })}

        <p>Store: <Link href="/storefronts/[storefrontId]" as={`/storefronts/${props.storefront.id}`}><a>{props.storefront.name}</a></Link></p>
        <p>{product.description}</p>
        {currentUser.id == props.storefront.userId && <>
    
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
