import React, { Fragment, memo, useState, useEffect } from 'react';
import { withGlobal } from 'reactn';
import { Link, withRouter } from 'react-router-dom';
import { APP_KEY } from './../constants';
import { resolveRedirect } from './utils';
import {
  ButtonToolbar,
  Header,
  Content,
  Button,
  Form,
  FormGroup,
  ControlLabel,
  HelpBlock,
  Alert,
} from 'rsuite';

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

  const handleChange = (rawValue, name) => {
    let value = rawValue;
    if (rawValue && rawValue.target) {
      value = rawValue.target.value;
    }
    setForm({ ...form, [name]: value });
  };

  const submitSideEffect = type => ({ success, record, error }) => {
    if (type === 'create' && success) {
      Alert.success('Created successfully');
      const url = resolveRedirect(redirectTo, basePath, record.id, record);
      history.push(url);
    }
    if (type === 'edit' && success) {
      Alert.success('Updated successfully');
      const url = resolveRedirect(redirectTo, basePath, record.id, record);
      history.push(url);
    }
    if (!success) {
      Alert.error(error);
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
      Alert.error(e.toString());
    }
  };

  return (
    <Fragment>
      <Header>
        <h2>
          {isEdit ? 'Edit' : 'New'}
          &nbsp; {resource}
        </h2>
      </Header>
      <Content>
        <Form onSubmit={handleSubmit} layout="horizontal">
          <div>
            {React.Children.map(children, child => (
              <FormGroup>
                <ControlLabel>{child.props.label}</ControlLabel>
                <child.type
                  {...child.props}
                  onChange={e => handleChange(e, child.props.source)}
                  value={form[child.props.source] || ''}
                  style={{
                    minWidth: '300px',
                    width: 'auto',
                    ...child.props.style,
                  }}
                />
                {child.props.helptext && (
                  <HelpBlock tooltip>{child.props.helptext}</HelpBlock>
                )}
              </FormGroup>
            ))}
            <FormGroup>
              <ButtonToolbar>
                <Link to={resolveRedirect('list', basePath)}>
                  <Button appearance="ghost">Cancel</Button>
                </Link>
                <Button type="submit" appearance="primary">
                  Save{' '}
                </Button>
              </ButtonToolbar>
            </FormGroup>
          </div>
        </Form>
      </Content>
    </Fragment>
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
