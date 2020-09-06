import { NotFoundError, SessionContext } from "blitz"
import db, { FindOneProductArgs } from "db"

type GetProductInput = {
  where: FindOneProductArgs["where"]
  // Only available if a model relationship exists
  include?: FindOneProductArgs['include']
}

export default async function getProduct(
  { where, include /* include */ }: GetProductInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const product = await db.product.findOne({ where, include })

  if (!product) throw new NotFoundError()

  return product
}
