import React, { Fragment, useEffect, useMemo, memo } from 'react';
import { withGlobal } from 'reactn';
import { Link } from 'react-router-dom';
import { APP_KEY } from './../constants';
import { Box, Button, DataTable } from 'grommet/components';
import Pagination from './components/Pagination';

const ListController = function(props) {
  const { columns, data, resource, loading, crudHandler } = props;
  const { basePath } = data.props;

  useEffect(
    () => {
      crudHandler.fetchList(data.list.params);
    },
    [data.list.params, crudHandler]
  );

  const dataset = useMemo(
    () => {
      if (!data) return [];
      return data.list.ids.map(i => data.data[i]);
    },
    [data]
  );

  const fields = getActionsColumns(columns, data.props, crudHandler);

  return (
    <Fragment>
      <Box
        direction="row"
        border={{ color: 'brand', size: 'small', style: 'dashed' }}
        pad="medium"
        margin="medium"
        justify="between"
        wrap
      >
        <Link to="/">
          <Button label="Back" />
        </Link>
        <Link to={`${basePath}${resource}/create`}>
          <Button label="Create" />
        </Link>
      </Box>

      <div>{loading && <h3>Loading...</h3>}</div>
      <Box
        direction="row"
        border={{ color: 'brand', size: 'medium', style: 'dashed' }}
        pad="medium"
        margin="medium"
      >
        <DataTable columns={fields} data={dataset} />
      </Box>
      <Box
        direction="row"
        border={{ color: 'brand', size: 'small', style: 'dashed' }}
        pad="medium"
        margin="medium"
      >
        <Pagination perPage={5} crudHandler={crudHandler} />
      </Box>
    </Fragment>
  );
};

const getActionsColumns = (columns, config, crudHandler) => {
  const { basePath, name: resource, hasEdit, hasDelete } = config;

  function deleteSideEffect({ success, error }) {
    if (success) {
      console.log('Sisas, eliminado todo bien');
    } else {
      console.log('Ocurrio cule error hp', error);
    }
  }

  const handleDelete = id => crudHandler.delete(id, deleteSideEffect);

  return [
    ...columns,
    {
      property: '',
      header: '',
      render: record => {
        return (
          <Fragment>
            {hasEdit && (
              <Link to={`${basePath}${resource}/${record.id}/edit`}>Edit</Link>
            )}
            {hasDelete && (
              <button onClick={() => handleDelete(record.id)}>Delete</button>
            )}
          </Fragment>
        );
      },
    },
  ];
};

export default props => {
  const { resource } = props;

  const mapStateToProps = global => ({
    data: global[APP_KEY].resources[resource],
    loading:
      !global[APP_KEY].resources[resource].list.loadedOnce &&
      global[APP_KEY].loading,
  });

  const Controller = withGlobal(mapStateToProps)(memo(ListController));
  return <Controller {...props} />;
};
