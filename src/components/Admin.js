import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Admin = () => {
  const [reservations, setReservation] = useState([{}]);
  useEffect(() => {
    fetch("/allReservations")
      .then((res) => res.json())
      .then((res) => res.result)
      .then((res) => setReservation(res));
  }, []);
  console.log(reservations);

  return (
    <Wrapper>
      <Main>
        <TitleBox>
          <Title>
            <h1>Administrator</h1>
          </Title>
          <Title>
            <h2>All Reservations</h2>
          </Title>
        </TitleBox>
        <Container>
          {reservations.map((res) => {
            return (
              <List key={res._id}>
                <Item>
                  <p>Seat: {res._id} </p>
                </Item>
                <Item>
                  <p>Email: {res.email} </p>
                </Item>
                <Item>
                  <p>Name: {res.fullName} </p>
                </Item>
              </List>
            );
          })}
        </Container>
      </Main>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 100px;
`;
const Main = styled.div`
  margin-top: 100px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Container = styled.div`
  margin-top: 100px;
  text-align: center;
  width: 50vw;

`;

const ResForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Form = styled.div``;
const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  text-align: center;
`;
const Title = styled.div`
  color: white;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 15px;
  padding: 10px;
  margin-bottom:10px;
  background-color: white;
`;
const Item = styled.div`
  color: black;

  text-align: center;
`;
export default Admin;
