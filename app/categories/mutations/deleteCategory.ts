import { SessionContext } from "blitz"
import db, { CategoryDeleteArgs } from "db"

type DeleteCategoryInput = {
  where: CategoryDeleteArgs["where"]
}

export default async function deleteCategory(
  { where }: DeleteCategoryInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const category = await db.category.delete({ where })

  return category
}
