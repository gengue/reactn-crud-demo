import React, { Fragment, useEffect } from 'react';
import { withGlobal } from 'reactn';
import { Link, withRouter } from 'react-router-dom';
import { Box, Button, Text } from 'grommet/components';

function BookShow({ books, match, crudHandler }) {
  const { resourceId } = match.params;
  const book = books.data[resourceId];

  useEffect(
    () => {
      if (!book) {
        crudHandler.fetchOne(resourceId);
      }
    },
    [resourceId, book, crudHandler]
  );

  if (!book) return null;

  return (
    <Fragment>
      <Box
        direction="row"
        border={{ color: 'brand', size: 'small', style: 'dashed' }}
        pad="medium"
        margin="medium"
        justify="between"
      >
        <Link to="/users/">
          <Button label="Back" />
        </Link>
        <Link to={`/books/${resourceId}/edit`}>
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
          src={book.cover}
          alt="avatar"
          style={{ borderRadius: '50%', height: '100px', width: '100px' }}
        />
        <br />
        <Text weight="bold" margin={{ right: '10px' }}>
          Title:{' '}
        </Text>
        <Text>{book.title}</Text>
      </Box>
    </Fragment>
  );
}

const mapStateToProps = global => ({
  books: global.vadmin.resources.books,
});

export default withGlobal(mapStateToProps)(withRouter(BookShow));
