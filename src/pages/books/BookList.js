import React from 'react';
import { ListController } from './../../crud/ui';

function BookListList(props) {
  const columns = [
    {
      title: 'Cover',
      dataIndex: 'cover',
      primary: true,
      render: (text, record, index) => {
        return (
          <img src={record.cover} style={{ height: '50px' }} alt="Cover" />
        );
      },
      width: 30,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      primary: true,
    },
  ];
  return <ListController {...props} columns={columns} resource="books" />;
}

export default BookListList;
