import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { allUserRouter, userByIdRouter } from "../utils/APIRoutes";

function Contact({ changeChat }: any) {
  const [currentUserName, setCurrentUsername] = useState<any>(undefined);
  const [currentUserImage, setCurrentUserImage] = useState<any>(undefined);
  const [currentSelected, setCurrentSelected] = useState<any>(undefined);

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    contact();
    currentUser();
  }, []);

  const contact = async () => {
    const user = JSON.parse(localStorage.getItem("chat-app-user") || "");
    const { data } = await axios.get(allUserRouter + "/" + user._id);
    setContacts(data);
  };

  const changeCurrentChat = (index: any, contact: any) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const currentUser = async () => {
    const user = JSON.parse(localStorage.getItem("chat-app-user") || "");
    const { data } = await axios.get(userByIdRouter + "/" + user._id);
    console.log(user._id);
    setCurrentUsername(data.name);
    setCurrentUserImage(data.avatarImage);
  };

  return (
    <>
      <Container>
        <div className="brand">
          <img src={Logo} alt="logo" />
          <h3>Chatapp</h3>
        </div>
        <div className="contacts">
          {contacts.map((contact: any, index: any) => {
            return (
              <div
                key={index}
                className={`contact ${
                  index === currentSelected ? "selected" : ""
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt="avatar"
                  />
                </div>
                <div className="name">
                  <h3>{contact.name}</h3>
                </div>
              </div>
            );
          })}
        </div>
        <div className="current-user">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentUserImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h2>{currentUserName}</h2>
          </div>
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #ffffff39;
  border-right: 1px solid aqua;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      height: 2rem;
    }
    h3 {
      color: black;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    background-color: #ffffff39;
    &::-webkit-scrollbar {
      width: 2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      min-height: 5rem;
      width: 90%;
      cursor: pointer;
      border-radius: 0.2rem;
      padding: 0.4rem;
      gap: 1rem;
      align-items: center;
      display: flex;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .name {
        h3 {
          color: black;
        }
      }
    }
    .selected {
      background-color: #9186f3;
    }
  }
  .current-user {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    border-top: 1px solid aqua;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: black;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

export default Contact;
