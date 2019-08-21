import React, { Fragment, memo, useState, useEffect } from 'react';
import { withGlobal } from 'reactn';
import { Link, withRouter } from 'react-router-dom';
import { APP_KEY } from './../constants';
import { resolveRedirect } from './utils';
import { Form, Tooltip, Button, Icon, message } from 'antd';

const ButtonGroup = Button.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

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
      message.success('Created successfully');
      const url = resolveRedirect(redirectTo, basePath, record.id, record);
      history.push(url);
    }
    if (type === 'edit' && success) {
      message.success('Updated successfully');
      const url = resolveRedirect(redirectTo, basePath, record.id, record);
      history.push(url);
    }
    if (!success) {
      message.error(error);
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
      message.error(e.toString());
    }
  };

  return (
    <Fragment>
      <h2 className="MainLayout-header">
        {isEdit ? 'Edit' : 'New'}
        &nbsp; {resource}
      </h2>
      <section className="MainLayout-content">
        <Form onSubmit={handleSubmit} layout="horizontal" {...formItemLayout}>
          {React.Children.map(children, child => {
            let label = child.props.label;
            if (child.props.helptext) {
              label = (
                <span>
                  {child.props.label} &nbsp;
                  <Tooltip title={child.props.helptext}>
                    <Icon type="question-circle" />
                  </Tooltip>
                </span>
              );
            }
            return (
              <Form.Item label={label}>
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
              </Form.Item>
            );
          })}
          <Form.Item {...tailFormItemLayout}>
            <ButtonGroup>
              <Link to={resolveRedirect('list', basePath)}>
                <Button ghost type="primary">
                  Cancel
                </Button>
              </Link>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </ButtonGroup>
          </Form.Item>
        </Form>
      </section>
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
