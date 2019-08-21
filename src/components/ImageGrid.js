import React from 'react';
import { Tooltip } from 'antd';

function ImageGrid(props) {
  return (
    <div style={{ marginBottom: '1em' }}>
      {props.dataset.map(i => (
        <Tooltip title={i.name} key={i.id}>
          <img
            src={i.image}
            key={i.id}
            style={{
              border: `6px solid ${getRandomColor()}`,
              margin: '6px',
              width: '160px',
              height: '160px',
              objectFit: 'cover',
            }}
            alt={i.name}
          />
        </Tooltip>
      ))}
    </div>
  );
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default ImageGrid;
