import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Layout, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { Header } = Layout;

const Logo = styled(Link)`
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
`;

const HeaderMenu = ({ user, onLogout }) => {
  return (
    <Header className="header">
      <Logo to="/" className="logo" />
      {user ? (
        <Row justify="end">
          <Col>
            <Button icon={<UserOutlined />} onClick={onLogout}>
              {user.username}
            </Button>
          </Col>
        </Row>
      ) : (
        <Row justify="end">
          <Col>
            <Link to="/login">
              <Button type="primary">로그인</Button>
            </Link>
          </Col>
        </Row>
      )}
    </Header>
  );
};

export default HeaderMenu;
