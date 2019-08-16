import React from 'react';
import { ShowController } from './../../crud/ui';

function BookShow(props) {
  const fields = [
    {
      property: 'cover',
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
      property: 'title',
      label: 'Title',
    },
  ];
  return <ShowController {...props} fields={fields} resource="books" />;
}
export default BookShow;
