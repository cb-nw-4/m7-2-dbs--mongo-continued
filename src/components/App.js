import React from "react";
import styled from "styled-components";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {  BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";
import { createBrowserHistory } from "history";
import GlobalStyles from "./GlobalStyles";
import TicketWidget from "./TicketWidget";
import PurchaseModal from "./PurchaseModal";
import { SeatContext } from "./SeatContext";
import { BookingContext } from "./BookingContext";
import Admin from "./Admin";
import Header from "./Header";

import "tippy.js/dist/tippy.css";

function App() {
  const historyInstance = createBrowserHistory();
  const {
    actions: { receiveSeatInfoFromServer },
  } = React.useContext(SeatContext);
  const {
    actions: { clearSnackbar },
    status,
  } = React.useContext(BookingContext);

  React.useEffect(() => {
    fetch("/api/seat-availability")
      .then((res) => res.json())
      .then(receiveSeatInfoFromServer);
  }, [receiveSeatInfoFromServer]);

  return (
    <>
    
      <Router history={historyInstance}>

        <Header />
          <Wrapper>
            <Switch>
              <Route exact path="/">
                <Centered>
                  <TicketWidget />
                </Centered>

                <PurchaseModal />
                <Snackbar open={status === "purchased"} severity="success">
                  <Alert
                    severity="success"
                    onClose={clearSnackbar}
                    elevation={6}
                    variant="filled"
                  >
                    Successfully purchased ticket! Enjoy the show.
                  </Alert>
                </Snackbar>
              </Route>
              <Route exact path="/admin">
                <Admin />
              </Route>
            </Switch>

            <GlobalStyles />
          </Wrapper>
      
      </Router>
    </>
  );
}
const Wrapper = styled.div`
width:100vw;
height:100vh;
`;
const Centered = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Navlink = styled(NavLink)``;
export default App;
