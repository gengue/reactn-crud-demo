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

function Filters({ open, resource, fields, crudHandler, activeFilters }) {
  const [filters, setFilters] = useState(activeFilters);
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
  const onClear = () => {
    crudHandler.filter({ filter: {} }, { resource });
    setFilters({});
  };

  if (!fields) return null;

  return (
    <Col style={getContainerStyle(open)} span={24}>
      <div style={{ flexGrow: 1 }}>
        {React.Children.map(fields, (field, idx) => {
          const newProps = {
            ...field.props,
            id: field.props.id || field.props.source,
            value: filters[field.props.source],
            onChange: e => handleFilters(e, field.props.source),
          };
          return (
            <div style={filterInputStyle} key={idx}>
              {React.cloneElement(field, newProps, null)}
            </div>
          );
        })}
        <Button.Group>
          <Button type="primary" onClick={onSendFilters} size="small">
            Apply filters
          </Button>
          <Button type="primary" ghost onClick={onClear} size="small">
            Clear
          </Button>
        </Button.Group>
      </div>
    </Col>
  );
}

export default memo(Filters);
