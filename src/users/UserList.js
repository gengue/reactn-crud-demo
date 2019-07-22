import React, { Fragment, useEffect } from 'react';
import { useGlobal } from 'reactn';
import { Link } from 'react-router-dom';
import { Box, Button, DataTable } from 'grommet/components';
import Users from './data';

function UserList(props) {
  const [users] = useGlobal('users');

  useEffect(() => {
    Users.fetchList();
  }, []);

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
          data={users ? users.records : []}
        />
      </Box>
    </Fragment>
  );
}

export default UserList;
