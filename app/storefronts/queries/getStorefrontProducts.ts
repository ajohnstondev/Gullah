import { NotFoundError, SessionContext } from "blitz"
import db, { FindOneStorefrontArgs } from "db"

type GetStorefrontProductsInput = {
  where: FindOneStorefrontArgs["where"]
  include?: FindOneStorefrontArgs['include'],
  orderBy?,
  cursor?,
  take?,
  skip?
  // Only available if a model relationship exists
  // include?: FindOneStorefrontArgs['include']
}

export default async function getStorefrontProducts(
  { where, orderBy, cursor, take, skip /* include */ }: GetStorefrontProductsInput,
  ctx: { session?: SessionContext } = {}
) {
  // ctx.session!.authorize()

  const storefront = await db.storefront.findOne({ where })

  if (!storefront) throw new NotFoundError()

  const storefrontproducts = await db.product.findMany({
    where: {
      storefrontId: storefront.id
    },
    orderBy,
    take,
    skip
  })

  const count = await db.product.findMany({
    where: {
      storefrontId: storefront.id
    }
  })

  const hasMore = skip! + take! < count.length


  return {storefrontproducts, hasMore}
}
