import React, { memo, Fragment, useEffect } from 'react';
import get from 'lodash/get';
import { withGlobal } from 'reactn';
import { Link, withRouter } from 'react-router-dom';
import { Box, Text } from 'grommet/components';
import { Button } from 'rsuite';
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
      <Box
        direction="row"
        border={{ color: 'brand', size: 'small', style: 'dashed' }}
        pad="medium"
        margin="medium"
        justify="between"
      >
        <Link to={resolveRedirect('list', basePath)}>
          <Button appearance="ghost">Back</Button>
        </Link>
        <Link to={resolveRedirect('edit', basePath, record.id)}>
          <Button appearance="primary">Edit</Button>
        </Link>
      </Box>
      <Box
        direction="column"
        border={{ color: 'brand', size: 'medium', style: 'dashed' }}
        pad="medium"
        margin="medium"
      >
        {fields.map((field, idx) => {
          const content = field.render
            ? field.render(record)
            : get(record, field.property);
          return (
            <div key={field.property || idx}>
              {field.label && (
                <Text weight="bold" margin={{ right: '10px' }}>
                  {field.label}:
                </Text>
              )}
              {content}
              <br />
            </div>
          );
        })}
      </Box>
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
