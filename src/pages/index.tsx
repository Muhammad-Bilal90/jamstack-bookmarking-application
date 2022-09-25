import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Navbar, Button, Modal, Form, Card } from 'react-bootstrap';
import { TrashFill } from "react-bootstrap-icons"

const GET_BOOKMARKS = gql`
query GetBookmarks {
    getBookmarks {
      id
      title
      url
      desc
    }
  }
`

const ADD_BOOKMARK = gql`
  mutation AddBookmark($title: String!, $url: String!, $desc: String!) {
    addBookmark(title: $title, url: $url, desc: $desc) {
      id
    }
  }
`

const REMOVE_BOOKMARK = gql`
mutation removeBookmark($id: ID!){
  removeBookmark(id: $id){
   url
  }
}
`


export default function Home() {

  const { loading, error, data } = useQuery(GET_BOOKMARKS);
  const [addBookmark] = useMutation(ADD_BOOKMARK);
  const [removeBookmark] = useMutation(REMOVE_BOOKMARK);
  const [show, setShow] = useState(false);
  const inputTitle = useRef<any>();
  const inputUrl = useRef<any>();
  const inputDesc = useRef<any>();

  console.log(data);
  return (
    <div>
      <Navbar collapseOnSelect className="px-3" expand="sm" bg="dark" variant="dark">
        <Navbar.Brand>Bookmarks App</Navbar.Brand>
      </Navbar>
      <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
        <div className="mb-5">
          <div>Want to add a Bookmark ?</div>
          <Button variant="dark" className="w-100" onClick={() => { setShow(true) }} >Add Bookmark</Button>
        </div>
        <h3 className="mb-3">Your Bookmarks</h3>
        <div className='mt-3'>
          {(loading) ? <div>Loading...</div> :
            error ? <div>An unexpected error occured, please refresh the page!</div> :
              (data.getBookmarks.length === 0 ? (
                <h5>You have no saved bookmarks!</h5>
              ) : (
                data.getBookmarks.map(link => (
                  <Card key={link.id} className='mb-2'>
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <Card.Title>{link.title}</Card.Title>
                        <span onClick={() => {
                          removeBookmark({ variables: { id: link.id}, refetchQueries: [{ query: GET_BOOKMARKS }],})
                        }}><TrashFill /></span>
                      </div>
                        <Card.Link className="mb-1" target="_blank" href={link.url}>{link.url}</Card.Link>
                        <Card.Text>{link.desc}</Card.Text>
                    </Card.Body>
                  </Card>  
                ))
              ))}
        </div>


        <Modal
          show={show}
          onHide={() => { setShow(false) }}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add a Bookmark</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="title" className="mb-3">
              <Form.Control ref={inputTitle} type="text" placeholder="Enter Title" />
            </Form.Group>
            <Form.Group controlId="url" className="mb-3">
              <Form.Control ref={inputUrl} type="text" placeholder="Enter Url" />
            </Form.Group>
            <Form.Group controlId="description" className="mb-3">
              <Form.Control ref={inputDesc} type="text" placeholder="Enter Description" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShow(false) }}>
              Close
            </Button>
            <Button variant="dark" onClick={() => {
              var res = inputUrl.current.value.slice(0, 8);
              if (res !== "https://") {
                inputUrl.current.value = `https://${inputUrl.current.value}`
              }

              addBookmark({
                variables: { title: inputTitle.current.value, url: inputUrl.current.value, desc: inputDesc.current.value },
                refetchQueries: [{ query: GET_BOOKMARKS }],
              })
              inputTitle.current.value = "";
              inputUrl.current.value = "";
              inputDesc.current.value = "";
              setShow(false)
            }} >Add</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export const Head = () => <title>Bookmarking App</title>;
