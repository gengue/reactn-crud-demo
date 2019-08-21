import React from 'react';
import { ShowController } from './../../crud/ui';

function BookShow(props) {
  const fields = [
    {
      dataIndex: 'cover',
      render: record => {
        return (
          <img
            src={record.cover}
            style={{ borderRadius: '50%', height: '90px' }}
            alt="Cover"
          />
        );
      },
    },
    {
      dataIndex: 'title',
      title: 'Title',
    },
  ];
  return <ShowController {...props} fields={fields} resource="books" />;
}
export default BookShow;
