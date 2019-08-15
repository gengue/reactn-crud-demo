import React, { memo, useState, useEffect } from 'react';
import { withGlobal } from 'reactn';
import { Link, withRouter } from 'react-router-dom';
import { APP_KEY } from './../constants';
import { Box, Button } from 'grommet/components';

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

function FormController({
  data,
  resource,
  match,
  history,
  crudHandler,
  children,
}) {
  const { basePath } = data.props;
  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    avatar: '',
  });
  const { resourceId } = match.params;
  const isEdit = resourceId !== undefined;

  // find user
  const user = isEdit ? data.data[resourceId] : null;

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
    console.log('sisas niño', e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitSideEffect = type => ({ success, error }) => {
    if (type === 'create' && success) {
      console.log('Sisas, creado todo bien');
      history.push(`${basePath}${resource}`);
    }
    if (type === 'edit' && success) {
      console.log('Sisas, editado todo bien');
      history.push(`${basePath}${resource}`);
    }
    if (!success) {
      console.log('Ocurrio cule error hp', error);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    try {
      if (isEdit) {
        crudHandler.update(resourceId, form, submitSideEffect('edit'));
      } else {
        crudHandler.create(form, submitSideEffect('create'));
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
        <Link to={`${basePath}${resource}`}>
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
          {React.Children.map(children, child => (
            <child.type
              {...child.props}
              onChange={handleChange}
              value={form[child.props.name]}
            />
          ))}
          <Button label="Save" type="submit" />
        </div>
      </Box>
    </form>
  );
}

export default props => {
  const { resource } = props;

  const mapStateToProps = global => ({
    data: global[APP_KEY].resources[resource],
    saving: !global[APP_KEY].saving,
    loading:
      !global[APP_KEY].resources[resource].list.loadedOnce &&
      global[APP_KEY].loading,
  });

  const Controller = withGlobal(mapStateToProps)(
    memo(withRouter(FormController))
  );
  return <Controller {...props} />;
};
