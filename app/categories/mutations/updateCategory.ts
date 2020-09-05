import { SessionContext } from "blitz"
import db, { CategoryUpdateArgs } from "db"

type UpdateCategoryInput = {
  where: CategoryUpdateArgs["where"]
  data: CategoryUpdateArgs["data"]
}

export default async function updateCategory(
  { where, data }: UpdateCategoryInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const category = await db.category.update({ where, data })

  return category
}
