import React, { Fragment, useEffect, useMemo } from 'react';
import { withGlobal } from 'reactn';
import { Link } from 'react-router-dom';
import { Box, Button, DataTable } from 'grommet/components';
import Users from './data';

function UserList(props) {
  const { users, loading } = props;

  useEffect(() => {
    Users.fetchList();
  }, []);

  const dataset = useMemo(
    () => {
      if (!users) return [];
      return users.list.ids.map(i => users.data[i]);
    },
    [users]
  );

  return (
    <Fragment>
      <Box
        direction="row"
        border={{ color: 'brand', size: 'small', style: 'dashed' }}
        pad="medium"
        margin="medium"
        justify="end"
      >
        <Link to="/users/create">
          <Button label="Create" />
        </Link>
      </Box>
      <Box
        direction="row"
        border={{ color: 'brand', size: 'medium', style: 'dashed' }}
        pad="medium"
        margin="medium"
      >
        {loading && <h3>Loading...</h3>}
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
                return <Link to={`/users/${record.id}/edit`}>Edit</Link>;
              },
            },
          ]}
          data={dataset}
        />
      </Box>
    </Fragment>
  );
}

const mapStateToProps = global => ({
  users: global.vadmin.resources.users,
  loading:
    !global.vadmin.resources.users.list.loadedOnce && global.vadmin.loading,
});

export default withGlobal(mapStateToProps)(UserList);
