import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  Table,
  PageHeader,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  Layout,
  Breadcrumb,
  Space,
  Radio,
  DatePicker,
} from "antd";

const { Content } = Layout;

export const NEWPARTS_QUERY = gql`
  query NewPartQuery($filter: String) {
    newPartList(filter: $filter) {
      id
      lists {
        id
        model
        partNo
        vender {
          name
        }
        category
        type
        sequence
        status
        createdAt
        requester {
          id
          name
        }
        planner {
          id
          name
        }
        tester {
          id
          name
        }
      }
      count
    }
  }
`;

const columns = [
  {
    title: "Model",
    dataIndex: "model",
    fixed: "left",
    sorter: (a, b) => a.model.localeCompare(b.model),
  },
  {
    title: "Part No",
    dataIndex: "partNo",
    fixed: "left",
    sorter: (a, b) => a.partnumber.localeCompare(b.partnumber),
    render: (text) => {
      return <Link to={`/dqm/${text}`}>{text}</Link>;
    },
  },
  {
    title: "Part Name",
    dataIndex: "name",
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: "Vendor",
    dataIndex: ["vender", "name"],
    ellipsis: {
      showTitle: false,
    },
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
    dataIndex: "sequence",
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
    onFilter: (value, record) => record.status.indexOf(value) === 0,
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
    dataIndex: ["requester", "name"],
  },
  {
    title: "Tester",
    dataIndex: ["tester", "name"],
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

const CreateForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Create a new part"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      width={1000}
      mask={false}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Row gutter={[16]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
            <Form.Item
              name="model"
              label="Model"
              rules={[
                {
                  required: true,
                  message: "Please input the Model!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12} xxl={8}>
            <Form.Item
              name="partNo"
              label="Part No"
              rules={[
                {
                  required: true,
                  message: "Please input the Part number!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Form.Item name="description" label="Description">
            <Input type="textarea" />
          </Form.Item>
        </Row>
        <Form.Item
          name="modifier"
          className="collection-create-form_last-form-item"
        >
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

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
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();

  const { data, loading, error } = useQuery(NEWPARTS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setVisible(false);
  };

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
            <Button key="2">Reload</Button>,
            <Button
              key="1"
              type="primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              New
            </Button>,
          ]}
        />
        <CreateForm
          visible={visible}
          onCreate={onCreate}
          onCancel={() => {
            setVisible(false);
          }}
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
        {loading && <p>Loading...</p>}
        {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
        {data && (
          <Table
            columns={columns}
            dataSource={data.newPartList.lists}
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
        )}
      </Content>
    </>
  );
};

export default RequestedTable;
