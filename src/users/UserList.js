import React, { Fragment, useEffect, useMemo } from 'react';
import { withGlobal } from 'reactn';
import { Link } from 'react-router-dom';
import { Box, Button, DataTable } from 'grommet/components';
//import Users from './data';

function UserList(props) {
  const { users, loading, crudHandler } = props;

  useEffect(
    () => {
      crudHandler.fetchList(users.list.params);
    },
    [users.list.params, crudHandler]
  );

  const dataset = useMemo(
    () => {
      if (!users) return [];
      return users.list.ids.map(i => users.data[i]);
    },
    [users]
  );

  function deleteSideEffect({ success, error }) {
    if (success) {
      console.log('Sisas, eliminado todo bien');
    } else {
      console.log('Ocurrio cule error hp', error);
    }
  }
  const handleDelete = id => crudHandler.delete(id, deleteSideEffect);

  return (
    <Fragment>
      <Box
        direction="row"
        border={{ color: 'brand', size: 'small', style: 'dashed' }}
        pad="medium"
        margin="medium"
        justify="end"
        wrap
      >
        <Link to="/users/create">
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
        <DataTable
          columns={[
            {
              property: 'avatar',
              render: record => {
                return (
                  <Link to={`/users/${record.id}/show`}>
                    <img
                      src={record.avatar}
                      style={{ borderRadius: '50%', height: '50px' }}
                      alt="Avatar"
                    />
                  </Link>
                );
              },
            },
            {
              property: 'email',
              header: 'Email',
              primary: true,
              render: record => (
                <Link to={`/users/${record.id}/show`}>{record.email}</Link>
              ),
            },
            {
              property: 'first_name',
              header: 'First Name',
            },
            {
              property: 'last_name',
              header: 'Last Name',
            },
            {
              property: '',
              header: '',
              render: record => {
                return (
                  <Fragment>
                    <Link to={`/users/${record.id}/edit`}>Edit</Link>
                    <button onClick={() => handleDelete(record.id)}>
                      Delete
                    </button>
                  </Fragment>
                );
              },
            },
          ]}
          data={dataset}
        />
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
}

let Pagination = props => {
  const { crudHandler } = props;
  const { total } = props.list;
  const { page, perPage } = props.list.params;

  const handleClick = page => crudHandler.filter({ page });
  const handlePerPage = e => {
    crudHandler.filter({ perPage: parseInt(e.target.value, 10) });
  };

  const pgData = paginate(total, page, perPage);

  const getStyle = idx => ({
    background: page === idx ? '#7D4CDB' : 'white',
    pointerEvents: page === idx ? 'none' : 'auto',
    padding: '5px',
    marginRight: '2px',
    fontWeight: 'bold',
    border: '1px solid grey',
    cursor: 'pointer',
  });

  return (
    <div>
      {pgData.pages.map(i => (
        <span key={i} onClick={() => handleClick(i)} style={getStyle(i)}>
          {i}
        </span>
      ))}
      <select onChange={handlePerPage} value={perPage}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
    </div>
  );
};

Pagination = withGlobal(global => ({
  list: global.vadmin.resources.users.list,
  loading:
    !global.vadmin.resources.users.list.loadedOnce && global.vadmin.loading,
}))(Pagination);

function paginate(totalItems, currentPage = 1, pageSize = 10, maxPages = 10) {
  // calculate total pages
  let totalPages = Math.ceil(totalItems / pageSize);

  // ensure current page isn't out of range
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  let startPage, endPage;
  if (totalPages <= maxPages) {
    // total pages less than max so show all pages
    startPage = 1;
    endPage = totalPages;
  } else {
    // total pages more than max so calculate start and end pages
    let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
    let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
    if (currentPage <= maxPagesBeforeCurrentPage) {
      // current page near the start
      startPage = 1;
      endPage = maxPages;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      // current page near the end
      startPage = totalPages - maxPages + 1;
      endPage = totalPages;
    } else {
      // current page somewhere in the middle
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  // calculate start and end item indexes
  let startIndex = (currentPage - 1) * pageSize;
  let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

  // create an array of pages to ng-repeat in the pager control
  let pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
    i => startPage + i
  );

  // return object with all pager properties required by the view
  return {
    totalItems: totalItems,
    currentPage: currentPage,
    pageSize: pageSize,
    totalPages: totalPages,
    startPage: startPage,
    endPage: endPage,
    startIndex: startIndex,
    endIndex: endIndex,
    pages: pages,
  };
}

const mapStateToProps = global => ({
  users: global.vadmin.resources.users,
  loading:
    !global.vadmin.resources.users.list.loadedOnce && global.vadmin.loading,
});

export default withGlobal(mapStateToProps)(UserList);
