import React from 'react';
import { Input } from 'antd';
import { FormController } from './../../crud/ui';

function BookForm(props) {
  return (
    <FormController {...props} resource="books">
      <Input source="title" label="Title" required />
      <Input source="cover" label="Cover image URL" />
    </FormController>
  );
}

export default BookForm;
