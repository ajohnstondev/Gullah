import { SessionContext } from "blitz"
import db, { FindManyProductArgs } from "db"

type GetProductsInput = {
  where?: FindManyProductArgs["where"]
  orderBy?: FindManyProductArgs["orderBy"]
  cursor?: FindManyProductArgs["cursor"]
  take?: FindManyProductArgs["take"]
  skip?: FindManyProductArgs["skip"]
  // Only available if a model relationship exists
  // include?: FindManyProductArgs['include']
}

export default async function getProducts(
  { where, orderBy, cursor, take, skip }: GetProductsInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const products = await db.product.findMany({
    where,
    orderBy,
    cursor,
    take,
    skip,
  })

  return products
}
