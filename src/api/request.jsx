// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import md5 from 'md5';

// export const useRequest = () => {

//   const [items, setItems] = useState([])


//   const BASE_URL = 'http://api.valantis.store:40000/';

//   const dateISO = new Date().toISOString().split('T');
//   const date = dateISO[0].split('-').join('');

//   const headers = {
//     'Content-Type': 'application/json',
//     'X-Auth': md5(`Valantis_${date}`),  
//   };

//   const getIds = async () => {
//     const res = await axios
//       .post(
//         BASE_URL,
//         JSON.stringify({
//           "action": 'get_ids',
//           "params": {"offset": 0, "limit": 50}      
//         }),
//         { headers },
//       )
//       return res.data.result
//   }
  
//   const getItems = async (ids) => {
//     const res = await axios
//     .post(
//       BASE_URL,
//       JSON.stringify({
//         "action": 'get_items',
//         "params": {"ids": [...ids]}      
//       }),
//       { headers },
//     )
//     return res.data.result
//   }

//   const request = async () => {
//     const ids = await getIds()
//     const items = await getItems(ids)
//     setItems(items)
//   }

//   request()   

//   return items
// }
