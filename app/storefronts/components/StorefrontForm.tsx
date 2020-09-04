import React from "react"
import { LabeledTextField } from "app/components/LabeledTextField"
import { Form } from "app/components/Form"


export const StorefrontForm = (props) => {
  return (

      <Form
        submitText="Submit"
        initialValues={props.initialValues}
        onSubmit={async (values, form) => {
          await props.onSubmit(values)
          setTimeout(()=> form.reset())
        }}
      >
        <LabeledTextField name="name" label="Name" placeholder="Name" type="text" />
        <LabeledTextField name="description" label="Description" placeholder="Description" type="text" />
      </Form>

  )
}

export default StorefrontForm
