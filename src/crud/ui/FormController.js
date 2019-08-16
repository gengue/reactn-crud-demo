import React, { memo, useState, useEffect } from 'react';
import { withGlobal } from 'reactn';
import { Link, withRouter } from 'react-router-dom';
import { APP_KEY } from './../constants';
import { Box, Button } from 'grommet/components';
import { resolveRedirect } from './utils';

function FormController({
  data,
  resource,
  match,
  history,
  crudHandler,
  children,
  redirectTo,
}) {
  const { basePath } = data.props;
  const [form, setForm] = useState({});
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitSideEffect = type => ({ success, record, error }) => {
    if (type === 'create' && success) {
      console.log('Sisas, creado todo bien');
      const url = resolveRedirect(redirectTo, basePath, record.id, record);
      history.push(url);
    }
    if (type === 'edit' && success) {
      console.log('Sisas, editado todo bien');
      const url = resolveRedirect(redirectTo, basePath, record.id, record);
      history.push(url);
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
        <Link to={resolveRedirect('list', basePath)}>
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
              value={form[child.props.name] || ''}
            />
          ))}
          <Button label="Save" type="submit" />
        </div>
      </Box>
    </form>
  );
}

FormController.defaultProps = {
  redirectTo: 'list',
};

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
