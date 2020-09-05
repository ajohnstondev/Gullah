import { SessionContext } from "blitz"
import db, { GalleryDeleteArgs } from "db"

type DeleteGalleryInput = {
  where: GalleryDeleteArgs["where"]
}

export default async function deleteGallery(
  { where }: DeleteGalleryInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const gallery = await db.gallery.delete({ where })

  return gallery
}
