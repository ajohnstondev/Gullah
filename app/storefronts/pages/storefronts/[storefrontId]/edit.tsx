import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, ssrQuery } from "blitz"
import getStorefront from "app/storefronts/queries/getStorefront"
import updateStorefront from "app/storefronts/mutations/updateStorefront"
import StorefrontForm from "app/storefronts/components/StorefrontForm"
import { toast } from "react-toastify"
import path from "path"
import { getSessionContext } from "@blitzjs/server"
import db, {Storefront as StorefrontType} from "db"
import superjson from 'superjson';
import removeFileupload from 'app/images/mutations/removeFileupload'
import uploadSingleFile from '../../../../../utils/uploadSingleFile'

type Props = {
  storefront: string
}

export const getServerSideProps = async ({ params, req, res }) => {
  // Ensure these files are not eliminated by trace-based tree-shaking (like Vercel)
  // https://github.com/blitz-js/blitz/issues/794
  path.resolve("next.config.js")
  path.resolve("blitz.config.js")
  path.resolve(".next/__db.js")
  // End anti-tree-shaking

  const session = await getSessionContext(req, res)

  if (session.userId) {
    const user = await db.user.findOne({
      where: { id: session.userId },
      include: { storefront: true },
    })
    const currentStorefront = await ssrQuery(
      getStorefront,
      { where: { id: Number(params.storefrontId) }, include: {categories: true} },
      { req, res }
    )

    if (user && user.id !== currentStorefront?.userId) {
      res.writeHead(302, { location: "/?authError=You don't own this storefront" })
      res.end()
    }

    return { props: { user: session.userId, storefront:superjson.stringify(currentStorefront)  } }
  } else {
    res.writeHead(302, { location: "/login?authError=You have to be logged in" })
    res.end()
    return { props: {} }
  }
}


const EditStorefrontPage: BlitzPage<Props> = (props) => {
  const router = useRouter()
  const storefront: StorefrontType = superjson.parse(props.storefront)

  return (
    <div>
      <Head>
        <title>Edit Storefront</title>
      </Head>

      <main>

        <h1>Edit Storefront {storefront.id}</h1>
        <StorefrontForm
        initialValues={storefront}
        onSubmit={async (data) => {
      
          try {
            const { id, createdAt, userId, ...newData } = data

            await removeFileupload(storefront.bannerImage.public_id)
            const response = await uploadSingleFile(data.bannerImage)
            const body = await response.json()

            const updated = await updateStorefront({
              where: { id: storefront.id },
              data: {
                ...newData,
                bannerImage: {...body}
              },
            })

            toast.success("Storefront updated")
            router.push("/storefronts/[storefrontId]", `/storefronts/${updated.id}`)
          } catch (error) {
            toast.error(error.message)
          }
        }}
      />

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

export default EditStorefrontPage
