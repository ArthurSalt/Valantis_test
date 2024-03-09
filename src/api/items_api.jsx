import axios from 'axios';
import md5 from 'md5';

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
  const array = res.data.result

  const uniqItems = array.filter((obj, i, arr) => (
    arr.findIndex((obj2) => (obj2.id === obj.id)) === i
    ))
    
  return uniqItems
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

export const getTotalCount = async () => {
  const res = await axios
    .post(
      BASE_URL,
      JSON.stringify({
        "action": "get_fields",
        "params": {"field": "brand",},   
      }),
      { headers },
    )
    return res.data.result.length
}

export const requestItems = async (offset = 0) => {
  const ids = await getIds(offset)
  const items = await getItems(ids)
  return items
}

export const requestFilteredItems = async (filterType, filterValue) => {
  const ids = await getFilteredList(filterType, filterValue)
  const items = await getItems(ids)
  return items
}