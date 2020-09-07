import React from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useRouter, BlitzPage } from "blitz"
import {getSessionContext} from "@blitzjs/server"
import createStorefront from "app/storefronts/mutations/createStorefront"
import StorefrontForm from "app/storefronts/components/StorefrontForm"
import path from "path"
import { toast } from 'react-toastify';
import db from "db"

type Props = {
  user: number
}

const NewStorefrontPage: BlitzPage<Props> = ({children, user}) => {
  const router = useRouter()

  return (
    <div>
      <Head>
        <title>New Storefront</title>
      </Head>

      <main>
        <h1>Create New Storefront</h1>

        <StorefrontForm
          initialValues={{}}
          onSubmit={async (data) => {
            
            try {
             
              const storefront = await createStorefront({
                data: {
                  ...data
                } 

              })
              toast.success('Storefront created');
              router.push("/storefronts/[storefrontId]", `/storefronts/${storefront.id}`)
            } catch (error) {
              toast.error(error.message);

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

NewStorefrontPage.getLayout = (page) => <Layout title={"Create New Storefront"}>{page}</Layout>


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

    if(user?.storefront) {
      res.writeHead(302, {location: "/?authError=You have a storefront already"})
      res.end()
    }

    return {props: {user: session.userId}}
    
  } else {
    res.writeHead(302, {location: "/login?authError=You have to be logged in"})
    res.end()
    return {props: {}}
  }

}


export default NewStorefrontPage
