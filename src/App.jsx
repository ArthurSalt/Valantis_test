import { useState } from 'react';
import axios from 'axios';
import md5 from 'md5';

import './App.css';

function App() {
  const [items, setItems] = useState(null)
  const BASE_URL = 'http://api.valantis.store:40000/';

  const dateISO = new Date().toISOString().split('T');
  const date = dateISO[0].split('-').join('');

  const headers = {
    'Content-Type': 'application/json',
    'X-Auth': md5(`Valantis_${date}`),
  };

  // const body = {
  //   action: 'get_ids',
  //   // "params": {"ids": ["1789ecf3-f81c-4f49-ada2-83804dcc74b0"]}
  // };

  axios
    .post(
      BASE_URL,
      JSON.stringify({
        "action": 'get_ids',
        "params": {"offset": 0, "limit": 50}      
      }),
      { headers },
    )
    .then((response) => {
      console.log('Response:', response.data);
      setItems(response.data.result)
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  return (
    <>
      {items && items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </>
  );
}

export default App;
