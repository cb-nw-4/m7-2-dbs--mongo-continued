import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
const Header = () => {
  return (
    <Wrapper>
      <div>
        <Button>
          <Navlink to="/">Home</Navlink>
        </Button>
      </div>
      <div>
        <Button>
          <Navlink to="/admin">Admin</Navlink>
        </Button>
      </div>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  z-index: 2;
  position: fixed;
  display: flex;
  justify-content: space-evenly;
  padding-top: 15px;
  padding-bottom: 20px;
  width: 100vw;
  height: 20vh;
`;
const List = styled.div`
  padding: 10px;
`;

const Link = styled.li``;
const Button = styled.button`
  background-color: #00af98;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 110%;
  padding-top: 5px;
  padding-bottom: 5px;
  width: 100px;
  height: 50px;
`;
const Navlink = styled(NavLink)`
  color: white;
  text-decoration: none;
`;

export default Header;
