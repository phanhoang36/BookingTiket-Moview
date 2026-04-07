// @ts-nocheck
import { AppstoreOutlined, CalendarOutlined, HomeOutlined, OrderedListOutlined, PictureOutlined } from '@ant-design/icons';
import { ConfigProvider, Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;

const menuItems = [
  { key: '/admin', icon: <HomeOutlined />, label: <Link to="/admin">Dashboard</Link> },
  { key: '/admin/showtimes', icon: <CalendarOutlined />, label: <Link to="/admin/showtimes">Suất Chiếu</Link> },
  { key: '/admin/bookings', icon: <OrderedListOutlined />, label: <Link to="/admin/bookings">Đặt Vé</Link> },
  { key: '/admin/halls', icon: <AppstoreOutlined />, label: <Link to="/admin/halls">Phòng Chiếu</Link> },
  { key: '/admin/featured', icon: <PictureOutlined />, label: <Link to="/admin/featured">Biểu Ngữ</Link> },
];

export function AdminLayout() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const selectedKey = menuItems
    .map((m) => m.key)
    .filter((k) => pathname === k || (k !== '/admin' && pathname.startsWith(k)))
    .sort((a, b) => b.length - a.length)[0] ?? '/admin';

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#ff5449',
          colorBgBase: '#131313',
          borderRadius: 8,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{ background: '#0e0e0e', borderRight: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? 0 : '0 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {collapsed ? (
              <span style={{ color: '#ff5449', fontWeight: 700, fontSize: 18 }}>CV</span>
            ) : (
              <Link
                to="/"
                style={{ color: '#ff5449', fontWeight: 700, fontSize: 16, fontFamily: 'Space Grotesk' }}
              >
                CINEVERSE Admin
              </Link>
            )}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            style={{ background: 'transparent', border: 'none' }}
          />
        </Sider>
        <Layout>
          <Content style={{ padding: 32, background: '#131313' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
