import React from 'react';
import { TablePagination } from 'rsuite';

function Pagination(props) {
  const { resource, crudHandler, list } = props;
  const { total, params } = list;
  const { page, perPage } = params;

  const handleChangePage = page => crudHandler.filter({ page }, { resource });
  const handleChangeLength = value => {
    crudHandler.filter({ perPage: value }, { resource });
  };

  return (
    <TablePagination
      lengthMenu={[
        {
          value: 5,
          label: 5,
        },
        {
          value: 10,
          label: 10,
        },
        {
          value: 20,
          label: 20,
        },
      ]}
      activePage={page}
      displayLength={perPage}
      total={total}
      onChangePage={handleChangePage}
      onChangeLength={handleChangeLength}
    />
  );
}

export default Pagination;
