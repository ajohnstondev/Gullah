import React, {Suspense} from "react"
import { LabeledTextField } from "app/components/LabeledTextField"
import { Form } from "app/components/Form"
import {DropdownSelectField} from 'app/components/DropdownSelectField'
import getCategories from 'app/categories/queries/getCategories'
import {useQuery} from 'blitz'

type ProductFormProps = {
  initialValues: any
  onSubmit: Function
}

const CategoryDropdown = () => {
  const [category] =  useQuery(getCategories, {})
  const [newCats, setNewCats]: any  = React.useState([])
  
  const buildList =  async () => {

    //Build the category list to work with the react-select component
    const list = await category.reduce((acc:any, item:any) => {
      if(item.title == 'Uncategorized') {
        acc.push({label: item.title, value: item.id})
      } else if(item.parent) {
        acc.push({label: item.title, value: item.id, children: []})
      } else if(item.parent == false) {
        const parent = acc.filter((d) => d.value == item.parentId)
        parent[0].children.push({label: item.title, value: item.id})
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
    <DropdownSelectField name="categories" label="Categories" placeholder="Categories" data={newCats} />
  )
}

const ProductForm = ({ initialValues, onSubmit }: ProductFormProps) => {

  return (
    <Form
    submitText="Submit"
    initialValues={initialValues}
    onSubmit={async (values, form) => {
      await onSubmit(values)
      setTimeout(()=> form.reset())
    }}
  >
    <LabeledTextField name="title" label="Title" placeholder="Title" type="text" />
    <LabeledTextField name="description" label="Description" placeholder="Description" type="text" />
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryDropdown />
    </Suspense>
    
    
  </Form>
  )
}

export default ProductForm
