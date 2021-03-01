import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
const Header = () => {
  return (
    <Wrapper>
 
        <Button>
        <Navlink to="/">
         
         Home
        </Navlink>
        </Button>
        <Button>
        <Navlink to="/admin">
        Admin
        </Navlink>
        </Button>
      
    </Wrapper>
  );
};
const Wrapper = styled.div`
z-index:2;
position:fixed;
display: flex;
  justify-content: space-evenly;
  padding-top: 15px;
  width:100vw;

`;
const List = styled.div`
 padding:10px;
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
`;
const Navlink = styled(NavLink)`
  color: white;
  text-decoration: none;
`;

export default Header;
