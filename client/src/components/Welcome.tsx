import React from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";

function Welcome({ currentUser }: any) {
  return (
    <>
      <Container>
        <img src={Robot} alt="Robot" />
        <h1>
          Welcome, <span>{currentUser.name}</span>
        </h1>
        <h3>Please select a chat to Start Messaging</h3>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: blue;
  }
`;

export default Welcome;
