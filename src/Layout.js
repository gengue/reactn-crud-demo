import React, { useState } from 'react';
import { Icon, Navbar, Nav, Container, Sidebar, Sidenav } from 'rsuite';
import { Link } from 'react-router-dom';

const headerStyles = {
  padding: 18,
  fontSize: 16,
  height: 56,
  background: '#34c3ff',
  color: ' #fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

const NavToggle = ({ expand, onChange }) => {
  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Navbar.Body>
        <Nav pullRight>
          <Nav.Item
            onClick={onChange}
            style={{ width: 56, textAlign: 'center' }}
          >
            <Icon icon={expand ? 'angle-left' : 'angle-right'} />
          </Nav.Item>
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
};

function Layout(props) {
  const [expand, setExpand] = useState(true);
  const handleToggle = () => setExpand(!expand);
  return (
    <Container className="MainLayout">
      <Sidebar className="Sidebar" width={expand ? 260 : 56} collapsible>
        <Sidenav.Header>
          <div style={headerStyles}>
            <Icon
              icon="logo-analytics"
              size="lg"
              style={{ verticalAlign: 0 }}
            />
            <span style={{ marginLeft: 12 }}> Reactn CRUD</span>
          </div>
        </Sidenav.Header>
        <aside className="Nav">
          <Sidenav
            expanded={expand}
            defaultOpenKeys={['3']}
            appearance="subtle"
          >
            <Sidenav.Body>
              <Nav>
                <Link to="/users/">
                  <Nav.Item
                    eventKey="1"
                    active
                    icon={<Icon icon="group" />}
                    componentClass="span"
                  >
                    Users
                  </Nav.Item>
                </Link>
                <Link to="/books/">
                  <Nav.Item
                    eventKey="2"
                    icon={<Icon icon="book" />}
                    componentClass="span"
                  >
                    Books
                  </Nav.Item>
                </Link>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
          <NavToggle expand={expand} onChange={handleToggle} />
        </aside>
      </Sidebar>
      <Container
        style={{
          marginLeft: expand ? 260 : 56,
          transition: 'margin-left 300ms',
        }}
      >
        {props.children}
      </Container>
    </Container>
  );
}
export default Layout;
