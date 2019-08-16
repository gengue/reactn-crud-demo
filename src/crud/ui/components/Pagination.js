import React from 'react';
import { paginate } from './../utils';

function Pagination(props) {
  const { resource, crudHandler, list } = props;
  const { total, params } = list;
  const { page, perPage } = params;

  const handleClick = page => crudHandler.filter({ page }, { resource });
  const handlePerPage = e => {
    crudHandler.filter({ perPage: parseInt(e.target.value, 10) }, { resource });
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

export default Pagination;
