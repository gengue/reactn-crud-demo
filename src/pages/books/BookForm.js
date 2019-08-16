import React from 'react';
import { TextInput } from 'grommet/components';
import { FormController } from './../../crud/ui';

function BookForm(props) {
  return (
    <FormController {...props} resource="books">
      <TextInput name="title" placeholder="Title" required />
      <TextInput name="cover" placeholder="Cover image URL" />
    </FormController>
  );
}

export default BookForm;
