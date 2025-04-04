import { api } from './axios'

const IMAGE_GALLERY_API_URL = 'images-gallery/images/'

export const fetchImages = async (page = 1, pageSize = 9) => {
  try {
    const response = await api.get(IMAGE_GALLERY_API_URL, {
      params: { page, page_size: pageSize },
    })
    return response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error('Page not found. Reset to first page.')
      return await api
        .get(IMAGE_GALLERY_API_URL, {
          params: { page: 1, page_size: pageSize },
        })
        .then((response) => response.data)
    } else {
      console.error(error.message)
      throw error
    }
  }
}

export const getImage = async (text) => {
  try {
    if (!text.trim()) {
      throw new Error('Query parameter is missing or invalid')
    }
    const response = await api.get(
      `${IMAGE_GALLERY_API_URL}retrieve_unsplash_image`,
      { params: { query: text } }
    )
    return response.data
  } catch (error) {
    console.error(`Error retrieving Unsplash image: ${error.message}`)
    throw error
  }
}

export const saveImage = async (image) => {
  try {
    if (!image || !image.title) {
      throw new Error('Image data is incomplete')
    }
    const response = await api.post(IMAGE_GALLERY_API_URL, image)
    return response.data
  } catch (error) {
    console.error(`Error saving image: ${error.message}`)
    throw error
  }
}

export const deleteImage = async (id) => {
  try {
    if (!id) {
      throw new Error('Image ID is required for deletion')
    }
    const response = await api.delete(`${IMAGE_GALLERY_API_URL}${id}/`)
    return response
  } catch (error) {
    console.error(`Error deleting image: ${error.message}`)
    throw error
  }
}
