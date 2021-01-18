import React from "react";
import { Layout, Menu } from "antd";

const { SubMenu } = Menu;
const { Sider } = Layout;

function handleClick(e) {
  console.log("click", e);
}

const SideMenu = () => {
  return (
    <Sider
      onClick={handleClick}
      style={{ width: 256 }}
      mode="vertical"
      className="site-layout-background"
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ borderRight: 0 }}
      >
        <Menu.Item key="1">DQMS</Menu.Item>
        <SubMenu key="sub1" title="Setup">
          <Menu.Item key="2">시험 항목</Menu.Item>
          <Menu.Item key="3">ITEM Mapping</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default SideMenu;
