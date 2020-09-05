import { SessionContext } from "blitz"
import db, { GalleryUpdateArgs } from "db"

type UpdateGalleryInput = {
  where: GalleryUpdateArgs["where"]
  data: GalleryUpdateArgs["data"]
}

export default async function updateGallery(
  { where, data }: UpdateGalleryInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const gallery = await db.gallery.update({ where, data })

  return gallery
}
