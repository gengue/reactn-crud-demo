import UserForm from './UserForm';
import UserList from './UserList';
import UserShow from './UserShow';
import { crud } from './../../crud';

const config = {
  basePath: '/',
  //hasDelete: false,
  components: {
    List: UserList,
    Create: UserForm,
    Edit: UserForm,
    Show: UserShow,
  },
};
const { routes } = crud('users', config);

export default {
  routes,
  list: UserList,
  create: UserForm,
  edit: UserForm,
  show: UserShow,
};
