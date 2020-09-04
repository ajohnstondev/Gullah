import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useQuery, BlitzPage } from "blitz"
import getStorefronts from "app/storefronts/queries/getStorefronts"

export const StorefrontsList = () => {
  const [storefronts] = useQuery(getStorefronts, { orderBy: { id: "desc" } })

  return (
    <ul>
      {storefronts.map((storefront) => (
        <li key={storefront.id}>
          <Link href="/storefronts/[storefrontId]" as={`/storefronts/${storefront.id}`}>
            <a>{storefront.name}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

const StorefrontsPage: BlitzPage = () => {
  return (
    <div>
      <Head>
        <title>Storefronts</title>
      </Head>

      <main>
        <h1>Storefronts</h1>


        <Suspense fallback={<div>Loading...</div>}>
          <StorefrontsList />
        </Suspense>
      </main>
    </div>
  )
}

StorefrontsPage.getLayout = (page) => <Layout title={"Storefronts"}>{page}</Layout>

export default StorefrontsPage
