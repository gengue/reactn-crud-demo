import React, { Fragment, useEffect, useState, useMemo, memo } from 'react';
import get from 'lodash/get';
import { withGlobal } from 'reactn';
import { useDebounce } from 'use-debounce';
import { Link } from 'react-router-dom';
import { APP_KEY } from './../constants';
import Pagination from './components/Pagination';
import { resolveRedirect } from './utils';
import {
  InputGroup,
  Input,
  IconButton,
  Table,
  Grid,
  Row,
  Col,
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
  const [rawSearch, setSearch] = useState(null);
  const [searchText] = useDebounce(rawSearch, 350);

  useEffect(
    () => {
      crudHandler.fetchList(data.list.params);
    },
    [data.list.params, crudHandler]
  );

  useEffect(
    () => {
      if (sort !== null) {
        crudHandler.filter(
          { sort: sort.sortColumn, order: sort.sortType },
          { resource }
        );
      }
    },
    [sort, crudHandler, resource]
  );

  useEffect(
    () => {
      if (searchText !== null) {
        console.log('va a mandar esta caga', searchText);
        crudHandler.filter({ search: searchText }, { resource });
      }
    },
    [searchText, crudHandler, resource]
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

  const handleSearch = value => setSearch(value);

  return (
    <Fragment>
      <Header>
        <h2>List Controller</h2>
      </Header>
      <Content>
        <Grid fluid>
          <Row gutter={20} style={{ marginBottom: 10 }}>
            <Col md={10}>
              <InputGroup inside>
                <Input
                  placeholder="Please type your search..."
                  value={rawSearch || ''}
                  onChange={handleSearch}
                />
                <InputGroup.Button>
                  <Icon icon="search" />
                </InputGroup.Button>
              </InputGroup>
            </Col>
            <Col md={14} style={{ textAlign: 'right' }}>
              <IconButton
                style={{ marginRight: '8px' }}
                icon={<Icon icon="filter" />}
                onClick={() => console.log('filters')}
              >
                Filters
              </IconButton>
              <IconButton
                style={{ marginRight: '8px' }}
                icon={<Icon icon="columns" />}
                onClick={() => console.log('columns settings')}
              >
                Columns
              </IconButton>
              <Link to={resolveRedirect('create', basePath)}>
                <IconButton
                  appearance="primary"
                  style={{ marginRight: '8px' }}
                  icon={<Icon icon="plus" />}
                  onClick={() => console.log('filters')}
                >
                  New
                </IconButton>
              </Link>
            </Col>
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
      header: 'Actions',
      render: record => {
        return (
          <Fragment>
            {hasEdit && (
              <Link to={resolveRedirect('edit', basePath, record.id, record)}>
                <IconButton
                  size="sm"
                  appearance="ghost"
                  icon={<Icon icon="edit2" />}
                />
              </Link>
            )}
            {hasDelete && (
              <IconButton
                style={{ marginLeft: '5px' }}
                appearance="ghost"
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
        fixed: columns.length > 5 ? 'right' : undefined,
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
