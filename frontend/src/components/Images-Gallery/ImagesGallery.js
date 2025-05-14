import { useState, useEffect } from 'react'
import { Container, Row, Col, Pagination } from 'react-bootstrap'
import { toast } from 'react-toastify'
import 'bootstrap/dist/css/bootstrap.min.css'
import Search from './Search'
import ImageCard from './ImageCard'
import Welcome from './Welcome'
import Spinner from '../Spinner'
import {
  getImage,
  saveImage,
  fetchImages,
  deleteImage,
} from '../../api/imagesGalleryService'

const ImagesGallery = () => {
  const [searchValue, setSearchValue] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  // Universal function for loading images
  const loadImages = async (page) => {
    setLoading(true)
    try {
      const res = await fetchImages(page)
      setImages(res.results || [])
      setTotalPages(Math.ceil(res.count / 9))
    } catch (error) {
      toast.error(error.message || 'Error loading images.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadImages(currentPage)
  }, [currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSearchSubmit = async (e) => {
    e.preventDefault()
    if (!searchValue.trim()) {
      toast.error('Please enter a valid search query.')
      return
    }

    try {
      const data = await getImage(searchValue)
      if (data?.errors) {
        toast.error('No images found. Please try another query.')
      } else {
        const newImage = { ...data, title: searchValue }
        const res = await saveImage(newImage)
        if (res?.unsplash_id) {
          toast.info(
            `Image ${newImage.title.toUpperCase()} successfully added.`
          )
          setCurrentPage(1) // Reset to the first page
          loadImages(1) // Refresh data
        } else {
          toast.error('Failed to save the image.')
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        //  404
        toast.error('No images found. Please try another query.')
      } else {
        // others
        toast.error(error.message || 'Error searching for the image.')
      }
    }

    setSearchValue('')
  }

  const handleDeleteImage = async (imageToDelete) => {
    try {
      const res = await deleteImage(imageToDelete.id)
      if (res.status === 204) {
        toast.success(
          `Image ${imageToDelete.title?.toUpperCase()} successfully deleted.`
        )

        // Refresh data after deletion
        const updatedImages = await fetchImages(currentPage)
        const newTotalPages = Math.ceil(updatedImages.count / 9)

        if (currentPage > newTotalPages) {
          // If the current page is no longer valid, reset it
          setCurrentPage(Math.max(newTotalPages, 1)) // Reset to the last or first valid page
        } else {
          setImages(updatedImages.results || [])
        }

        setTotalPages(newTotalPages)
      } else {
        toast.error('Unexpected response from the server.')
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error deleting the image.')
    }
  }

  return (
    <div>
      <h1 className="text-center">Images Gallery</h1>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Search
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            handleSubmit={handleSearchSubmit}
          />
          <Container className="mt-4">
            {images.length > 0 ? (
              <Row xs={1} md={2} lg={3}>
                {images.map((image) => (
                  <Col className="pb-3" key={image.unsplash_id}>
                    <ImageCard image={image} deleteImage={handleDeleteImage} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Welcome />
            )}
          </Container>
          {totalPages > 1 && (
            <div className="pagination mt-4 d-flex justify-content-center">
              <Pagination>
                {[...Array(totalPages)].map((_, number) => (
                  <Pagination.Item
                    key={number + 1}
                    active={number + 1 === currentPage}
                    onClick={() => handlePageChange(number + 1)}
                  >
                    {number + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ImagesGallery
