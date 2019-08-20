import React from 'react';
import { ListController } from './../../crud/ui';
import { Input } from 'rsuite';
import SelectPickerFetch from './../../components/SelectPickerFetch';

function UserList(props) {
  const columns = [
    {
      property: 'avatar',
      header: 'Avatar',
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
        width: 230,
        verticalAlign: 'middle',
      },
    },
    {
      property: 'first_name',
      header: 'First Name',
      uiProps: {
        resizable: true,
        sortable: true,
        width: 230,
        verticalAlign: 'middle',
      },
    },
    {
      property: 'last_name',
      header: 'Last Name',
      uiProps: {
        resizable: true,
        sortable: true,
        width: 230,
        verticalAlign: 'middle',
      },
    },
    {
      property: 'country',
      header: 'Country',
      uiProps: {
        resizable: true,
        sortable: true,
        width: 180,
        verticalAlign: 'middle',
      },
    },
  ];
  const tableProps = {
    wordWrap: true,
  };
  const filters = [
    <SelectPickerFetch
      source="country"
      resource="countries"
      placeholder="Country"
      labelKey="name"
      valueKey="id"
    />,
    <Input placeholder="Other" source="other" />,
  ];
  return (
    <ListController
      {...props}
      resource="users"
      columns={columns}
      filters={filters}
      listProps={tableProps}
    />
  );
}
export default UserList;
