import React, { useState, useEffect } from 'react';
import { withGlobal } from 'reactn';
import { Link, withRouter } from 'react-router-dom';
import { Box, Button, TextInput } from 'grommet/components';
import Users from './data';

function UserForm({ users, match, history }) {
  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    avatar: '',
  });
  const { userId } = match.params;
  const isEdit = userId !== undefined;

  // find user
  const user = isEdit ? users.data[userId] : null;

  useEffect(
    () => {
      if (isEdit && !user) {
        Users.fetchOne(userId);
      }
      if (user) {
        setForm(user);
      }
    },
    [user, userId, isEdit]
  );

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    try {
      if (isEdit) {
        Users.update(userId, form);
      } else {
        Users.create(form);
      }
      //history.push(`/`);
      //setTimeout(() => {
      //history.push(`/`);
      //}, 3000);
    } catch (e) {
      console.log('hubo un jodido error');
      console.log(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        direction="row"
        border={{ color: 'brand', size: 'small', style: 'dashed' }}
        pad="medium"
        margin="medium"
        justify="between"
      >
        <Link to="/">
          <Button label="Back" />
        </Link>
        <Button label="Save" onClick={() => console.log('save')} />
      </Box>
      <Box
        direction="row"
        border={{ color: 'brand', size: 'medium', style: 'dashed' }}
        pad="medium"
        margin="medium"
      >
        <div>
          <TextInput
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextInput
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
          <TextInput
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            required
          />
          <TextInput
            name="avatar"
            placeholder="Avatar URL"
            value={form.avatar}
            onChange={handleChange}
          />
          <Button label="Save" type="submit" />
        </div>
      </Box>
    </form>
  );
}

const mapStateToProps = global => ({
  users: global.vadmin.resources.users,
});

export default withGlobal(mapStateToProps)(withRouter(UserForm));
