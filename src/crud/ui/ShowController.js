import React, { memo, Fragment, useEffect } from 'react';
import get from 'lodash/get';
import { withGlobal } from 'reactn';
import { Link, withRouter } from 'react-router-dom';
import { List, Typography, Button } from 'antd';
import { APP_KEY } from './../constants';
import { resolveRedirect } from './utils';

function ShowController({ data, loading, fields, match, crudHandler }) {
  const { resourceId } = match.params;
  const { basePath } = data.props;
  const record = data.data[resourceId];

  useEffect(
    () => {
      crudHandler.fetchOne(resourceId);
      //if (!record) {
      //crudHandler.fetchOne(resourceId);
      //}
    },
    [resourceId, crudHandler]
  );

  if (!record && loading) return 'Loading...';
  if (!record) return null;

  return (
    <Fragment>
      <h2 className="MainLayout-header">Details</h2>
      <section className="MainLayout-content">
        <List
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link to={resolveRedirect('list', basePath)}>
                <Button ghost type="primary" icon="left">
                  Back
                </Button>
              </Link>
              <Link to={resolveRedirect('edit', basePath, record.id)}>
                <Button type="primary" icon="edit">
                  Edit
                </Button>
              </Link>
            </div>
          }
          bordered={false}
          dataSource={fields}
          renderItem={item => {
            const content = item.render
              ? item.render(record)
              : get(record, item.dataIndex);
            return (
              <List.Item>
                <Typography.Text strong>
                  {item.title ? item.title + ':' : null}{' '}
                </Typography.Text>{' '}
                {content}
              </List.Item>
            );
          }}
        />
      </section>
    </Fragment>
  );
}

export default props => {
  const { resource } = props;

  const mapStateToProps = global => ({
    data: global[APP_KEY].resources[resource],
    loading: global[APP_KEY].loading,
  });

  const Controller = withGlobal(mapStateToProps)(
    withRouter(memo(ShowController))
  );
  return <Controller {...props} />;
};
