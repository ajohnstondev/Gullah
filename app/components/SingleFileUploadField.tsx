import React, { PropsWithoutRef, useEffect, useState, useCallback } from "react"
import { useField } from "react-final-form"
import {useDropzone} from 'react-dropzone'
import styled from 'styled-components'
import uploadSingleFile from '../../utils/uploadSingleFile'



const Wrapper = styled.div`
  display: flex;
  align-items: center;

  .input {
    border: 1px solid #DFE1E6;
    background: #FAFBFC;
    padding: 8px;
    color: #97A0AF;
  }

  button {
    padding: 6px;
    background: linear-gradient(#fff, #F4F5F7);
    border-top: 1px solid #DFE1E6;
    border-right: 1px solid #DFE1E6;
    border-bottom: 1px solid #DFE1E6;
  }
`

const PreviewWrapper = styled.div`
  background: ${props => props.image ? `url(${props.image})` : '#EAEDF7'};
  width: 80px;
  height: 80px;
  margin-right: 1rem;
  position: relative;
  background-size: cover;

  img {
    width: 100%;
    height: 100%;
  }

  button {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(0,0,0,0.4);
    border-radius: 999px;
    height: 20px;
    width: 20px;
    border-color: transparent;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`



export interface SingleFileUploadFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string

  initialValue: any
  /** Field type. Doesn't include radio buttons and checkboxes */
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const SingleFileUploadField = React.forwardRef<HTMLInputElement, SingleFileUploadFieldProps>(
  ({ name, label, outerProps, placeholder,initialValue, ...props }, ref) => {
    const {
      input: {value, onChange, ...input},
      meta: { touched, error, submitError, submitting },
    } = useField(name)

    const [files, setFiles]: any = useState([]);
    const [metaData, setMetaData]: any = useState(initialValue ? {...initialValue} : {});


    const { getRootProps, getInputProps } = useDropzone({
      accept: "image/*",
      multiple: false,
      onDrop: async (acceptedFiles) => {

        const files = acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        );

        setFiles(files);


        if (onChange) {

          if(metaData && metaData.public_id) {
            fetch('/api/removeFileupload', {
              method: 'POST',
              body: JSON.stringify({
                public_id: metaData.public_id
              })
            })
          }


          const button = await document && document.getElementsByClassName('submitButton')[0] as HTMLButtonElement
          button.disabled = true
          const response = await uploadSingleFile(files)
          const body = await response.json()
          button.disabled = false
          setMetaData(body)

          onChange(body);
        }

      }
    });

    const removeFile = file => (e) => {
      e.preventDefault()

      if(files) {
        const newFiles = [...files];
        newFiles.splice(newFiles.indexOf(file), 1);
        setFiles(newFiles);
      }


      fetch('/api/removeFileupload', {
        method: 'POST',
        body: JSON.stringify({
          public_id: metaData.public_id
        })
      })
    };


  
    const thumbs = files.map((file, i) => (
      <PreviewWrapper key={i} image={file.preview}>
        <button onClick={removeFile(file)}>X</button>
      </PreviewWrapper>
    ));
  
    useEffect(
      () => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
      },
      [files]
    );

    useEffect(() => {
      setMetaData(initialValue)
    }, [])
  

    return (
      <div {...outerProps}>
        <label>
          {label}

          <Wrapper>
            {files.length ? <>{thumbs}</> : null}
            {!files.length && !metaData && <PreviewWrapper />}
            {!files.length && metaData && <PreviewWrapper image={metaData.secure_url}/>}
           


            <div {...getRootProps({ className: "btn-dropzone" })} onClick={e => e.stopPropagation()}>
              <input {...getInputProps()} />
            
              <span className="input">Drag your files here or browse to upload</span>
              <button onClick={(e) => e.preventDefault()}>Browse</button>
       

            </div>

          </Wrapper>

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

export default SingleFileUploadField
