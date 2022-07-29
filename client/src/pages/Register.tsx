import axios from "axios";
import React, { useState } from "react";
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { registerRoute } from "../utils/APIRoutes";
import "./styled/Register.css";

function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setIsLoading(!isLoading);
    const { name, username, email, password } = values;
    const { data, status } = await axios.post(registerRoute, {
      name,
      username,
      email,
      password,
    });
    console.log(data);
    setIsLoading(false);
    if (status === 200) {
      navigate("/login");
    } else {
    }
  };

  const handleFormChange = (event: any) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <Container>
      <Row>
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form
            style={{ width: "80%", maxWidth: 500 }}
            onSubmit={handleRegister}
          >
            <h1 className="text-center">Create Account</h1>
            <div className=""></div>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your Name"
                name="name"
                onChange={(e) => handleFormChange(e)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                onChange={(e) => handleFormChange(e)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                onChange={(e) => handleFormChange(e)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={(e) => handleFormChange(e)}
                required
              />
            </Form.Group>
            <Form.Group className="md-3" controlId="formButton">
              <Button variant="primary" type="submit" style={{ margin: 5 }}>
                {isLoading ? (
                  <span>
                    <Spinner animation="grow" size="sm" /> Loading
                  </span>
                ) : (
                  "Register"
                )}
              </Button>
            </Form.Group>
            <div className="py-4">
              <p className="text-center">
                Already have an Account ? <Link to="/login">Login</Link>
              </p>
            </div>
          </Form>
        </Col>
        <Col md={5} className="register_bg"></Col>
      </Row>
    </Container>
  );
}

export default Register;
