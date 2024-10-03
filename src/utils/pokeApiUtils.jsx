import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

const getBerryByName = async (name) => {
  const response = await axios.get(`${BASE_URL}/berry/${name}`);
  return response.data;
};

const getAbilityByName = async (name) => {
  const response = await axios.get(`${BASE_URL}/ability/${name}`);
  return response.data;
};

// Add similar functions for the other endpoints
// ...

export {
  getBerryByName,
  getAbilityByName,
  // Export other functions as needed
};
