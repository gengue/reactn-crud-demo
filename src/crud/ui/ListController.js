import React, { Fragment, useEffect, useState, useMemo, memo } from 'react';
import get from 'lodash/get';
import { withGlobal } from 'reactn';
import { Link } from 'react-router-dom';
import { APP_KEY } from './../constants';
import Pagination from './components/Pagination';
import { resolveRedirect } from './utils';
import {
  IconButton,
  Table,
  Grid,
  Row,
  Button,
  Icon,
  Header,
  Content,
} from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const defaultListProps = {
  wordWrap: true,
  autoHeight: true,
};

const ListController = function(props) {
  const {
    columns,
    data,
    resource,
    loading,
    fetching,
    crudHandler,
    listProps,
  } = props;
  const { basePath } = data.props;

  const [sort, setSort] = useState({});

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

  const fields = useMemo(() => getColumns(columns, data.props, crudHandler), [
    columns,
    data.props,
    crudHandler,
  ]);

  const tableProps = useMemo(
    () => ({
      ...defaultListProps,
      ...listProps,
    }),
    [listProps]
  );

  const handleSortColumn = (sortColumn, sortType) => {
    setSort({ sortColumn, sortType });
    console.log('handleSortColumn', sortColumn, sortType);
  };

  return (
    <Fragment>
      <Header>
        <h2>List Controller</h2>
      </Header>
      <Content>
        <Grid fluid>
          <Row style={{ textAlign: 'right' }}>
            <Link to={resolveRedirect('create', basePath)}>
              <Button appearance="primary">Create</Button>
            </Link>
          </Row>
          <Row>
            <Table
              data={dataset}
              loading={loading || fetching}
              sortColumn={sort.sortColumn}
              sortType={sort.sortType}
              onSortColumn={handleSortColumn}
              {...tableProps}
            >
              {fields.map((field, idx) => {
                const uiProps = get(field, 'uiProps', {});
                return (
                  <Column {...uiProps} key={field.property || idx}>
                    <HeaderCell>{field.header}</HeaderCell>
                    {field.render ? (
                      <Cell dataKey={field.property}>
                        {rowData => field.render(rowData)}
                      </Cell>
                    ) : (
                      <Cell dataKey={field.property} />
                    )}
                  </Column>
                );
              })}
            </Table>
            <Pagination
              resource={resource}
              perPage={5}
              crudHandler={crudHandler}
              list={data.list}
              loading={loading}
            />
          </Row>
        </Grid>
      </Content>
    </Fragment>
  );
};

function getColumns(columns, config, crudHandler) {
  const { basePath, hasEdit, hasDelete } = config;

  function deleteSideEffect({ success, error }) {
    if (success) {
      console.log('Sisas, eliminado todo bien');
    } else {
      console.log('Ocurrio cule error hp', error);
    }
  }

  const handleDelete = id => crudHandler.delete(id, deleteSideEffect);

  return [
    ...columns.map((field, idx) => {
      const customRender = field.render;
      // wrap into a Link
      if (field.primary) {
        field.render = record => (
          <Link to={resolveRedirect('show', basePath, record.id)}>
            {customRender ? customRender(record) : get(record, field.property)}
          </Link>
        );
      }
      // return original definition
      return field;
    }),
    {
      property: '',
      header: '',
      render: record => {
        return (
          <Fragment>
            {hasEdit && (
              <Link to={resolveRedirect('edit', basePath, record.id, record)}>
                <IconButton
                  color="cyan"
                  size="sm"
                  icon={<Icon icon="edit2" />}
                />
              </Link>
            )}
            {hasDelete && (
              <IconButton
                style={{ marginLeft: '5px' }}
                color="red"
                size="sm"
                icon={<Icon icon="trash2" />}
                onClick={() => handleDelete(record.id)}
              />
            )}
          </Fragment>
        );
      },
      uiProps: {
        flexGrow: 1,
        verticalAlign: 'middle',
        align: 'right',
        fixed: 'right',
      },
    },
  ];
}

ListController.defaultProps = {
  listProps: defaultListProps,
};

export default props => {
  const { resource } = props;

  const mapStateToProps = global => ({
    data: global[APP_KEY].resources[resource],
    fetching: global[APP_KEY].loading,
    loading:
      !global[APP_KEY].resources[resource].list.loadedOnce &&
      global[APP_KEY].loading,
  });

  const Controller = withGlobal(mapStateToProps)(memo(ListController));
  return <Controller {...props} />;
};
