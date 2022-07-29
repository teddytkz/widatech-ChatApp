import React, { useState } from "react";
import styled from "styled-components";
import { IoMdSend } from "react-icons/io";

function ChatInput({ handleSendMsg }: any) {
  const [msg, setMsg] = useState("");

  const sendChat = (e: any) => {
    e.preventDefault();
    console.log("ddsad");
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <form className="input-container" onSubmit={(e) => sendChat(e)}>
        <input
          type="text"
          placeholder="Type Your Message Here"
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        />
        <button className="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  /* grid-template-columns: 5% 95%; */
  align-items: center;
  /* background-color: #080420; */
  padding: 0 2rem;
  padding-bottom: 0.3rem;
  @media screen and (min-width: 720px) and(max-width:1080px) {
    padding: 0.1rem;
    svg {
      font-size: 1rem;
    }
  }

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: black;
      border: 1px solid gray;
      border-radius: 3rem;
      padding-left: 1rem;
      font-size: 1.2rem;
      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      background-color: #9e86f3;
      border: none;
      @media screen and (min-width: 720px) and(max-width:1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: black;
        cursor: pointer;
      }
    }
  }
`;

export default ChatInput;
