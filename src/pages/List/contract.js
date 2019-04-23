import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
// 支付状态
const payStatusMap = {
  '已支付':'success',
  '未支付':'processing',
  '-':''
};
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => { },
    handleUpdateModalVisible: () => { },
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        desc: props.values.desc,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep, formVals) => {
    const { form } = this.props;
    if (currentStep === 1) {
      return [
        <FormItem key="target" {...this.formLayout} label="监控对象">
          {form.getFieldDecorator('target', {
            initialValue: formVals.target,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">表一</Option>
              <Option value="1">表二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="template" {...this.formLayout} label="规则模板">
          {form.getFieldDecorator('template', {
            initialValue: formVals.template,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">规则模板一</Option>
              <Option value="1">规则模板二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="type" {...this.formLayout} label="规则类型">
          {form.getFieldDecorator('type', {
            initialValue: formVals.type,
          })(
            <RadioGroup>
              <Radio value="0">强</Radio>
              <Radio value="1">弱</Radio>
            </RadioGroup>
          )}
        </FormItem>,
      ];
    }
    if (currentStep === 2) {
      return [
        <FormItem key="time" {...this.formLayout} label="开始时间">
          {form.getFieldDecorator('time', {
            rules: [{ required: true, message: '请选择开始时间！' }],
          })(
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择开始时间"
            />
          )}
        </FormItem>,
        <FormItem key="frequency" {...this.formLayout} label="调度周期">
          {form.getFieldDecorator('frequency', {
            initialValue: formVals.frequency,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="month">月</Option>
              <Option value="week">周</Option>
            </Select>
          )}
        </FormItem>,
      ];
    }
    return [
      <FormItem key="name" {...this.formLayout} label="规则名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入规则名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="规则描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>,
    ];
  };

  renderFooter = currentStep => {
    const { handleUpdateModalVisible, values } = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ];
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="规则配置"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息" />
          <Step title="配置规则属性" />
          <Step title="设定调度周期" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}
// UpdateForm = Form.create({})(UpdateForm);
/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))

@Form.create()
class Contract extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };
  // 是否显示表格上方统计提示
  showTableAlert = 'none';
  // 表格是否显示复选框
  showCheckbox = false;
  // 表格列设置，默认按照签订日期排降序
  columns = [
    {
      title: '合同编号',
      dataIndex: 'constactCode',
      render: text => <a onClick={() => this.previewItem(text)}>{text}</a>,
    },
    {
      title: '合同名称',
      dataIndex: 'constractName',
    },
    {
      title: '商品名称',
      dataIndex: 'itemName',
      sorter: true,
      // render: val => `${val} 万`,
      // mark to display a total number
      needTotal: true,
    },
    {
      title: '客户名称',
      dataIndex: 'clientName',
    },
    {
      title: '签订日期',
      dataIndex: 'dealDate',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '合同状态',
      dataIndex: 'constractStus',
      // render(val) {
      //   return <Badge status={statusMap[val]} text={status[val]} />;
      // },
    },
    {
      title: '履约保证金支付状态',
      dataIndex: 'cash1',
      // filters: [
      //   {
      //     text: status[0],
      //     value: 0,
      //   },
      //   {
      //     text: status[1],
      //     value: 1,
      //   },
      //   {
      //     text: status[2],
      //     value: 2,
      //   },
      //   {
      //     text: status[3],
      //     value: 3,
      //   },
      // ],
      render(val) {
        let content = (val !== '-')?
        (<Badge status={payStatusMap[val]} text={val} />)
        :(val)

        return content
      },
    },
    {
      title: '优惠保证金支付状态',
      dataIndex: 'cash2',
      // filters: [
      //   {
      //     text: status[0],
      //     value: 0,
      //   },
      //   {
      //     text: status[1],
      //     value: 1,
      //   },
      //   {
      //     text: status[2],
      //     value: 2,
      //   },
      //   {
      //     text: status[3],
      //     value: 3,
      //   },
      // ],
      render(val) {
        
        let content = (val !== '-')?
        (<Badge status={payStatusMap[val]} text={val} />)
        :(val)

        return content
      },
    },
    {
      title: '合同类型',
      dataIndex: 'contractType',
      // filters: [
      //   {
      //     text: status[0],
      //     value: 0,
      //   },
      //   {
      //     text: status[1],
      //     value: 1,
      //   },
      //   {
      //     text: status[2],
      //     value: 2,
      //   },
      //   {
      //     text: status[3],
      //     value: 3,
      //   },
      // ],
      // render(val) {
      //   return <Badge status={statusMap[val]} text={status[val]} />;
      // },
    },
    {
      title: '合同来源',
      dataIndex: 'constractSource',
      // filters: [
      //   {
      //     text: status[0],
      //     value: 0,
      //   },
      //   {
      //     text: status[1],
      //     value: 1,
      //   },
      //   {
      //     text: status[2],
      //     value: 2,
      //   },
      //   {
      //     text: status[3],
      //     value: 3,
      //   },
      // ],
      // render(val) {
      //   return <Badge status={statusMap[val]} text={status[val]} />;
      // },
    },
    {
      title: '操作',
      // 常规操作为查看所以单独列出
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>详情</a>
          {/* 竖线分隔更好看 */}
          <Divider type="vertical" />
          {/* 更多按钮 */}
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
                <Menu.Item key="edit">
                  {/* 如果有变更记录需要显示提醒红点 */}
                  <Badge dot>
                    变更记录
                  </Badge>
                </Menu.Item>
                <Menu.Item key="creatOrder">创建订单</Menu.Item>
                <Menu.Item key="depositRecord">保证金信息记录</Menu.Item>
                <Menu.Item key="postponePay">支付延期</Menu.Item>
                <Menu.Item key="closeDetail">查看关闭申请</Menu.Item>
              </Menu>
            }
          >
            <a>
              更多 <Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  previewItem = id => {
    
    router.push(`/profile/basic/${id}`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  // 查询
  handleSearch = e => {
    // 阻止默认动作
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // 对日期类型进行预处理
      if(fieldsValue['dealDate']){
        const rangeValue = fieldsValue['dealDate'];
        fieldsValue.dealDate = [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')] 
      }
      
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };


      // 按钮状态
      this.setState({
        formValues: values,
      });
      
      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'rule/update',
      payload: {
        query: formValues,
        body: {
          name: fields.name,
          desc: fields.desc,
          key: fields.key,
        },
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="合同编号">
              {getFieldDecorator('constactCode')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="签订日期">
              {getFieldDecorator('dealDate')(
                <DatePicker.RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="合同编号">
              {getFieldDecorator('constactCode')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="合同名称">
              {getFieldDecorator('constractName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="客户名称">
              {getFieldDecorator('clientName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="合同类型">
              {getFieldDecorator('contractType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="长期合同">长期合同</Option>
                  <Option value="年度合同">年度合同</Option>
                  <Option value="季度合同">季度合同</Option>
                  <Option value="月度合同">月度合同</Option>
                  <Option value="周合同">周合同</Option>
                  <Option value="自定义合同">自定义合同</Option>
                  <Option value="现货订单合同">现货订单合同</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="合同来源">
              {getFieldDecorator('constractSource')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="线下签署">线下签署</Option>
                  <Option value="竞价活动">竞价活动</Option>
                  <Option value="团购活动">团购活动</Option>
                  <Option value="定向挂牌">定向挂牌</Option>
                  <Option value="现货订单">现货订单</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="签订日期">
              {getFieldDecorator('dealDate')(
                <DatePicker.RangePicker 
                  style={{ width: '100%' }} 
                  
                  />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('itemName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="合同状态">
              {getFieldDecorator('constractStus')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="待提交">待提交</Option>
                  <Option value="待审核">待审核</Option>
                  <Option value="审核通过">审核通过</Option>
                  <Option value="审核未通过">审核未通过</Option>
                  <Option value="生效">生效</Option>
                  <Option value="冻结">冻结</Option>
                  <Option value="关闭">关闭</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  // 跳转至添加页
  toAddForm = ()=>{
    console.log(router);
    
    router.push('/form/addContract-form')
  }
  render() {
    const {
      rule: { data },
      loading,
    } = this.props;

    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">变更记录</Menu.Item>
        <Menu.Item key="approval">保证金记录</Menu.Item>
        <Menu.Item key="postponed">支付延期</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    

    return (
      <PageHeaderWrapper >
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* 查询表单 */}
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            {/* 表格操作，在选中时会有其他操作 */}
            <div className={styles.tableListOperator}>
              <Button 
                icon="plus" 
                type="primary"
                // onClick={() => this.handleModalVisible(true)}
                onClick={()=>{this.toAddForm()}}
                >
                  创建长合同
              </Button>
              {/* 如果选择了数据则显示 */}
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量导入合同</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            {/* 表格 */}
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              showTableAlert={this.showTableAlert}
              showCheckbox = {this.showCheckbox}
            />
          </div>
        </Card>
        {/* 创建表单 */}
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {/* 编辑表单 */}
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}
// Contract = Form.create({})(Contract);
export default Contract;
