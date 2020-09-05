import { SessionContext } from "blitz"
import db, { FindManyCategoryArgs } from "db"

type GetCategoriesInput = {
  where?: FindManyCategoryArgs["where"]
  orderBy?: FindManyCategoryArgs["orderBy"]
  cursor?: FindManyCategoryArgs["cursor"]
  take?: FindManyCategoryArgs["take"]
  skip?: FindManyCategoryArgs["skip"]
  // Only available if a model relationship exists
  // include?: FindManyCategoryArgs['include']
}

export default async function getCategories(
  { where, orderBy, cursor, take, skip }: GetCategoriesInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const categories = await db.category.findMany({
    where,
    orderBy,
    cursor,
    take,
    skip,
  })

  return categories
}
