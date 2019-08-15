import React from 'react';
import { withGlobal } from 'reactn';
import { paginate } from './../utils';

function Pagination(props) {
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
}

export default withGlobal(global => ({
  list: global.vadmin.resources.users.list,
  loading:
    !global.vadmin.resources.users.list.loadedOnce && global.vadmin.loading,
}))(Pagination);
