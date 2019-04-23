import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Popover,
  List,
  Upload
} from 'antd';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Ellipsis from '@/components/Ellipsis';
import TableForm from './TableForm';
import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 将填报字段名称统一
const fieldLabels = {
  name: '仓库名',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
  type: '仓库类型',
  name2: '任务名',
  url2: '任务描述',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型',
};
// 合同状态
const contractHeader = (
  <div>
    <p>
      <label htmlFor="">合同状态：</label>
      已提交
  </p>
    <p>
      <label htmlFor="">退回理由：</label>
      这是一个很长的退回理由
  </p>
  </div>
);
const tableData = [
  {
    key: '1',
    workId: '00001',
    name: 'John Brown',
    department: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    workId: '00002',
    name: 'Jim Green',
    department: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    workId: '00003',
    name: 'Joe Black',
    department: 'Sidney No. 1 Lake Park',
  },
];

@connect(({ list, loading }) => ({
  submitting: loading.effects['form/submitAdvancedForm'],
  list
}))
@Form.create()
class AddContractform extends PureComponent {
  state = {
    width: '100%',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  getErrorInfo = () => {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
        </Popover>
        {errorCount}
      </span>
    );
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        dispatch({
          type: 'form/submitAdvancedForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      list: { list },
      loading
    } = this.props;
    const { width } = this.state;

    return (
      <PageHeaderWrapper
        wrapperClassName={styles.advancedForm}
        title='这是一个可能会很长的合同名称'
        content={contractHeader}
      >
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical">
            {/* 宽屏显示3列 */}
            <Row gutter={16}>
              <Col xl={{ span: 8, }} lg={{ span: 6 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='是否为线下签署合同:'>
                  {getFieldDecorator('owner', {
                    rules: [{ required: true, message: '请选择管理员' }],
                  })(
                    <Select placeholder="请选择管理员">
                      <Option value="xiao">付晓晓</Option>
                      <Option value="mao">周毛毛</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='签订日期'>
                  {getFieldDecorator('dateRange', {
                    rules: [{ required: true, message: '请选择生效日期' }],
                  })(
                    <DatePicker placeholder='请选择' style={{ width: '100%' }} />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='合同类型:'>
                  {getFieldDecorator('owner', {
                    rules: [{ required: true, message: '请选择管理员' }],
                  })(
                    <Select placeholder="请选择">
                      <Option value="长期合同">长期合同</Option>
                      <Option value="年度合同">年度合同</Option>
                      <Option value="季度合同">季度合同</Option>
                      <Option value="月度合同">月度合同</Option>
                      <Option value="周合同">周合同</Option>
                      <Option value="自定义合同">自定义合同</Option>
                      <Option value="现货订单合同">现货订单合同</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label='合同编号'>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入仓库名称' }],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='合同名称'>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入仓库名称' }],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={'价格方案'}>
                  {getFieldDecorator('owner', {
                    rules: [{ required: true, message: '请选择管理员' }],
                  })(
                    <Select placeholder="请选择">
                      <Option value="方案一">方案一</Option>
                      <Option value="方案二">方案二</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={'客户名称'}>
                  {getFieldDecorator('owner', {
                    rules: [{ required: true, message: '请选择管理员' }],
                  })(
                    <Select placeholder="请选择">
                      <Option value="名称一">名称一</Option>
                      <Option value="名称二">名称二</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='交收时间'>
                  {getFieldDecorator('dateRange', {
                    rules: [{ required: true, message: '请选择生效日期' }],
                  })(
                    <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='合同金额'>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入仓库名称' }],
                  })(<Input prefix="￥" addonAfter="元" placeholder="0.00" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={'销售店铺'}>
                  {getFieldDecorator('owner', {
                    rules: [{ required: true, message: '请选择管理员' }],
                  })(
                    <Select placeholder="请选择">
                      <Option value="名称一">名称一</Option>
                      <Option value="名称二">名称二</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {/* 合同备注单独一行 */}
            <Row gutter={16}>
              <Col xl={{ span: 16 }}>
                <Form.Item label={'合同备注'}>
                  {getFieldDecorator('owner', {
                    rules: [
                      {
                        required: true,
                        message: '此项必填',
                      },
                    ],
                  })(
                    <Input.TextArea
                      style={{ minHeight: 32 }}
                      placeholder={'在此填写备注...'}
                      rows={4}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="商品信息" className={styles.card} bordered={false}>
          {/* 商品列表 */}
          <div className={styles.cardList}>
            <List
              rowKey="id"
              loading={loading}
              grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
              dataSource={[...list]}
              renderItem={item =>
                item ? (
                  <List.Item key={item.id}>
                    <Card
                      hoverable
                      className={styles.card}
                      actions={[<a>编辑</a>, <a>订单</a>]}>
                      <Card.Meta
                        avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                        title={<a>{item.title}</a>}
                        description={
                          <Ellipsis className={styles.item} lines={3}>
                            {item.description}
                          </Ellipsis>
                        }
                      />
                    </Card>
                  </List.Item>
                ) : (
                    <List.Item>
                      <Button type="dashed" className={styles.newButton}>
                        <Icon type="plus" /> 新建产品
                  </Button>
                    </List.Item>
                  )
              }
            />
          </div>
        </Card>
        {/* 合同附件只允许上传一个 */}
        <Card title="合同规则" bordered={false}>
          {/* {getFieldDecorator('members', {
            initialValue: tableData,
          })(<TableForm />)} */}
          <Upload>
            <Button>
              <Icon type="upload" />上传合同附件
            </Button>
            <label style={{ marginLeft: 6 }}>注：文件为PDF格式，大小不超过10MB</label>
          </Upload>
        </Card>
        <Card title="合同条款" bordered={false}>
          <Form
            layout='vertical'
            hideRequiredMark
          >
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label='合同条款:'>
                  {getFieldDecorator('approver', {
                    rules: [{ required: false, message: '请选择审批员' }],
                  })(
                    <Select placeholder="请选择合同" style={{ width: '100%' }}>
                      <Option value="xiao">合同条款19283771919938282828一</Option>
                      <Option value="mao">合同条款二</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item label={''}>
                  {getFieldDecorator('owner', {
                    rules: [
                      {
                        required: false,
                        message: '此项必填',
                      },
                    ],
                  })(
                    <Input.TextArea
                      style={{ minHeight: 32 }}
                      placeholder={'合同内容...'}
                      rows={4}
                      disabled
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button type="primary" onClick={this.validate} loading={submitting}>
            提交
          </Button>
          <Button type="defult" onClick={this.validate} loading={submitting}>
            保存
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default AddContractform;
