import { SessionContext } from "blitz"
import db, { ProductCreateArgs } from "db"

type CreateProductInput = {
  data: ProductCreateArgs["data"]
}
export default async function createProduct(
  { data }: CreateProductInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  // const user = await db.user.findOne({
  //   where: {
  //     id: ctx.session?.userId
  //   },
  //   include: {
  //     storefront: true
  //   }
  // })

  if(ctx.session?.userId) {

    const storefront = await db.storefront.findOne({
      where: {
        userId: ctx.session?.userId
      }
    })
  
    if(!storefront) { throw new Error("Please apply for a storefront") }
  
    const product = await db.product.create({ 
      data: {
        ...data,
        storefront: {
          connect: {
            id: storefront.id
          }
        }
      } 
    })

    return product
  } else {
    throw new Error('You have to be logged in')
  }

  

  
}
