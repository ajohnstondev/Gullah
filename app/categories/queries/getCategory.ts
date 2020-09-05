import { NotFoundError, SessionContext } from "blitz"
import db, { FindOneCategoryArgs } from "db"

type GetCategoryInput = {
  where: FindOneCategoryArgs["where"]
  // Only available if a model relationship exists
  // include?: FindOneCategoryArgs['include']
}

export default async function getCategory(
  { where /* include */ }: GetCategoryInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const category = await db.category.findOne({ where })

  if (!category) throw new NotFoundError()

  return category
}
