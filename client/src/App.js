import React from "react";
import CreateLink from "./components/CreateLink";
import LinkList from "./components/LinkList";
import { Redirect, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "antd";
import Login from "./components/Login";
import Search from "./components/Search";
import HeaderMenu from "./container/layout/HeadMenu";
import SideMenu from "./container/layout/SideMenu";
import RequestList from "./container/pages/DevManage/RequestList";
import Header from "./components/Header";

const App = () => {
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Helmet>
          <title>REACTERS</title>
        </Helmet>
        <HeaderMenu />
        <Layout>
          <SideMenu />
          <Layout style={{ padding: "0 24px 0" }}>
            <Header />
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/new/1" />} />

              <Route exact path="/create" component={CreateLink} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/search" component={Search} />
              <Route exact path="/top" component={LinkList} />
              <Route exact path="/new/:page" component={LinkList} />
              <Route exavt path="/dqm" component={RequestList} />
            </Switch>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default App;
