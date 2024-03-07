import { useState, useEffect } from 'react';
import { Pagination } from './components/Pagination';
import axios from 'axios';
import md5 from 'md5';

import './App.css';

function App() {

  const [items, setItems] = useState([])
  const [ids, setIds] = useState([])
  const [filterValue, setFilterValue] = useState('');
  const [offset, setOffset] = useState('');
  const [filterType, setFilterType] = useState('product');

  // const handleChange = (event) => {
  //   setFilter(event.target.value);
  // };

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

  const getFilteredList = async (filterType, filterValue) => {
    const res = await axios
    .post(
      BASE_URL,
      JSON.stringify({
        "action": "filter",
        "params": {[filterType]: filterValue,}      
      }),
      { headers },
    )
    return res.data.result
  }

  const requestItems = async (offset) => {
    const ids = await getIds(offset)
    setIds(ids)
    const items = await getItems(ids)
    setItems(items)
  }
  const requestFilteredItems = async (filterType, filterValue) => {
    const ids = await getFilteredList(filterType, filterValue)
    setIds(ids)
    const items = await getItems(ids)
    setItems(items)
  }

  useEffect(() => {
    requestItems()   
  }, [])    

  const handlePageChange = async (page) => {
    const offset = (page - 1) * 50
    setOffset(offset)
    await requestItems(offset)
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    await requestFilteredItems(filterType, filterValue)
  }

  return (
    <section>
      <Pagination
        totalItems={8004} 
        itemsPerPage={50} 
        onPageChange={handlePageChange}
      />

      <form onSubmit={handleSubmit} className='input_group'>
        <select name="select" id="select" 
          onChange={(e) => {setFilterType(e.target.value)}}
        >
          <option defaultValue value="product">name</option>
          <option value="price">price</option>
          <option value="brand">brand</option>
        </select>
        <input 
          value={filterValue} 
          type={filterType === 'price' ? 'number' : 'text'} 
          onChange={(e) => setFilterValue(e.target.value)}
          />
        <button type='submit'>Search</button>
      </form>

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
