import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Admin = () => {
  const [reservations, setReservation] = useState([]);
  useEffect(() => {
    fetch("/allReservations")
      .then((res) => res.json())

      .then((res) => setReservation(res));
  }, []);
  console.log(reservations);
  return (
    <Wrapper>
      <Main>
        <Title>
          <h1>Administrator</h1>
        </Title>
        <Container></Container>
      </Main>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Main = styled.div`
  margin-top: 100px;
  display: flex;
  justify-content: center;
`;
const Container = styled.div``;
const Form = styled.div``;
const Title = styled.div`
  color: white;
`;
export default Admin;
