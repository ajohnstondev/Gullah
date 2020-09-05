import { SessionContext } from "blitz"
import db, { FindManyGalleryArgs } from "db"

type GetGalleriesInput = {
  where?: FindManyGalleryArgs["where"]
  orderBy?: FindManyGalleryArgs["orderBy"]
  cursor?: FindManyGalleryArgs["cursor"]
  take?: FindManyGalleryArgs["take"]
  skip?: FindManyGalleryArgs["skip"]
  // Only available if a model relationship exists
  // include?: FindManyGalleryArgs['include']
}

export default async function getGalleries(
  { where, orderBy, cursor, take, skip }: GetGalleriesInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const galleries = await db.gallery.findMany({
    where,
    orderBy,
    cursor,
    take,
    skip,
  })

  return galleries
}
