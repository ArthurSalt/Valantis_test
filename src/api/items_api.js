import axios from 'axios';
import md5 from 'md5';

const BASE_URL = 'https://api.valantis.store:41000/';

const dateISO = new Date().toISOString().split('T');
const date = dateISO[0].split('-').join('');

const headers = {
  'Content-Type': 'application/json',
  'X-Auth': md5(`Valantis_${date}`),
};

export const retryRequest = async (payload, maxCount) => {
  let response = null;
  let retries = 0;
  let success = false;

  while (retries <= maxCount && !success) {
    try {
      response = await axios.post(BASE_URL, JSON.stringify(payload), {
        headers,
      });
      success = true;
      console.log('Retry successful');
      break;
    } catch (error) {
      console.log(error.toJSON().status);
    }
    retries++;
  }
  if (retries >= maxCount) alert(`Failed after 3 retries.`);
  return response;
};

const getIds = async (offset = 0) => {
  let res;
  try {
    res = await axios.post(
      BASE_URL,
      JSON.stringify({
        action: 'get_ids',
        params: { offset: offset, limit: 50 },
      }),
      { headers },
    );
  } catch (error) {
    console.log(`Error status: ${error.toJSON().status}`);
    res = await retryRequest(
      {
        action: 'get_ids',
        params: { offset: offset, limit: 50 },
      },
      3,
    );
  }
  return res.data.result;
};

const getItems = async (ids) => {
  let res;
  let uniqItems;
  try {
    res = await axios.post(
      BASE_URL,
      JSON.stringify({
        action: 'get_items',
        params: { ids: [...ids] },
      }),
      { headers },
    );
  } catch (error) {
    console.log(`Error status: ${error.toJSON().status}`);
    res = await retryRequest(
      {
        action: 'get_items',
        params: { ids: [...ids] },
      },
      3,
    );
  }

  uniqItems = res.data.result.filter(
    (obj, i, arr) => arr.findIndex((obj2) => obj2.id === obj.id) === i,
  );

  return uniqItems;
};

const getFilteredList = async (filterType, filterValue) => {
  let res;
  try {
    res = await axios.post(
      BASE_URL,
      JSON.stringify({
        action: 'filter',
        params: { [filterType]: filterValue },
      }),
      { headers },
    );
  } catch (error) {
    console.log(`Error status: ${error.toJSON().status}`);
    res = await retryRequest(
      {
        action: 'filter',
        params: { [filterType]: filterValue },
      },
      3,
    );
  }
  return res.data.result;
};

export const getTotalCount = async () => {
  let res;
  try {
    res = await axios.post(
      BASE_URL,
      JSON.stringify({
        action: 'get_fields',
        params: { field: 'brand' },
      }),
      { headers },
    );
  } catch (error) {
    console.log(`Error status: ${error.toJSON().status}`);
    res = await retryRequest(
      {
        action: 'get_fields',
        params: { field: 'brand' },
      },
      3,
    );
  }
  return res.data.result.length;
};

export const requestItems = async (offset = 0) => {
  const ids = await getIds(offset);
  const items = await getItems(ids);
  return items;
};

export const requestFilteredItems = async (filterType, filterValue) => {
  const ids = await getFilteredList(filterType, filterValue);
  const items = await getItems(ids);
  return items;
};
