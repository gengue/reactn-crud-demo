import React from 'react';
import { Link } from 'react-router-dom';
import { ListController } from './../../crud/ui';

function BookListList(props) {
  const columns = [
    {
      property: 'cover',
      render: record => {
        return (
          <Link to={`/books/${record.id}/show`}>
            <img src={record.cover} style={{ height: '50px' }} alt="Cover" />
          </Link>
        );
      },
    },
    {
      property: 'title',
      header: 'Title',
      primary: true,
      render: record => (
        <Link to={`/books/${record.id}/show`}>{record.title}</Link>
      ),
    },
  ];
  return <ListController {...props} columns={columns} resource="books" />;
}

export default BookListList;
