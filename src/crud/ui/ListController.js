import React, { Fragment, useEffect, useState, useMemo, memo } from 'react';
import { withGlobal } from 'reactn';
import { useDebounce } from 'use-debounce';
import { Link } from 'react-router-dom';
import { APP_KEY } from './../constants';
import Filters from './components/Filters';
import { resolveRedirect } from './utils';
import {
  Button,
  message,
  Input,
  Row,
  Col,
  Popover,
  Popconfirm,
  Checkbox,
  Table,
} from 'antd';

// table props by default
const buttonMarginStyle = { marginLeft: '8px' };

// initialize colums on true
function defaultColDisplay(columns) {
  return columns.reduce((a, i) => ({ [i.dataIndex]: true, ...a }), {});
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

  // get pagination data from global state
  const pagination = useMemo(
    () => {
      const { total, params } = data.list;
      const { page, perPage } = params;
      return {
        current: page,
        pageSize: perPage,
        total,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20'],
      };
    },
    [data.list]
  );

  // get active filters from global state
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
        const order = sort.sortOrder === 'descend' ? 'DESC' : 'ASC';
        crudHandler.filter({ sort: sort.sortField, order }, { resource });
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

  /**
   * handler methods
   */
  const handleColumnDisplay = (e, column) => {
    setDisplayedColumns({ ...displayedColumns, [column]: e.target.checked });
  };
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };
  const handleSearch = e => setSearch(e.target.value);
  const handleTableChange = (pagger, filters, sorter) => {
    if (pagger && pagger.current) {
      crudHandler.filter(
        { page: pagger.current, perPage: pagger.pageSize },
        { resource }
      );
    }
    if (sorter && sorter.field) {
      setSort({ sortField: sorter.field, sortOrder: sorter.order });
    }
  };

  // get a checkbox components list with all fields
  const fieldList = columns.map((field, idx) => (
    <div key={field.dataIndex}>
      <Checkbox
        checked={displayedColumns[field.dataIndex]}
        onChange={e => handleColumnDisplay(e, field.dataIndex)}
      >
        {field.title || field.dataIndex}
      </Checkbox>
    </div>
  ));

  return (
    <Fragment>
      <h2 className="MainLayout-header">List {resource}</h2>
      <section className="MainLayout-content">
        <Row gutter={16}>
          <Col span={24} style={{ marginBottom: '18px' }}>
            <Col md={10}>
              <Input.Search
                placeholder="Please type your search..."
                value={rawSearch || ''}
                onChange={handleSearch}
              />
            </Col>
            <Col md={14} style={{ textAlign: 'right' }}>
              {filters && (
                <Button
                  icon={showFilters ? 'close-circle' : 'filter'}
                  onClick={handleToggleFilters}
                >
                  {showFilters ? 'Hide Filters' : 'Filters'}
                  {hasFilters && (
                    <b>
                      &nbsp;(
                      {activeFilters.length})
                    </b>
                  )}
                </Button>
              )}
              <Popover
                content={fieldList}
                title="Columns to display"
                trigger="click"
              >
                <Button style={buttonMarginStyle} icon="unordered-list">
                  Columns
                </Button>
              </Popover>
              <Link
                to={resolveRedirect('create', basePath)}
                style={buttonMarginStyle}
              >
                <Button type="primary" icon="plus">
                  New
                </Button>
              </Link>
            </Col>
          </Col>
          {filters && (
            <Filters
              open={showFilters}
              resource={resource}
              fields={filters}
              crudHandler={crudHandler}
            />
          )}
          <Col span={24}>
            <Table
              columns={fields}
              rowKey="id"
              dataSource={dataset}
              pagination={pagination}
              loading={loading || fetching || saving}
              onChange={handleTableChange}
              {...listProps}
            />
          </Col>
        </Row>
      </section>
    </Fragment>
  );
};

function getColumns(columns, displayedColumns, config, crudHandler) {
  const { basePath, hasEdit, hasDelete } = config;

  function deleteSideEffect({ success, error }) {
    if (success) {
      message.success('Resource deleted successfully');
    } else {
      message.error(error);
    }
  }

  const handleDelete = id => crudHandler.delete(id, deleteSideEffect);

  return [
    ...columns.filter(f => displayedColumns[f.dataIndex]).map((field, idx) => {
      const customRender = field.render;
      // wrap into a Link
      if (field.primary && !field.touched) {
        field.render = (text, record, index) => {
          return (
            <Link
              to={resolveRedirect('show', basePath, record.id)}
              key={record.id}
            >
              {customRender ? customRender(text, record, index) : text}
            </Link>
          );
        };
        // to avoid nested links (recursive renders)
        field.touched = true;
      }
      // return original definition
      return field;
    }),
    {
      title: 'Actions',
      dataIndex: '_table_actions',
      render: (text, record, index) => {
        return (
          <div>
            {hasEdit && (
              <Link to={resolveRedirect('edit', basePath, record.id, record)}>
                <Button size="small" type="primary" icon="edit" ghost />
              </Link>
            )}
            {hasDelete && (
              <ConfirmDelete onConfirm={() => handleDelete(record.id)}>
                <Button
                  style={{ marginLeft: '5px' }}
                  type="danger"
                  size="small"
                  icon="delete"
                  ghost
                />
              </ConfirmDelete>
            )}
          </div>
        );
      },
      fixed: columns.length > 6,
      align: 'right',
      width: 110,
    },
  ];
}

ListController.defaultProps = {};

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
