import { SessionContext } from "blitz"
import db, { StorefrontCreateArgs } from "db"

type CreateStorefrontInput = {
  data: StorefrontCreateArgs["data"]
}
export default async function createStorefront(
  { data }: CreateStorefrontInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()


  const user = await db.user.findOne({where: {id: ctx.session!.userId}, include: {storefront: true}})
  
  if(user?.storefront) {
    throw new Error("You already have a storefront")
  }

  const storefront = await db.storefront.create({
    data: {
      ...data,
      user: {
        connect: {
          id: ctx.session?.userId
        },
      },
    }
  })

  return storefront
}
