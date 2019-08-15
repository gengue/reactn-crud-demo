import React from 'react';
import { useGlobal } from 'reactn';
import { Link } from 'react-router-dom';

function HomePage(props) {
  const [admin] = useGlobal('vadmin');
  const resources = admin && admin.resources ? admin.resources : {};
  return (
    <div>
      <h2>All resources</h2>
      <ul>
        {Object.keys(resources).map(i => (
          <li key={i}>
            <Link to={`${resources[i].props.basePath}${i}`}>{i}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
