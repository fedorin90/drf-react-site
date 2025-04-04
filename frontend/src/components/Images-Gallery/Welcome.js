import React, { Button, Container } from 'react-bootstrap';

const jumbotronStyle = {
  padding: '2rem 1rem',
  marginBottom: '2rem',
  backgroundColor: '#e9ecef',
  borderRadius: '.3rem',
};

const Welcome = () => {
  return (
    <Container style={jumbotronStyle} className="mt-3">
      <h1>Images Gallery</h1>
      <p>
        This is simple application that retieves photos using Unsplash API. In
        order to start enter aby search term in the input field.
      </p>
      <p>
        <Button className="primary" href="https://unsplash.com" target="_blank">
          Go to Unsplash
        </Button>
      </p>
    </Container>
  );
};

export default Welcome;
