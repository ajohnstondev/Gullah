import { SessionContext } from "blitz"
import db, { StorefrontDeleteArgs } from "db"

type DeleteStorefrontInput = {
  where: StorefrontDeleteArgs["where"]
}

export default async function deleteStorefront(
  { where }: DeleteStorefrontInput,
  ctx: { session?: SessionContext } = {},
) {
  ctx.session!.authorize()
  const storefront = await db.storefront.findOne({where})


  if(ctx.session!.userId == storefront?.userId) { 
    //delete store products as well
    await db.product.deleteMany({where: {storefront: {id: where.id}}})

    if(storefront?.bannerImage?.public_id) {
      try {
        fetch(`${process.env.API_URL}/api/removeFileupload`, {
          method: 'POST',
          body: JSON.stringify({
            public_id: storefront.bannerImage.public_id
          })
        })
      } catch(err) {
        console.log(err)
      }

    }

    //then delete storefront
    const deletedStorefront = await db.storefront.delete({ where })

    return deletedStorefront
  } else {
    throw new Error("You don't own this storefront")
  }


}
