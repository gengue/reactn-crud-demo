import React, { useState, useEffect } from 'react';
import { withGlobal } from 'reactn';
import { Link, withRouter } from 'react-router-dom';
import { Box, Button, TextInput } from 'grommet/components';

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

function BookForm({ books, match, history, crudHandler }) {
  const [form, setForm] = useState({
    title: '',
    cover: '',
  });
  const { resourceId } = match.params;
  const isEdit = resourceId !== undefined;

  // find book
  const book = isEdit ? books.data[resourceId] : null;

  useEffect(
    () => {
      if (isEdit && !book) {
        crudHandler.fetchOne(resourceId);
      }
      if (book) {
        setForm(book);
      }
    },
    [book, resourceId, isEdit, crudHandler]
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
        <Link to="/users/">
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
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <TextInput
            name="cover"
            placeholder="Cover URL"
            value={form.cover}
            onChange={handleChange}
          />
          <Button label="Save" type="submit" />
        </div>
      </Box>
    </form>
  );
}

const mapStateToProps = global => ({
  books: global.vadmin.resources.books,
});

export default withGlobal(mapStateToProps)(withRouter(BookForm));
