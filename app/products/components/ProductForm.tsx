import React from "react"
import { LabeledTextField } from "app/components/LabeledTextField"
import { Form } from "app/components/Form"

type ProductFormProps = {
  initialValues: any
  onSubmit: Function
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
  </Form>
  )
}

export default ProductForm
