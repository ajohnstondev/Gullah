import { SessionContext } from "blitz"
import db, { StorefrontUpdateArgs } from "db"

type UpdateStorefrontInput = {
  where: StorefrontUpdateArgs["where"]
  data: StorefrontUpdateArgs["data"]
}

export default async function updateStorefront(
  { where, data }: UpdateStorefrontInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const storefront = await db.storefront.findOne({ where })

  if (ctx.session!.userId === storefront?.userId) {
    const updateStorefront = await db.storefront.update({
      where,
      data: {
        ...data,
      },
    })

    return updateStorefront
  } else {
    throw new Error("You don't own this storefront")
  }
}
