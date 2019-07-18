import React, {
  useState,
  setGlobal,
  useGlobal,
  addReducer,
  useDispatch,
  getGlobal,
  getDispatch,
} from 'reactn';
import { Box, TextInput, Button, CheckBox } from 'grommet/components';
import logo from './logo.svg';
import './App.css';
//import actions from './users/data/actions';
//import reducer from './users/data/reducer';
import crudFor from './crud';

//window.actions = actions;
window.crudFor = crudFor;
window.getGlobal = getGlobal;
window.getDispatch = getDispatch;
const ADD_CARD = 'ADD_CARD';

addReducer(ADD_CARD, (global, dispatch, action) => {
  const newCard = {
    id: global.cards[global.cards.length - 1].id + 1,
    name: action.name,
  };
  return { cards: [...global.cards, newCard] };
});

function CardControl(props) {
  const [name, setName] = useState('');
  const addNewCard = useDispatch(ADD_CARD);
  const handleAdd = e => {
    e.preventDefault();
    addNewCard({ name });
    setName('');
  };
  const handleChange = e => setName(e.target.value);

  return (
    <section>
      <h2>Add new card</h2>
      <form onSubmit={handleAdd}>
        <TextInput
          placeholder="name here"
          value={name}
          onChange={handleChange}
        />
        <Button type="submit" label="Add" />
      </form>
    </section>
  );
}

function App() {
  const [cards] = useGlobal('cards');
  const [showLogo, setShowLogo] = useGlobal('showLogo');

  return (
    <div className="App">
      <header className="App-header">
        {showLogo && <img src={logo} className="App-logo" alt="logo" />}
        <CheckBox
          checked={showLogo}
          label="Display logo"
          onChange={e => setShowLogo(e.target.checked)}
        />
        <CardControl />
        {cards.map(card => (
          <Box
            direction="row"
            border={{ size: 'large' }}
            background="light-2"
            margin="xsmall"
            key={card.id}
          >
            {card.name}
          </Box>
        ))}
      </header>
    </div>
  );
}

export default App;
