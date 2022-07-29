import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChatContainer from "../components/ChatContainer";
import Contact from "../components/Contact";
import Welcome from "../components/Welcome";
import { host, allUserRouter, userByIdRouter } from "../utils/APIRoutes";
import { io } from "socket.io-client";

function Chat() {
  const socket = useRef<any>(null);
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState<any>(undefined);
  const [currentChat, setCurrentChat] = useState<any>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    identifiedUser();
  }, []);

  useEffect(() => {
    contact();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  const identifiedUser = async () => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("chat-app-user") || "");
      const { data } = await axios.get(userByIdRouter + "/" + user._id);
      setCurrentUser(data);
      setIsLoaded(true);
    }
  };

  const contact = async () => {
    const user = JSON.parse(localStorage.getItem("chat-app-user") || "");
    const { data } = await axios.get(allUserRouter + "/" + user._id);
    setContacts(data);
  };

  const handleChatChange = (chat: any) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contact contact={contacts} changeChat={handleChatChange} />
          {isLoaded && currentChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
            />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  /* background-color: #131324; */
  .container {
    height: 85vh;
    width: 85vw;
    /* background-color: #00000076; */
    border-radius: 1rem;
    border: 1px solid aqua;
    /* border-color: black; */
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
