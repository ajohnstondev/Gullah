import { NotFoundError, SessionContext } from "blitz"
import db, { FindOneGalleryArgs } from "db"

type GetGalleryInput = {
  where: FindOneGalleryArgs["where"]
  // Only available if a model relationship exists
  // include?: FindOneGalleryArgs['include']
}

export default async function getGallery(
  { where /* include */ }: GetGalleryInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const gallery = await db.gallery.findOne({ where })

  if (!gallery) throw new NotFoundError()

  return gallery
}
