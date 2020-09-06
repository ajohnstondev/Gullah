import React, { PropsWithoutRef } from "react"
import { useField } from "react-final-form"
import {CheckTreePicker} from 'rsuite'
import 'rsuite/lib/styles/index.less';

export interface DropdownSelectFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string

  data: {}[]
  /** Field type. Doesn't include radio buttons and checkboxes */
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const DropdownSelectField = React.forwardRef<HTMLInputElement, DropdownSelectFieldProps>(
  ({ name, label, outerProps,data, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name)

    const [categories, setCategories] = React.useState([])

    const  handleChange = async (e:[]) => {
      await setCategories(e)
      input.onChange(e)    
    }

 
    return (
      <div {...outerProps}>
        <label>
          {label}
          <CheckTreePicker 
            block={true} 
            cascade={false} 
            onChange={handleChange} 
            ref={ref}
            value={categories} 
            disabled={submitting} 
            data={data} style={{ width: 280 }} />

        </label>

        {touched && (error || submitError) && (
          <div role="alert" style={{ color: "red" }}>
            {error || submitError}
          </div>
        )}

       
      </div>
    )
  }
)

export default DropdownSelectField
