import React from 'react';
import { Input } from 'antd';
import { ListController } from './../../crud/ui';
import SelectPickerFetch from './../../components/SelectPickerFetch';

function UserList(props) {
  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      primary: true,
      render: (text, record, index) => {
        return (
          <img
            src={record.avatar}
            style={{ borderRadius: '50%', height: '50px' }}
            alt="Avatar"
          />
        );
      },
      width: 80,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      primary: true,
      width: 230,
      sorter: true,
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      sorter: true,
      width: 230,
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      sorter: true,
      width: 230,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      sorter: true,
      width: 180,
    },
  ];
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
    />
  );
}
export default UserList;
