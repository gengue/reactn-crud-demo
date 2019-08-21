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
  const [expand, setExpand] = useState(false);
  const handleToggle = () => setExpand(!expand);
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
        collapsed={expand}
        onCollapse={handleToggle}
        theme="light"
      >
        <Link to="/" style={logoStyle}>
          <Icon type="sketch" style={{ marginRight: '5px' }} />
          Reacn CRUD
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
        </Menu>
      </Sider>
      <Layout className="MainLayout">
        <Content className="MainLayout-page">{props.children}</Content>
        <Footer style={{ textAlign: 'center' }}>
          Ventura Digital Labs ©2019
        </Footer>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
