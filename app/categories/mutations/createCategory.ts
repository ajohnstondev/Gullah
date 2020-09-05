import { SessionContext } from "blitz"
import db, { CategoryCreateArgs } from "db"

type CreateCategoryInput = {
  data: CategoryCreateArgs["data"]
}
export default async function createCategory(
  { data }: CreateCategoryInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const category = await db.category.create({ data })

  return category
}
