import { useState, useEffect, useCallback} from 'react';
import { Pagination } from './components/Pagination';
import { requestItems, requestFilteredItems, getTotalCount } from './api/items_api';

import './App.css';

function App() {
  const [items, setItems] = useState('')
  const [totalItems, setTotalItems] = useState(0)
  const [filtered, setFiltered] = useState()
  const [filterValue, setFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('product');  

  useEffect(() => {
    const onMount = async () => {
      const items = await requestItems()
      setItems(items)
      const totalCount = await getTotalCount()
      setTotalItems(totalCount) 
    }
    onMount()
  }, [])    

  const handlePageChange = useCallback(async (page) => {
    try {
      const offset = (page - 1) * 50
      // Client Side Pagination for filtered items
      if(filtered) {
        const lastItem = offset + 50;
        const currentChunk = filtered.slice(offset, lastItem);
        setItems(currentChunk)
        setCurrentPage(page)
      } else {
        // Pagination via Valantis API
        const items = await requestItems(offset)
        setItems(items)
        setCurrentPage(page)
      }
    } catch (error) {
      alert(error.message)
    }
  }, [filtered]);  

  useEffect(() => {
    handlePageChange(1)
  }, [filtered, handlePageChange])
  
  const handleSubmitFilter = async (e) => {
    e.preventDefault()
    try {
      if(filterType === 'price') {
        const items = await requestFilteredItems(filterType, Number(filterValue))
        setTotalItems(items.length)
        setFiltered(items)
      } else {
        const items = await requestFilteredItems(filterType, filterValue)
        setTotalItems(items.length)
        setFiltered(items)
      }
    } catch (error) {
      alert(error.message)
    }
  }
  
  const removeFilter = async () => {
    try {
      setFiltered('')
      const items = await requestItems()
      setItems(items)
      const totalCount = await getTotalCount()
      setTotalItems(totalCount)
      setFilterValue('')
      setFilterType('product')
      setCurrentPage(1)
    } catch (error) {
      alert(error.message)
    }
}

  return (
    <section>
      <Pagination
        totalItems={totalItems} 
        itemsPerPage={50} 
        handlePageChange={handlePageChange}
        currentPage={currentPage}
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
        <button type='reset' onClick={() => removeFilter()}>Remove Filter</button>
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
        {items.length ? items.map(item => (
          <tr key={item.id}>
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
