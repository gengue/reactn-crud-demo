import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';

const { Content, Footer, Sider } = Layout;

const logoStyle = {
  height: '50px',
  lineHeight: '55px',
  marginBottom: '5px',
  display: 'block',
  fontSize: '1.5em',
  textAlign: 'center',
  textDecoration: 'none',
};

function MainLayout(props) {
  const [collapsed, setCollapsed] = useState(false);
  const handleToggle = () => setCollapsed(!collapsed);
  return (
    <Layout>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={handleToggle}
        theme="light"
      >
        <Link to="/" style={logoStyle}>
          <Icon type="sketch" style={{ marginRight: '5px' }} />
          {collapsed ? '' : 'Reactn CRUD'}
        </Link>

        <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/users/">
              <Icon type="user" />
              <span className="nav-text">Users</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/books/">
              <Icon type="book" />
              <span className="nav-text">Books</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/countries/">
              <Icon type="global" />
              <span className="nav-text">Countries</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout
        className="MainLayout"
        style={{ marginLeft: collapsed ? 80 : 200 }}
      >
        <Content className="MainLayout-page">{props.children}</Content>
        <Footer style={{ textAlign: 'center' }}>Genesis Guerrero ©2019</Footer>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
