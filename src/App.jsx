import { useState, useEffect} from 'react';
import { Pagination } from './components/Pagination';
import { requestItems, requestFilteredItems, getTotalCount } from './api/items_api';

import './App.css';

function App() {
  const [items, setItems] = useState('')
  const [totalItems, setTotalItems] = useState()
  const [filtered, setFiltered] = useState('')
  const [filterValue, setFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('product');
  console.log(currentPage)
  

  useEffect(() => {
    const onMount = async () => {
      const items = await requestItems()
      setItems(items)
      const totalCount = await getTotalCount()
      setTotalItems(totalCount) 
    }
    onMount()
  }, [])    

  const handlePageChange = async (page) => {
    const offset = (page - 1) * 50
    if(filtered) {
      const lastItem = offset + 50;
      const currentChunk = filtered.slice(offset, lastItem);
      setItems(currentChunk)
      setCurrentPage(page)
    } else {
      const items = await requestItems(offset)
      setItems(items)
      setCurrentPage(page)
    }
  };  

  const handleSubmitFilter = async (e) => {
    e.preventDefault()
    if(filterType === 'price') {
      const items = await requestFilteredItems(filterType, Number(filterValue))
      setFiltered(items)
      setTotalItems(items.length)
      setCurrentPage(1)
    } else {
      const items = await requestFilteredItems(filterType, filterValue)
      setFiltered(items)
      setTotalItems(items.length)
      setCurrentPage(1)
    }
  }
  
  const removeFilter = async () => {
    setFiltered('')
    const items = await requestItems()
    setItems(items)
    const totalCount = await getTotalCount()
    setTotalItems(totalCount)
    setFilterValue('')
    setCurrentPage(1)
}

  return (
    <section>
      <Pagination
        totalItems={totalItems} 
        itemsPerPage={50} 
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <form onSubmit={handleSubmitFilter} className='input_group'>
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
        <button type='reset' onClick={() => removeFilter()}>Reset</button>
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
        {items ? items.map(item => (
          <tr key={Math.random()}>
            <td>{item.id}</td>
            <td>{item.product}</td>
            <td>{item.price}</td>
            <td>{item.brand}</td>
          </tr>
        )) : <tr>
          <td>No Items Found</td>
          </tr>}
        </tbody>
      </table>
    </section>
  );
}

export default App;
