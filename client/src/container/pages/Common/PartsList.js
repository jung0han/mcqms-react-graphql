import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
// import { Link } from "react-router-dom";
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
  Popconfirm,
  message,
  Typography,
  Result,
} from "antd";
const { Link } = Typography;

const { Content } = Layout;
const { Option } = Select;

export const PARTS_QUERY = gql`
  query PartsQuery($filter: PartsFilterByInput) {
    partList(filter: $filter) {
      id
      lists {
        id
        partNo
        partName
        vendor
        category
        createdAt
        addedBy {
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

const CREATE_PART_MUTATION = gql`
  mutation PartMutation($info: AddPartByInput) {
    addPart(info: $info) {
      id
    }
  }
`;

const DELTET_PART_MUTATION = gql`
  mutation DeletePartMutation($id: ID!) {
    deletePart(id: $id) {
      id
    }
  }
`;

const StyledPageHeader = styled(PageHeader)`
  padding-left: 0px;
  padding-top: 0px;
  padding-right: 0px;
`;

const StyledResult = styled(Result)`
  border: 1px solid #d9d9d9;
`;

const SearchForm = styled(Form)`
  padding: 24px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  margin-bottom: 24px;
  .ant-form-item {
    margin-bottom: 0px;
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

  return (
    <Modal
      visible={visible}
      title="Create part information"
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
              name="partNo"
              label="Part Number"
              rules={[{ required: true, message: "Please enter Part Number" }]}
            >
              <Input placeholder="Please enter Part Number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="partName"
              label="Part Name"
              rules={[{ required: true, message: "Please enter Part Name" }]}
            >
              <Input placeholder="Please enter Part Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="vendor"
              label="Vendor name"
              rules={[{ required: true, message: "Please enter Vendor name" }]}
            >
              <Input placeholder="Please enter Vendor name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select category" }]}
            >
              <Select placeholder="Please select category">
                <Option value="Circuit">Circuit</Option>
                <Option value="Mechanical">Mechanical</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

// const layout = {
//   labelCol: { span: 12 },
// };

const PartsList = ({ history }) => {
  const [visible, setVisible] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [form] = Form.useForm();

  const { data, loading, error, refetch } = useQuery(PARTS_QUERY);

  const [createPart] = useMutation(CREATE_PART_MUTATION);
  const [deletePart] = useMutation(DELTET_PART_MUTATION);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const onCreate = (values) => {
    createPart({
      variables: {
        info: {
          partNo: values.partNo,
          partName: values.partName,
          vendor: values.vendor,
          category: values.category,
        },
      },
    })
      .then(() => setVisible(false))
      .then(() => refetch())
      .then(() =>
        message.success(values.partNo + "이 성공적으로 추가되었습니다.")
      );
  };

  const onDelete = (values) => {
    deletePart({
      variables: {
        id: values.id,
      },
    })
      .then(() => refetch())
      .then(() => message.success(values.partNo + "이 삭제되었습니다."));
  };

  const columns = [
    {
      title: "Part No",
      dataIndex: "partNo",
      fixed: "left",
      sorter: (a, b) => a.partNo.localeCompare(b.partNo),
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Part Name",
      dataIndex: "partName",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Popconfirm title="Sure to delete?" onConfirm={() => onDelete(record)}>
          <Link>Delete</Link>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Part infomation</Breadcrumb.Item>
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
          title="Part infomation"
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
          onFinish={onFinish}
          colon={false}
        >
          <Row gutter={[16]}>
            {/* xs={} sm={} md={} lg={} xl={} xxl={} */}
            <Col lg={6} xl={3}>
              <Form.Item name="category">
                <Select
                  placeholder="Select a category"
                  onSelect={(e) => setCategoryFilter(e)}
                >
                  <Option value="Circuit">Circuit</Option>
                  <Option value="Mechanical">Mechanical</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col lg={6} xl={3}>
              <Form.Item name="search_text">
                <Input
                  placeholder="Contains text"
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xl={3}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() =>
                    refetch({
                      filter: {
                        contains: searchFilter,
                        category: categoryFilter,
                      },
                    })
                  }
                >
                  Search
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    setSearchFilter("");
                    refetch({ filter: { contains: "" } });
                  }}
                >
                  Clear
                </Button>
              </Space>
            </Col>
          </Row>
        </SearchForm>
        {error && (
          <StyledResult status="error" title="Sorry, something went wrong." />
        )}
        {data && (
          <Table
            columns={columns}
            rowKey="id"
            dataSource={data.partList.lists}
            size="small"
            bordered
            loading={loading}
            scroll={{ x: 700 }}
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

export default PartsList;
