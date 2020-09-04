import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage } from "blitz"
import getStorefront from "app/storefronts/queries/getStorefront"
import updateStorefront from "app/storefronts/mutations/updateStorefront"
import StorefrontForm from "app/storefronts/components/StorefrontForm"
import { toast } from 'react-toastify';
import path from "path"
import {getSessionContext} from "@blitzjs/server"
import db from "db"

export const EditStorefront = () => {
  const router = useRouter()
  const storefrontId = useParam("storefrontId", "number")
  const [storefront, { mutate }] = useQuery(getStorefront, { where: { id: storefrontId } })

  return (
    <div>
      <h1>Edit Storefront {storefront.id}</h1>
      <pre>{JSON.stringify(storefront)}</pre>

      <StorefrontForm
        initialValues={storefront}
        onSubmit={async (data) => {
          try {
         
            const {id, createdAt,userId, ...newData} = data;

            const updated = await updateStorefront({
              where: { id: storefront.id },
              data: {
                ...newData
              },
            })
            mutate(updated)
            toast.success('Storefront updated');
            router.push("/storefronts/[storefrontId]", `/storefronts/${updated.id}`)
          } catch (error) {
            toast.error(error.message);
          }
        }}
      />
    </div>
  )
}

const EditStorefrontPage: BlitzPage = () => {
  return (
    <div>
      <Head>
        <title>Edit Storefront</title>
      </Head>

      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <EditStorefront />
        </Suspense>

        <p>
          <Link href="/storefronts">
            <a>Storefronts</a>
          </Link>
        </p>
      </main>
    </div>
  )
}

EditStorefrontPage.getLayout = (page) => <Layout title={"Edit Storefront"}>{page}</Layout>

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
    const currentStorefront = await db.storefront.findOne({where: {id: Number(params.storefrontId) }})

    if(user && user.id !== currentStorefront?.userId) {
      res.writeHead(302, {location: "/?authError=You don't own this storefront"})
      res.end()
    }

    return {props: {user: session.userId}}

  } else {
    res.writeHead(302, {location: "/login?authError=You have to be logged in"})
    res.end()
    return {props: {}}
  }


}

export default EditStorefrontPage
