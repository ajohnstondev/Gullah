import { SessionContext } from "blitz"
import db, { ProductDeleteArgs } from "db"

type DeleteProductInput = {
  where: ProductDeleteArgs["where"]
}

export default async function deleteProduct(
  { where }: DeleteProductInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const product = await db.product.findOne({where})
  const storefront = await db.storefront.findOne({where: {
    id: product?.storefrontId
  }})

  if(ctx.session!.userId == storefront?.userId) {
    const deletedProduct = await db.product.delete({ where })

    return deletedProduct

  } else {
    throw new Error("You don't own this product")
  }


}
