import BookForm from './BookForm';
import BookList from './BookList';
import BookShow from './BookShow';
import crud from './../../crud';

const config = {
  props: {
    basePath: '/',
  },
  components: {
    List: BookList,
    Create: BookForm,
    Edit: BookForm,
    Show: BookShow,
  },
};
const { routes } = crud('books', config);

export default {
  routes,
  list: BookList,
  create: BookForm,
  edit: BookForm,
  show: BookShow,
};
