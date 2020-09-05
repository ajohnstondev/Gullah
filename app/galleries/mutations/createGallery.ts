import { SessionContext } from "blitz"
import db, { GalleryCreateArgs } from "db"

type CreateGalleryInput = {
  data: GalleryCreateArgs["data"]
}
export default async function createGallery(
  { data }: CreateGalleryInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const gallery = await db.gallery.create({ data })

  return gallery
}
