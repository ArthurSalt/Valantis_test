import { useState, useEffect } from 'react';
import { Pagination } from './components/Pagination';
import axios from 'axios';
import md5 from 'md5';

import './reset.css'
import './App.css';

function App() {

  const [items, setItems] = useState([])
  const [ids, setIds] = useState([])
  const [currentPage, setCurrentPage] = useState(1);

  const BASE_URL = 'http://api.valantis.store:40000/';

  const dateISO = new Date().toISOString().split('T');
  const date = dateISO[0].split('-').join('');

  const headers = {
    "Content-Type":"application/json",
    'X-Auth': md5(`Valantis_${date}`),  
  };

  const getIds = async (offset = 0) => {
    const res = await axios
      .post(
        BASE_URL,
        JSON.stringify({
          "action": "get_ids",
          "params": {"offset": offset, "limit": 50},   
        }),
        { headers },
      )
      return res.data.result
  }
  
  const getItems = async (ids) => {
    const res = await axios
    .post(
      BASE_URL,
      JSON.stringify({
        "action": "get_items",
        "params": {"ids": [...ids]}      
      }),
      { headers },
    )
    return res.data.result
  }

  const request = async (offset) => {
    const ids = await getIds(offset)
    setIds(ids)
    const items = await getItems(ids)
    setItems(items)
  }

  useEffect(() => {
    request()   
  }, [])    

  const handlePageChange = (page) => {
    const offset = (page - 1) * 50
    request(offset)
    setCurrentPage(page);
  };

  return (
    <section>
      <Pagination
        totalItems={8004} 
        itemsPerPage={50} 
        onPageChange={handlePageChange}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Price</th>
            <th>Brand</th>
          </tr>
        </thead>
        <tbody>
        {items && items.map(item => (
          <tr key={Math.random()}>
            <td>{item.id}</td>
            <td>{item.product}</td>
            <td>{item.price}</td>
            <td>{item.brand}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </section>
  );
}

export default App;
