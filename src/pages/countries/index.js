import CountryList from './CountryList';
import { crud } from './../../crud';

const config = {
  basePath: '/',
  hasDelete: false,
  components: {
    List: CountryList,
  },
};
const { routes } = crud('countries', config);

export default {
  routes,
  list: CountryList,
};
