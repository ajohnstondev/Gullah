import React, { PropsWithoutRef } from "react"
import { useField } from "react-final-form"
import { CheckTreePicker } from "rsuite"
import "rsuite/lib/styles/index.less"

export interface DropdownSelectFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field default value for updating */
  values: number[]
  /** Field placeholder. */
  placeholder: string
  /** Field data for category selecting. */
  data: {}[]
  /** Field type. Doesn't include radio buttons and checkboxes */
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const DropdownSelectField = React.forwardRef<HTMLInputElement, DropdownSelectFieldProps>(
  ({ name, label, outerProps, data, values, placeholder, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name)

    // const [values, setValues] = React.useState([])

    const handleChange = async (e: []) => {
      // console.log('event has changed: ', e)
      // await setValues(e)
      const connect = e.map((v) => ({ id: v }))
      const disconnect = values.filter((v) => !e.includes(v)).map((v) => ({ id: v }))

      input.onChange({
        ...(connect.length && { connect }),
        ...(disconnect.length && { disconnect }),
      })
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
            defaultValue={values}
            disabled={submitting}
            placeholder={placeholder}
            data={data}
            style={{ width: 280 }}
          />
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
