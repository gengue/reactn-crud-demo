import UserForm from './UserForm';
import UserList from './UserList';
import UserShow from './UserShow';

export { default as UserList } from './UserList';
export { default as UserShow } from './UserShow';
export { default as UserForm } from './UserForm';

export default {
  list: UserList,
  create: UserForm,
  edit: UserForm,
  show: UserShow,
};
