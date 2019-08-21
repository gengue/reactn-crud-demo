import React, { useState, memo } from 'react';
import { Col, Button } from 'antd';

/**
 * Styles
 */
const getContainerStyle = open => ({
  height: open ? 'auto' : 0,
  opacity: open ? 1 : 0,
  padding: open ? '1em' : 0,
  transition: 'all 300ms ease-out',
  borderRadius: '5px',
  display: 'flex',
  background: '#939eab1a',
  justifyContent: 'space-between',
  position: 'relative',
  marginBottom: '10px',
});
const filterInputStyle = { margin: '8px', display: 'inline-block' };
const getFilterButtonStyle = open => ({
  minWidth: '100px',
  height: '40px',
  alignSelf: 'flex-end',
  display: open ? 'inherit' : 'none',
});

function Filters({ open, resource, fields, crudHandler }) {
  const [filters, setFilters] = useState({});
  const handleFilters = (rawValue, name) => {
    let value = null;
    if (rawValue) {
      value = rawValue.target ? rawValue.target.value : rawValue;
    }
    setFilters({
      ...filters,
      [name]: value,
    });
  };
  const onSendFilters = () => {
    crudHandler.filter({ filter: filters }, { resource });
  };

  if (!fields) return null;

  return (
    <Col style={getContainerStyle(open)} span={24}>
      <div style={{ flexGrow: 1 }}>
        {React.Children.map(fields, (field, idx) => {
          const newProps = {
            ...field.props,
            id: field.props.id || field.props.source,
            onChange: e => handleFilters(e, field.props.source),
          };
          return (
            <div style={filterInputStyle} key={idx}>
              {React.cloneElement(field, newProps, null)}
            </div>
          );
        })}
      </div>
      <Button
        type="primary"
        style={getFilterButtonStyle(open)}
        onClick={onSendFilters}
      >
        Apply filters
      </Button>
    </Col>
  );
}

export default memo(Filters);
