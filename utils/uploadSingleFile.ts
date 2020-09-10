import fetch from 'isomorphic-unfetch'

const uploadSingleFile = async (files) => {
  const formData = new FormData();

  formData.append("file", files[0]);
  formData.append("upload_preset", "ftnholvp");


  const cloudName = 'dllteeu5w'

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`


  const response = await fetch(endpoint, {
    method: "post",
    body: formData

  })
  
  return response

}

export default uploadSingleFile