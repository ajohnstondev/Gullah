import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useRouter, Router, useQuery, usePaginatedQuery, useRouterQuery, ssrQuery, useParam, BlitzPage, PromiseReturnType, GetServerSideProps } from "blitz"
import getStorefront from "app/storefronts/queries/getStorefront"
import getStorefrontProducts from 'app/storefronts/queries/getStorefrontProducts'
import deleteStorefront from "app/storefronts/mutations/deleteStorefront"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import { Storefront as StorefrontType } from "db"

type Props = {
  storefront: string
}

const ITEMS_PER_PAGE = 1

export const getServerSideProps = async ({params, req, res}) => {


  const storefront = await ssrQuery(getStorefront, {
    where: { id: Number(params?.storefrontId)},
  }, {req, res})


  return {
    props: {
      storefront: JSON.stringify(storefront)
    }
  }
}


export const Storefront = (props) => {
  const currentUser = useCurrentUser()
  const router = useRouter()
  const storefrontId = useParam("storefrontId", "number")


  const {page = 0} = useRouterQuery()

  const [{storefrontproducts, hasMore}] = usePaginatedQuery(getStorefrontProducts, { 
    where: { id: storefrontId },
    skip: ITEMS_PER_PAGE * Number(page),
    take: ITEMS_PER_PAGE,
  })


  const goToPreviousPage = () => {
    const query = { page: Number(page) - 1 }

    const url = { pathname: '/storefronts/[storefrontId]', query };

    const urlAs = { pathname: `/storefronts/${storefrontId}`, query }

    return router.push(url, urlAs);
  }


  const goToNextPage = () => {
    const query = { page: Number(page) + 1 }

    const url = { pathname: '/storefronts/[storefrontId]', query };

    const urlAs = { pathname: `/storefronts/${storefrontId}`, query }

    return router.push(url, urlAs);
  }

  return (
    <div>

      <h3>Store Products</h3>

      {storefrontproducts.map((product, i ) => {
        return (
          <div>
            <Link href="/products/[productId]" as={`/products/${product.id}`}>
              <a>{product.title}</a>
            </Link>
          </div>
        )
      })}
      <button disabled={page == 0 || !page} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
      
      <div>
        <hr/>
        {currentUser?.id == props.storefront.userId && 
          <>
            <Link href="/storefronts/[storefrontId]/edit" as={`/storefronts/${storefrontId}/edit`}>
              <a>Edit</a>
            </Link>
      
            <button
              type="button"
              onClick={async () => {
                if (window.confirm("This will be deleted")) {
                  await deleteStorefront({ where: { id: storefrontId } })
                  router.push("/storefronts")
                }
              }}
            >
              Delete
            </button>
          </>
        }
      </div>



    </div>
  )
}

const ShowStorefrontPage: BlitzPage<Props> = (props) => {
  const storefront: StorefrontType = JSON.parse(props.storefront)

  return (
    <div>
      <Head>
        <title>Storefront</title>
      </Head>

      <main>
        <h1>{storefront.name}</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <Storefront storefront={storefront}/>
        </Suspense>
      </main>
    </div>
  )
}


ShowStorefrontPage.getLayout = (page) => <Layout title={"Storefront"}>{page}</Layout>


export default ShowStorefrontPage
