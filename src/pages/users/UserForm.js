import React from 'react';
import { TextInput } from 'grommet/components';
import { FormController } from './../../crud/ui';

function UserForm(props) {
  return (
    <FormController {...props} resource="users">
      <TextInput name="email" placeholder="Email" type="email" required />
      <TextInput name="first_name" placeholder="First Name" required />
      <TextInput name="last_name" placeholder="Last Name" required />
      <TextInput name="avatar" placeholder="Avatar URL" />
    </FormController>
  );
}

export default UserForm;
