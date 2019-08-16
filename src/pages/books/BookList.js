import React from 'react';
import { ListController } from './../../crud/ui';

function BookListList(props) {
  const columns = [
    {
      property: 'cover',
      primary: true,
      render: record => {
        return (
          <img src={record.cover} style={{ height: '50px' }} alt="Cover" />
        );
      },
    },
    {
      property: 'title',
      header: 'Title',
      primary: true,
    },
  ];
  return <ListController {...props} columns={columns} resource="books" />;
}

export default BookListList;
