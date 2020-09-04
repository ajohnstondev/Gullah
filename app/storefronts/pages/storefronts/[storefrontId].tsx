import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useRouter, Router, useQuery, usePaginatedQuery, useRouterQuery, useParam, BlitzPage } from "blitz"
import getStorefront from "app/storefronts/queries/getStorefront"
import getStorefrontProducts from 'app/storefronts/queries/getStorefrontProducts'
import deleteStorefront from "app/storefronts/mutations/deleteStorefront"
import { useCurrentUser } from "app/hooks/useCurrentUser"


const ITEMS_PER_PAGE = 1


export const Storefront = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()
  const storefrontId = useParam("storefrontId", "number")
  const [storefront] = useQuery(getStorefront, { 
    where: { id: storefrontId }, 
    include: { products: true } 
  })

  const {page = 0} = useRouterQuery()

  const [{storefrontproducts, hasMore}] = usePaginatedQuery(getStorefrontProducts, { 
    where: { id: storefrontId },
    skip: ITEMS_PER_PAGE * Number(page),
    take: ITEMS_PER_PAGE,
  })


  const goToPreviousPage = () => {
    const query = { page: Number(page) - 1 }

    const url = { pathname: '/storefronts/[storefrontId]', query };

    const urlAs = { pathname: `/storefronts/${storefront.id}`, query }

    return router.push(url, urlAs);
  }


  const goToNextPage = () => {
    const query = { page: Number(page) + 1 }

    const url = { pathname: '/storefronts/[storefrontId]', query };

    const urlAs = { pathname: `/storefronts/${storefront.id}`, query }

    return router.push(url, urlAs);
  }

  return (
    <div>
      <h1>Storefront {storefront.id}</h1>
      {/* <pre>{JSON.stringify(storefront, null, 2)}</pre> */}


      <h3>Store Products</h3>
      <pre>{JSON.stringify(storefrontproducts, null, 2)}</pre>
      <button disabled={page == 0 || !page} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
      

    {currentUser?.id == storefront.userId && <>
          <Link href="/storefronts/[storefrontId]/edit" as={`/storefronts/${storefront.id}/edit`}>
          <a>Edit</a>
        </Link>
  
        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteStorefront({ where: { id: storefront.id } })
              router.push("/storefronts")
            }
          }}
        >
          Delete
        </button>
        </>
    }




    </div>
  )
}

const ShowStorefrontPage: BlitzPage = () => {
  return (
    <div>
      <Head>
        <title>Storefront</title>
      </Head>

      <main>

        <Suspense fallback={<div>Loading...</div>}>
          <Storefront />
        </Suspense>
      </main>
    </div>
  )
}

ShowStorefrontPage.getLayout = (page) => <Layout title={"Storefront"}>{page}</Layout>

export default ShowStorefrontPage
