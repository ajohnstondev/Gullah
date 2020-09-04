import { SessionContext } from "blitz"
import db, { StorefrontDeleteArgs } from "db"

type DeleteStorefrontInput = {
  where: StorefrontDeleteArgs["where"]
}

export default async function deleteStorefront(
  { where }: DeleteStorefrontInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()
  const storefront = await db.storefront.findOne({where})

  if(ctx.session!.userId == storefront?.userId) { 
    //delete store products as well
    await db.product.deleteMany({where: {storefront: {id: where.id}}})

    //then delete storefront
    const deletedStorefront = await db.storefront.delete({ where })

    return deletedStorefront
  } else {
    throw new Error("You don't own this storefront")
  }


}
