import React from 'react';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';

const Search = (propps) => {
  const { handleSubmit, searchValue, setSearchValue } = propps;
  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={9}>
                <Form.Control
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search for a new image..."
                />
              </Col>
              <Col>
                <Button type="submit" className="mb-2">
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Search;
