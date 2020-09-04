import { NotFoundError, SessionContext } from "blitz"
import db, { FindOneStorefrontArgs } from "db"

type GetStorefrontInput = {
  where: FindOneStorefrontArgs["where"]
  include?: FindOneStorefrontArgs['include']
  // Only available if a model relationship exists
  // include?: FindOneStorefrontArgs['include']
}

export default async function getStorefront(
  { where, include /* include */ }: GetStorefrontInput,
  ctx: { session?: SessionContext } = {}
) {
  // ctx.session!.authorize()

  const storefront = await db.storefront.findOne({ where, include })

  if (!storefront) throw new NotFoundError()

  return storefront
}
