import React, { useState } from "react";
import { useQuery, useLazyQuery, gql, useMutation } from "@apollo/client";
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
  Spin,
} from "antd";

const { Content } = Layout;
const { Option } = Select;

export const NEWPARTS_QUERY = gql`
  query NewPartQuery($filter: String) {
    newPartList(filter: $filter) {
      id
      lists {
        id
        model
        partNo
        vendor {
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

export const USER_QUERY = gql`
  query UserQuery($filter: String) {
    userList(filter: $filter) {
      id
      lists {
        id
        name
        department
      }
      count
    }
  }
`;

const CREATE_NEWPART_MUTATION = gql`
  mutation NewPartMutation(
    $model: String!
    $partNo: String!
    $vendorId: ID!
    $category: String!
    $plannerId: ID!
    $testerId: ID!
  ) {
    addNewPart(
      model: $model
      partNo: $partNo
      vendorId: $vendorId
      category: $category
      plannerId: $plannerId
      testerId: $testerId
    ) {
      id
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
    dataIndex: ["vendor", "name"],
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
  .ant-form-item-label {
    padding-bottom: 0px;
    label {
      font-weight: bold;
      color: rgb(118, 118, 118);
    }
  }
`;

const CreateForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [timer, setTimer] = useState(0);

  const [executeSearch, { data, loading, called }] = useLazyQuery(USER_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const handleSearch = (value) => {
    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      if (value) {
        executeSearch({
          variables: { filter: value },
        });
      }
    }, 800);

    setTimer(newTimer);
  };

  return (
    <Modal
      visible={visible}
      title="신규 부품 생성"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      width={600}
      style={{ left: 100 }}
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
      mask={false}
    >
      <Form
        form={form}
        name="form_in_modal"
        hideRequiredMark
        layout="vertical"
        initialValues={{
          modifier: "public",
        }}
      >
        <Row gutter={[16]}>
          <Col span={12}>
            <Form.Item
              name="model"
              label="Model"
              rules={[{ required: true, message: "Please enter model" }]}
            >
              <Input placeholder="Please enter model" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="partNo"
              label="Part Number"
              rules={[{ required: true, message: "Please enter model" }]}
            >
              <Input placeholder="Please enter model" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="vendorId"
              label="Vendor name"
              rules={[{ required: true, message: "Please enter model" }]}
            >
              <Input placeholder="Please enter model" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select an owner" }]}
            >
              <Select placeholder="Please select an owner">
                <Option value="circuit">Circuit</Option>
                <Option value="mechanical">Mechanical</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="plannerId"
              label="Planner"
              rules={[{ required: true, message: "Please enter model" }]}
            >
              <Select
                showSearch
                placeholder="Select users"
                notFoundContent={
                  called && loading ? <Spin size="small" /> : null
                }
                filterOption={false}
                onSearch={handleSearch}
              >
                {data &&
                  data.userList.lists.map((user) => (
                    <Option key={user.id}>{user.name}</Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="testerId"
              label="Tester"
              rules={[{ required: true, message: "Please enter model" }]}
            >
              <Select
                showSearch
                placeholder="Select users"
                notFoundContent={
                  called && loading ? <Spin size="small" /> : null
                }
                filterOption={false}
                onSearch={(e) => {
                  handleSearch(e);
                }}
              >
                {data &&
                  data.userList.lists.map((user) => (
                    <Option key={user.id}>{user.name}</Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
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

// const layout = {
//   labelCol: { span: 12 },
// };

const RequestedTable = ({ history }) => {
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();

  const { data, loading, error, refetch } = useQuery(NEWPARTS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const [createNewPart] = useMutation(CREATE_NEWPART_MUTATION);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const onCreate = (values) => {
    createNewPart({
      variables: {
        model: values.model,
        partNo: values.partNo,
        vendorId: values.vendorId,
        category: values.category,
        type: values.type,
        plannerId: values.plannerId,
        testerId: values.testerId,
      },
    });
    refetch();
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
          // {...layout}
          className="search-form"
          layout="vertical"
          onFinish={onFinish}
          colon={false}
        >
          <Row gutter={[16]}>
            {/* xs={} sm={} md={} lg={} xl={} xxl={} */}
            <Col lg={6} xl={3}>
              <Form.Item name="model" label="Model">
                <Input placeholder="ex) LGM123" />
              </Form.Item>
            </Col>
            <Col lg={6} xl={3}>
              <Form.Item name="partNo" label="Part Number">
                <Input placeholder="ex) EAB12345678" />
              </Form.Item>
            </Col>
            <Col lg={6} xl={3}>
              <Form.Item name="PartName" label="Part Name">
                <Input placeholder="ex) pOLED" />
              </Form.Item>
            </Col>
            <Col lg={6} xl={3}>
              <Form.Item name="vendorId" label="Vendor">
                <Input placeholder="ex) BOE" />
              </Form.Item>
            </Col>
            <Col lg={6} xl={3}>
              <Form.Item name="category" label="Category" initialValue="all">
                <Select>
                  <Option value="all">All</Option>
                  <Option value="circuit">Circuit</Option>
                  <Option value="mechanical">Mechanical</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col lg={6} xl={3}>
              <Form.Item name="type" label="Type" initialValue="all">
                <Select>
                  <Option value="all">All</Option>
                  <Option value="new">New</Option>
                  <Option value="change">4M Change</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col lg={6} xl={3}>
              <Form.Item name="status" label="Status" initialValue="all">
                <Select>
                  <Option value="all">All</Option>
                  <Option value="waiting">Waiting</Option>
                  <Option value="testing">Testing</Option>
                  <Option value="rejected">Rejected</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col lg={6} xl={3}>
              <Form.Item name="result" label="Result" initialValue="all">
                <Select>
                  <Option value="all">All</Option>
                  <Option value="OK">OK</Option>
                  <Option value="NG">NG</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16]}>
            <Col lg={12} xl={6}>
              <Form.Item label="User">
                <Input.Group compact>
                  <Form.Item
                    name={["user", "userType"]}
                    initialValue="all"
                    noStyle
                  >
                    <Select style={{ width: "35%" }}>
                      <Option value="all">All</Option>
                      <Option value="requester">Requester</Option>
                      <Option value="tester">Tester</Option>
                      <Option value="planner">Planner</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name={["user", "userName"]} noStyle>
                    <Input
                      style={{ width: "65%" }}
                      placeholder="Input street"
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
            <Col lg={12} xl={6}>
              <Form.Item label="Date">
                <Input.Group compact>
                  <Form.Item name={["dateType", "dateValue"]} noStyle>
                    <Select style={{ width: "35%" }} defaultValue="Requested">
                      <Option value="Requested">Requested</Option>
                      <Option value="Approved">Approved</Option>
                    </Select>
                    <DatePicker.RangePicker
                      style={{ width: "65%" }}
                      format="YY/MM/DD"
                    />
                  </Form.Item>
                </Input.Group>
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
            rowKey="id"
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
