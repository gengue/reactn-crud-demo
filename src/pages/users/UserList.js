import React from 'react';
import { Link } from 'react-router-dom';
import { ListController } from './../../crud/ui';

function UserList(props) {
  const columns = [
    {
      property: 'avatar',
      render: record => {
        return (
          <Link to={`/users/${record.id}/show`}>
            <img
              src={record.avatar}
              style={{ borderRadius: '50%', height: '50px' }}
              alt="Avatar"
            />
          </Link>
        );
      },
    },
    {
      property: 'email',
      header: 'Email',
      primary: true,
      render: record => (
        <Link to={`/users/${record.id}/show`}>{record.email}</Link>
      ),
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
