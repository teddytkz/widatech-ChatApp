import axios from "axios";
import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import "./styled/Login.css";
import { loginRoute } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(!isLoading);

    const { username, password } = values;

    const { data, status } = await axios.post(loginRoute, {
      username,
      password,
    });
    console.log(data);
    setIsLoading(false);
    if (status === 200) {
      localStorage.setItem("chat-app-user", JSON.stringify(data.data));
      navigate("/chat");
    } else {
    }
  };

  const handleFormChange = (event: any) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  return (
    <Container>
      <Row>
        <Col md={5} className="login_bg"></Col>
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                name="username"
                onChange={(e) => handleFormChange(e)}
                required
              />
            </Form.Group>

            <Form.Group className="md-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={(e) => handleFormChange(e)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group className="md-3" controlId="formButton">
              <Button variant="primary" type="submit" style={{ margin: 5 }}>
                {isLoading ? (
                  <span>
                    <Spinner animation="grow" size="sm" /> Loading
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
