import { SessionContext } from "blitz"
import db, { FindManyStorefrontArgs } from "db"

type GetStorefrontsInput = {
  where?: FindManyStorefrontArgs["where"]
  orderBy?: FindManyStorefrontArgs["orderBy"]
  cursor?: FindManyStorefrontArgs["cursor"]
  take?: FindManyStorefrontArgs["take"]
  skip?: FindManyStorefrontArgs["skip"]
  // Only available if a model relationship exists
  // include?: FindManyStorefrontArgs['include']
}

export default async function getStorefronts(
  { where, orderBy, cursor, take, skip }: GetStorefrontsInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const storefronts = await db.storefront.findMany({
    where,
    orderBy,
    cursor,
    take,
    skip,
  })

  return storefronts
}
