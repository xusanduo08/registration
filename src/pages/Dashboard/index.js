import { useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Table } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import styles from './index.less';

// 登录后的用户中心
//
function Dashboard(props) {
  const { dispatch, subsList } = props;
  const { SubMenu } = Menu;
  const { Header, Content, Sider, data } = Layout;

  // 菜单通过接口查出来
  useEffect(() => {
    dispatch({
      type: 'regist/qrySubsList',
      payload: { custId: '1' },
    });
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      render: (text) => {
        return moment(text).format('MM/DD/YYYY');
      },
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Appointmen Time',
      dataIndex: 'appointmentTime',
      render: (text) => {
        return moment(text).format('MM/DD/YYYY');
      },
    },
  ];

  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.logo} />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">主菜单1</Menu.Item>
          <Menu.Item key="2">主菜单2</Menu.Item>
          <Menu.Item key="3">主菜单3</Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider width={200} className={styles['site-layout-background']}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu key="sub1" icon={<UserOutlined />} title="menu 1">
              <Menu.Item key="1">菜单1</Menu.Item>
              <Menu.Item key="2">菜单2</Menu.Item>
              <Menu.Item key="3">菜单3</Menu.Item>
              <Menu.Item key="4">菜单4</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<LaptopOutlined />} title="menu 2">
              <Menu.Item key="5">菜单5</Menu.Item>
              <Menu.Item key="6">菜单6</Menu.Item>
              <Menu.Item key="7">菜单7</Menu.Item>
              <Menu.Item key="8">菜单8</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            className={styles['site-layout-background']}
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Table columns={columns} dataSource={subsList} size="middle" />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default connect((state) => ({
  subsList: state.regist.subsList,
}))(Dashboard);
