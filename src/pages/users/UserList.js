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
      uiProps: {
        width: 80,
      },
    },
    {
      property: 'email',
      header: 'Email',
      primary: true,
      uiProps: {
        resizable: true,
        sortable: true,
        width: 250,
        verticalAlign: 'middle',
      },
    },
    {
      property: 'first_name',
      header: 'First Name',
      uiProps: {
        resizable: true,
        sortable: true,
        width: 250,
        verticalAlign: 'middle',
      },
    },
    {
      property: 'last_name',
      header: 'Last Name',
      uiProps: {
        resizable: true,
        sortable: true,
        width: 250,
        verticalAlign: 'middle',
      },
    },
  ];
  const tableProps = {
    wordWrap: true,
  };
  return (
    <ListController
      {...props}
      columns={columns}
      resource="users"
      listProps={tableProps}
    />
  );
}
export default UserList;
