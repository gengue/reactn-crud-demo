import React, { Fragment, useEffect, useState, useMemo, memo } from 'react';
import get from 'lodash/get';
import { withGlobal } from 'reactn';
import { useDebounce } from 'use-debounce';
import { Link } from 'react-router-dom';
import { APP_KEY } from './../constants';
import Pagination from './components/Pagination';
import Filters from './components/Filters';
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
  Alert,
} from 'rsuite';
import { Popover, Popconfirm, Checkbox } from 'antd';
const { Column, HeaderCell, Cell } = Table;

// table props by default
const defaultListProps = {
  wordWrap: true,
  autoHeight: true,
};
const buttonMarginStyle = { marginLeft: '8px' };

// initialize colums on true
function defaultColDisplay(columns) {
  return columns.reduce((a, i) => ({ [i.property]: true, ...a }), {});
}

const ListController = function(props) {
  const {
    resource,
    columns,
    filters,
    data,
    loading,
    fetching,
    saving,
    crudHandler,
    listProps,
  } = props;
  const { basePath } = data.props;

  const [sort, setSort] = useState(null);
  const [rawSearch, setSearch] = useState(null);
  const [searchText] = useDebounce(rawSearch, 350);
  const [showFilters, setShowFilters] = useState(false);
  const [displayedColumns, setDisplayedColumns] = useState(
    defaultColDisplay(columns)
  );
  const activeFilters = useMemo(
    () => {
      return Object.keys(data.list.params.filter).filter(
        key => data.list.params.filter[key] !== null
      );
    },
    [data.list.params.filter]
  );
  const hasFilters = activeFilters.length > 0;

  // init
  useEffect(
    () => {
      crudHandler.fetchList(data.list.params);
      document.title = resource;
    },
    [data.list.params, crudHandler, resource]
  );

  // on sort column
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

  // on search
  useEffect(
    () => {
      if (searchText !== null) {
        crudHandler.filter({ search: searchText }, { resource });
      }
    },
    [searchText, crudHandler, resource]
  );

  // collect table data mapping `ids` and `data`
  const dataset = useMemo(
    () => {
      if (!data) return [];
      return data.list.ids.map(i => data.data[i]);
    },
    [data]
  );

  // get table columns, merge definitions and append actions (edit, delete)
  const fields = useMemo(
    () => getColumns(columns, displayedColumns, data.props, crudHandler),
    [columns, displayedColumns, data.props, crudHandler]
  );

  // get/merge props for `Table` component
  const tableProps = useMemo(
    () => ({
      ...defaultListProps,
      ...listProps,
    }),
    [listProps]
  );

  /**
   * handler methods
   */
  const handleColumnDisplay = (e, column) => {
    setDisplayedColumns({ ...displayedColumns, [column]: e.target.checked });
  };
  const handleSortColumn = (sortColumn, sortType) => {
    setSort({ sortColumn, sortType });
  };
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };
  const handleSearch = value => setSearch(value);

  // get a checkbox components list with all fields
  const fieldList = columns.map((field, idx) => (
    <div key={field.property}>
      <Checkbox
        checked={displayedColumns[field.property]}
        onChange={e => handleColumnDisplay(e, field.property)}
      >
        {field.header || field.property}
      </Checkbox>
    </div>
  ));

  return (
    <Fragment>
      <Header>
        <h2>List {resource}</h2>
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
              {filters && (
                <IconButton
                  icon={
                    showFilters ? (
                      <Icon icon="close-circle" />
                    ) : (
                      <Icon icon="filter" />
                    )
                  }
                  onClick={handleToggleFilters}
                >
                  {showFilters ? 'Hide Filters' : 'Filters'}
                  {hasFilters && (
                    <b>
                      &nbsp;(
                      {activeFilters.length})
                    </b>
                  )}
                </IconButton>
              )}
              <Popover
                content={fieldList}
                title="Columns to display"
                trigger="click"
              >
                <IconButton
                  style={buttonMarginStyle}
                  icon={<Icon icon="columns" />}
                >
                  Columns
                </IconButton>
              </Popover>
              <Link
                to={resolveRedirect('create', basePath)}
                style={buttonMarginStyle}
              >
                <IconButton
                  appearance="primary"
                  icon={<Icon icon="plus" />}
                  onClick={() => console.log('filters')}
                >
                  New
                </IconButton>
              </Link>
            </Col>
          </Row>
          {filters && (
            <Filters
              open={showFilters}
              resource={resource}
              fields={filters}
              crudHandler={crudHandler}
            />
          )}
          <Row>
            <Table
              data={dataset}
              loading={loading || fetching || saving}
              sortColumn={sort ? sort.sortColumn : undefined}
              sortType={sort ? sort.sortType : undefined}
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

function getColumns(columns, displayedColumns, config, crudHandler) {
  const { basePath, hasEdit, hasDelete } = config;

  function deleteSideEffect({ success, error }) {
    if (success) {
      Alert.success('Resource deleted successfully');
    } else {
      Alert.error(error);
    }
  }

  const handleDelete = id => crudHandler.delete(id, deleteSideEffect);

  return [
    ...columns.filter(f => displayedColumns[f.property]).map((field, idx) => {
      const customRender = field.render;
      // wrap into a Link
      if (field.primary && !field.touched) {
        field.render = record => (
          <Link to={resolveRedirect('show', basePath, record.id)}>
            {customRender ? customRender(record) : get(record, field.property)}
          </Link>
        );
        // to avoid nested links (recursive renders)
        field.touched = true;
      }
      // return original definition
      return field;
    }),
    {
      property: '_table_actions',
      header: 'Actions',
      render: record => {
        return (
          <div>
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
              <ConfirmDelete onConfirm={() => handleDelete(record.id)}>
                <IconButton
                  style={{ marginLeft: '5px' }}
                  appearance="ghost"
                  color="red"
                  size="sm"
                  icon={<Icon icon="trash2" />}
                />
              </ConfirmDelete>
            )}
          </div>
        );
      },
      uiProps: {
        minWidth: 80,
        flexGrow: 1,
        verticalAlign: 'middle',
        align: 'right',
        fixed: columns.length >= 5 ? 'right' : undefined,
      },
    },
  ];
}

ListController.defaultProps = {
  listProps: defaultListProps,
};

const ConfirmDelete = ({ onConfirm, children }) => {
  return (
    <Popconfirm
      title="Are you sure that you want to delete the selected element?"
      onConfirm={onConfirm}
      okText="Yes, delete it"
    >
      {children}
    </Popconfirm>
  );
};

export default props => {
  const { resource } = props;

  const mapStateToProps = global => ({
    data: global[APP_KEY].resources[resource],
    fetching: global[APP_KEY].loading,
    loading:
      !global[APP_KEY].resources[resource].list.loadedOnce &&
      global[APP_KEY].loading,
    saving: global[APP_KEY].saving,
  });

  const Controller = withGlobal(mapStateToProps)(memo(ListController));
  return <Controller {...props} />;
};
