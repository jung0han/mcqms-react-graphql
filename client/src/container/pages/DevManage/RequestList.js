import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  Table,
  PageHeader,
  Button,
  Form,
  Row,
  Col,
  Input,
  Select,
  Badge,
  Layout,
  Breadcrumb,
  Tooltip,
  Space,
  DatePicker,
} from "antd";

const { Content } = Layout;

const columns = [
  {
    title: "Model",
    dataIndex: "model",
    fixed: "left",
    sorter: (a, b) => a.model.localeCompare(b.model),
  },
  {
    title: "Part No",
    dataIndex: "partnumber",
    fixed: "left",
    sorter: (a, b) => a.partnumber.localeCompare(b.partnumber),
    render: (text) => {
      return <Link to={`/DQMS/${text}`}>{text}</Link>;
    },
  },
  {
    title: "Part Name",
    dataIndex: "name",
    ellipsis: {
      showTitle: false,
    },
    render: (name) => (
      <Tooltip placement="topLeft" title={name}>
        {name}
      </Tooltip>
    ),
  },
  {
    title: "Vendor",
    dataIndex: "vendor",
    ellipsis: {
      showTitle: false,
    },
    render: (vendor) => (
      <Tooltip placement="topLeft" title={vendor}>
        {vendor}
      </Tooltip>
    ),
  },
  {
    title: "Category",
    dataIndex: "category",
    filters: [
      {
        text: "회로",
        value: "회로",
      },
      {
        text: "기구",
        value: "기구",
      },
    ],
    onFilter: (value, record) => record.category.indexOf(value) === 0,
  },
  {
    title: "Type",
    dataIndex: "type",
    filters: [
      {
        text: "New",
        value: "New",
      },
      {
        text: "4M",
        value: "4M",
      },
    ],
    onFilter: (value, record) => record.type.indexOf(value) === 0,
  },
  {
    title: "Seq.",
    dataIndex: "seq",
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "x",
    filters: [
      {
        text: "waiting",
        value: "waiting",
      },
      {
        text: "testing",
        value: "testing",
      },
      {
        text: "rejected",
        value: "rejected",
      },
      {
        text: "complate",
        value: "complate",
      },
    ],
    onFilter: (value, record) => record.status[1].indexOf(value) === 0,
    render: (text) => <Badge status={text[0]} text={text[1]} />,
  },
  {
    title: "Result",
    dataIndex: "result",
    filters: [
      {
        text: "OK",
        value: "OK",
      },
      {
        text: "NG",
        value: "NG",
      },
    ],
  },
  {
    title: "Requester",
    dataIndex: "requester",
  },
  {
    title: "Tester",
    dataIndex: "tester",
  },
];

const data = [
  {
    key: "1",
    model: "LMF100N",
    partnumber: "EAB23456784",
    type: "New",
    seq: 1,
    name: "PMIC",
    category: "회로",
    vendor: "Qualcomm",
    requester: "아무개",
    tester: "홍길동",
    status: ["warning", "waiting"],
  },
  {
    key: "2",
    model: "LMF100N",
    partnumber: "EAB23456789",
    type: "4M",
    seq: 2,
    name: "PMIC",
    category: "회로",
    vendor: "Qualcomm",
    requester: "아무개",
    tester: "홍길동",
    status: ["processing", "testing"],
  },
  {
    key: "3",
    model: "LMF100N",
    partnumber: "EAB23456788",
    type: "New",
    seq: 1,
    name: "AP",
    category: "회로",
    vendor: "Qualcomm",
    requester: "아무개",
    tester: "홍길동",
    status: ["default", "complate"],
    result: "OK",
  },
  {
    key: "4",
    model: "LMF100N",
    partnumber: "EAB23456787",
    type: "New",
    seq: 1,
    name: "Front Cover",
    category: "기구",
    vendor: "BYD",
    requester: "아무개",
    tester: "홍길동",
    status: ["error", "rejected"],
  },
];

function onChange(pagination, filters, sorter, extra) {
  console.log("params", pagination, filters, sorter, extra);
}

const StyledPageHeader = styled(PageHeader)`
  padding-left: 0px;
  padding-top: 0px;
  padding-right: 0px;
`;

const SearchForm = styled(Form)`
  padding: 24px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  margin-bottom: 24px;
  .ant-form-item {
    margin-bottom: 10px;
  }
`;

const layout = {
  labelCol: {
    xxl: { span: 5 },
    span: 6,
  },
};

const onFinish = (values) => {
  console.log("Received values of form: ", values);
};

const RequestedTable = ({ history }) => {
  const [form] = Form.useForm();

  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  console.log(history);

  return (
    <>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Part DQM</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <StyledPageHeader
          className="site-page-header"
          title="Part DQM"
          subTitle="Request Status"
          extra={[
            <Button key="2">Operation</Button>,
            <Button key="1" type="primary">
              New
            </Button>,
          ]}
        />
        <SearchForm
          form={form}
          {...layout}
          className="search-form"
          onFinish={onFinish}
          colon={false}
        >
          <Row gutter={[16]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
              <Form.Item name="Model" label="Model">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
              <Form.Item name="PartNo" label="Part No">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
              <Form.Item name="Vender" label="Vender">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
              <Form.Item name="Requester" label="Requester">
                <Select
                  mode="tags"
                  allowClear
                  onChange={handleChange}
                  notFoundContent=""
                ></Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
              <Form.Item name="Staff" label="Staff">
                <Select
                  mode="tags"
                  allowClear
                  onChange={handleChange}
                  notFoundContent=""
                ></Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
              <Form.Item name="Tester" label="Tester">
                <Select
                  mode="tags"
                  allowClear
                  onChange={handleChange}
                  notFoundContent=""
                ></Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
              <Form.Item name="Date" label="Date">
                <DatePicker.RangePicker />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: "right" }}>
              <Space>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  Clear
                </Button>
              </Space>
            </Col>
          </Row>
        </SearchForm>
        <Table
          columns={columns}
          dataSource={data}
          onChange={onChange}
          size="small"
          bordered
          scroll={{ x: 1300 }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                console.log(event, record, rowIndex);
              },
            };
          }}
        />
      </Content>
    </>
  );
};

export default RequestedTable;
