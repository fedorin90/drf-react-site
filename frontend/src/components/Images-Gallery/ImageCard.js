import { Button, Card } from 'react-bootstrap'
import { ImBin } from 'react-icons/im'

const ImageCard = (propps) => {
  const { image, deleteImage } = propps
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={image.url} />
      <Card.Body>
        <Card.Title>{image.title?.toUpperCase() || 'no title'}</Card.Title>
        <Card.Text>{image.description}</Card.Text>
        <Button onClick={() => deleteImage(image)} variant="outline-danger">
          <ImBin />
        </Button>{' '}
        <Card.Footer className="text-center text-muted mt-2">
          {image.author_url && (
            <Card.Link
              target="_blank"
              style={{ textDecoration: 'none' }}
              href={image.author_url}
            >
              {image.author}
            </Card.Link>
          )}
          {!image.author_url && image.author}
        </Card.Footer>
      </Card.Body>
    </Card>
  )
}

export default ImageCard
