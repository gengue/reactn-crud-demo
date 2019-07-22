import React, { Fragment, useEffect } from 'react';
import { useGlobal } from 'reactn';
import { Link, withRouter } from 'react-router-dom';
import { Box, Button, Text } from 'grommet/components';
import Users from './data';

function UserShow({ match }) {
  const [users] = useGlobal('users');
  const { userId } = match.params;
  const user =
    users && users.records
      ? users.records.find(u => u.id.toString() === userId)
      : null;

  useEffect(
    () => {
      if (!user) {
        Users.fetchOne(userId);
      }
    },
    [userId, user]
  );

  if (!user) return null;

  return (
    <Fragment>
      <Box
        direction="row"
        border={{ color: 'brand', size: 'small', style: 'dashed' }}
        pad="medium"
        margin="medium"
        justify="between"
      >
        <Link to="/">
          <Button label="Back" />
        </Link>
        <Link to={`/users/${userId}/edit`}>
          <Button label="Edit" />
        </Link>
      </Box>
      <Box
        direction="column"
        border={{ color: 'brand', size: 'medium', style: 'dashed' }}
        pad="medium"
        margin="medium"
      >
        <img
          src={user.avatar}
          alt="avatar"
          style={{ borderRadius: '50%', height: '100px', width: '100px' }}
        />
        <br />
        <Text weight="bold" margin={{ right: '10px' }}>
          Email:{' '}
        </Text>
        <Text>{user.email}</Text>
        <br />
        <Text weight="bold" margin={{ right: '10px' }}>
          Name:{' '}
        </Text>
        <Text>
          {user.first_name} {user.last_name}
        </Text>
      </Box>
    </Fragment>
  );
}

export default withRouter(UserShow);
