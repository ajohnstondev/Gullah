import { SessionContext } from "blitz"
import db, { ProductUpdateArgs } from "db"

type UpdateProductInput = {
  where: ProductUpdateArgs["where"]
  data: ProductUpdateArgs["data"]
}

export default async function updateProduct(
  { where, data }: UpdateProductInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const product = await db.product.findOne({where})
  const storefront = await db.storefront.findOne({where: {
    id: product?.storefrontId
  }})



  if(ctx.session!.userId == storefront?.userId) {
    const updatedProduct = await db.product.update({ where, data })

    return updatedProduct

  } else {
    throw new Error("You don't own this product")
  }


}
