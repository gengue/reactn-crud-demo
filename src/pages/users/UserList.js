import React from 'react';
import { ListController } from './../../crud/ui';

function UserList(props) {
  const columns = [
    {
      property: 'avatar',
      primary: true,
      render: record => {
        return (
          <img
            src={record.avatar}
            style={{ borderRadius: '50%', height: '50px' }}
            alt="Avatar"
          />
        );
      },
    },
    {
      property: 'email',
      header: 'Email',
      primary: true,
    },
    {
      property: 'first_name',
      header: 'First Name',
    },
    {
      property: 'last_name',
      header: 'Last Name',
    },
  ];
  return <ListController {...props} columns={columns} resource="users" />;
}
export default UserList;
