import React from 'react';
import styled from 'styled-components';
import { Cat } from 'react-kawaii';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const App = () => (
  <Container>
    <Cat size={320} mood="lovestruck" color="rgb(255, 207, 0)" />
  </Container>
);

export default App;
