import React from 'react';
import { Link } from 'react-router-dom';
import { ShowController } from './../../crud/ui';

function UserShow(props) {
  const fields = [
    {
      property: 'avatar',
      render: record => {
        return (
          <Link to={`/users/${record.id}/show`}>
            <img
              src={record.avatar}
              style={{ borderRadius: '50%', height: '90px' }}
              alt="Avatar"
            />
          </Link>
        );
      },
    },
    {
      property: 'email',
      label: 'Email',
    },
    {
      property: 'name',
      label: 'Full name',
      render: record => `${record.first_name} ${record.last_name}`,
    },
    {
      property: 'country',
      label: 'Country',
    },
    {
      property: 'created_at',
      label: 'Joined',
    },
  ];
  return <ShowController {...props} fields={fields} resource="users" />;
}
export default UserShow;
