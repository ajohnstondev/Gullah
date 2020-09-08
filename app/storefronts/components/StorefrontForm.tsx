import React, { Suspense } from "react"
import { LabeledTextField } from "app/components/LabeledTextField"
import { Form } from "app/components/Form"
import { DropdownSelectField } from "app/components/DropdownSelectField"
import getCategories from "app/categories/queries/getCategories"
import { useQuery } from "blitz"

const CategoryDropdown = ({ values }) => {
  const [category] = useQuery(getCategories, {})
  const [newCats, setNewCats]: any = React.useState([])

  const buildList = async () => {
    //Build the category list to work with the react-select component
    const list = await category.reduce((acc: any, item: any) => {
      if (item.title === "Uncategorized") {
        acc.push({ label: item.title, value: item.id })
      } else if (item.parent) {
        acc.push({ label: item.title, value: item.id, children: [] })
      } else if (item.parent === false) {
        const parent = acc.filter((d) => d.value === item.parentId)
        parent[0].children.push({ label: item.title, value: item.id })
      } else {
        return
      }
      return acc
    }, [])
    await setNewCats(list)
  }

  React.useEffect(() => {
    buildList()
  }, [])

  return (
    <DropdownSelectField
      name="categories"
      label="Categories"
      placeholder="Categories"
      data={newCats}
      values={values}
    />
  )
}

export const StorefrontForm = (props) => {
  const {
    initialValues: { categories },
  } = props
  const values = categories && categories.length ? categories.map((c) => c.id) : []

  return (
    <Form
      submitText="Submit"
      initialValues={props.initialValues}
      onSubmit={async (values, form) => {
        await props.onSubmit(values)
        setTimeout(() => form.reset())
      }}
    >
      <LabeledTextField name="name" label="Name" placeholder="Name" type="text" />
      <LabeledTextField
        name="description"
        label="Description"
        placeholder="Description"
        type="text"
      />
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryDropdown values={values} />
      </Suspense>
    </Form>
  )
}

export default StorefrontForm
