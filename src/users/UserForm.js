import React, { useState, useEffect } from 'react';
import { withGlobal } from 'reactn';
import { Link, withRouter } from 'react-router-dom';
import { Box, Button, TextInput } from 'grommet/components';
//import Users from './data';

const linkToRecord = (basePath, id, linkType = 'edit') => {
  const link = `${basePath}/${encodeURIComponent(id)}`;

  if (linkType === 'show') {
    return `${link}/show`;
  }

  return link;
};

const resolveRedirect = (redirectTo, basePath, id, data) => {
  if (typeof redirectTo === 'function') {
    return redirectTo(basePath, id, data);
  }
  switch (redirectTo) {
    case 'list':
      return basePath;
    case 'create':
      return `${basePath}/create`;
    case 'edit':
      return linkToRecord(basePath, id);
    case 'show':
      return `${linkToRecord(basePath, id)}/show`;
    default:
      return redirectTo;
  }
};

function UserForm({ users, match, history, crudHandler }) {
  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    avatar: '',
  });
  const { resourceId } = match.params;
  const isEdit = resourceId !== undefined;

  // find user
  const user = isEdit ? users.data[resourceId] : null;

  useEffect(
    () => {
      if (isEdit && !user) {
        crudHandler.fetchOne(resourceId);
      }
      if (user) {
        setForm(user);
      }
    },
    [user, resourceId, isEdit, crudHandler]
  );

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitSideEffect = type => ({ success, error }) => {
    if (type === 'create' && success) {
      history.push(`/`);
      console.log('Sisas, creado todo bien');
    }
    if (type === 'edit' && success) {
      history.push(`/`);
      console.log('Sisas, editado todo bien');
    }
    if (!success) {
      console.log('Ocurrio cule error hp', error);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    try {
      if (isEdit) {
        crudHandler.update(resourceId, form, null, submitSideEffect('edit'));
      } else {
        crudHandler.create(form, null, submitSideEffect('create'));
      }
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
        <Button label="Save" type="submit" />
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
