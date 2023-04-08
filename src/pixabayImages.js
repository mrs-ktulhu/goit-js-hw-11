export default pixabayImage;

import axios from 'axios';

async function pixabayImage(param, page) {
  const PIXA_URL = `https://pixabay.com/api/?key=34212854-f6457ae4e5e1013dd0f507693&q=${param}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  const { data } = await axios.get(PIXA_URL);

  return data;
}
