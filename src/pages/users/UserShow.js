import React, { Fragment, useEffect } from 'react';
import { withGlobal } from 'reactn';
import { Link, withRouter } from 'react-router-dom';
import { Box, Button, Text } from 'grommet/components';

function UserShow({ users, match, crudHandler }) {
  const { resourceId } = match.params;
  const user = users.data[resourceId];

  useEffect(
    () => {
      if (!user) {
        crudHandler.fetchOne(resourceId);
      }
    },
    [resourceId, user, crudHandler]
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
        <Link to="/books/">
          <Button label="Back" />
        </Link>
        <Link to={`/users/${resourceId}/edit`}>
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

const mapStateToProps = global => ({
  users: global.vadmin.resources.users,
});

export default withGlobal(mapStateToProps)(withRouter(UserShow));
