import React from 'react';
import Dropdown from './dropdown';

const list = [
  {
    display: 'Arkham Knight',
    value: 1,
  },
  {
    display: 'Devil May Cry',
    value: 2,
  },
  {
    display: 'Witcher 3',
    value: 3,
  },
  {
    display: 'Assassins creed',
    value: 4,
  },
  {
    display: 'Spider-Man',
    value: 5,
  },
];

const App = () => (
  <Dropdown
    display="Groups"
    list={list}
  />
);

export default App;
