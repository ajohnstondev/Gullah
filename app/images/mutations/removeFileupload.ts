import cloudinary from 'cloudinary'
import { SessionContext } from "blitz"




export default async function removeFileupload(
public_id,
ctx: {session?: SessionContext} = {}
) {
  ctx.session!.authorize()

    try {
      await cloudinary.v2.uploader.destroy(public_id)
    } catch(err) {
      console.log(err)
      throw new Error(err)
    }

}