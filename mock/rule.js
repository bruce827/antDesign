import { parse } from 'url';
import mockjs from 'mockjs'
// 处理时间排序
import moment from 'moment'
// mock tableListDataSource
// 使用随机生成数据
const {Random} = mockjs;
const constractStus = [
  "待提交",
  "待审核",
  "审核通过",
  "审核未通过",
  "生效",
  "冻结",
  "关闭"
];
const cashStus = [
  "已支付",
  "未支付",
  "-"
];
const concatType = [
  "长期合同",
  "年度合同",
  "季度合同",
  "月度合同",
  "周合同",
  "自定义合同",
  "现货订单合同",
];
const constractSource = [
  "线下签署",
  "竞价活动",
  "团购活动",
  "定向挂牌",
  "现货订单",
];
// 随意选取一个状态
Random.extend({
  pickOne:function(stuts){

    return this.pick(stuts);
  }
});
// 模拟数据量
let listLen = 500;
let tableListDataSource = [];
for (let i = 0; i < listLen; i += 1) {
  tableListDataSource.push({
    key: i,
    disabled: i % 6 === 0,
    href: 'https://ant.design',
    avatar: [
      'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
      'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
    ][i % 2],
    name: `TradeCode ${i}`,
    title: `一个任务名称 ${i}`,
    owner: '曲丽丽',
    desc: '这是一段描述',
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 4,
    updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    progress: Math.ceil(Math.random() * 100),

    // 长合同数据模拟
    // 合同编号
    constactCode:Random.string(2)+'-'+Random.integer(0,1000)+'-'+Random.csentence(2),
    // 合同名称
    constractName:Random.ctitle(5,7),
    // 商品名称
    itemName:Random.ctitle(2,4)+';'+Random.ctitle(2,4),
    // 客户名称
    clientName:Random.cname(),
    // 签订日期
    dealDate:Random.date(),
    // 合同状态
    constractStus:Random.pickOne(constractStus),
    // 履约保证金支付状态
    cash1:Random.pickOne(cashStus),
    // 优惠保证金支付状态
    cash2:Random.pickOne(cashStus),
    // 合同类型
    contractType:Random.pickOne(concatType),
    // 合同来源
    constractSource:Random.pickOne(constractSource),
  });
}

function getRule(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let dataSource = tableListDataSource;
    
  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  // 合同编号
  if (params.constactCode) {
    dataSource = dataSource.filter(data => data.constactCode.indexOf(params.constactCode) > -1);
  }
  // 合同名称
  if (params.constractName) {
    dataSource = dataSource.filter(data => data.constractName.indexOf(params.constractName) > -1);
  }
  // 合同类型
  if (params.contractType) {
    dataSource = dataSource.filter(data => data.contractType.indexOf(params.contractType) > -1);
  }
  // 合同来源
  if (params.constractSource) {
    dataSource = dataSource.filter(data => data.constractSource.indexOf(params.constractSource) > -1);
  }
  // 签订日期,允许默认查询
  if (params['dealDate[0]'] || params['dealDate[1]'] ) {
    let _start =  moment(params['dealDate[0]'],'YYYY-MM-DD');
    let _end = moment(params['dealDate[1]'],'YYYY-MM-DD');
    dataSource = dataSource.filter(data => {
      let _data = moment(data.dealDate,'YYYY-MM-DD');
      if(_data.isBetween(_start,_end)){

        return true 
      }
      return false
    });
  }
  // 商品名称
  if(params.itemName){
    dataSource = dataSource.filter(data => data.itemName.indexOf(params.itemName) > -1);
  }
  // 合同状态
  if(params.constractStus){
    dataSource = dataSource.filter(
      data => constractStus.includes(data.constractStus)
    );
  }

  
  // 分页
  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}

function postRule(req, res, u, b) {
  console.log('post');
  
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        href: 'https://ant.design',
        avatar: [
          'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
          'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
        ][i % 2],
        name: `TradeCode ${i}`,
        title: `一个任务名称 ${i}`,
        owner: '曲丽丽',
        desc,
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 2,
        updatedAt: new Date(),
        createdAt: new Date(),
        progress: Math.ceil(Math.random() * 100),
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { desc, name });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  return getRule(req, res, u);
}

// 列表页的查询请求使用get，添加删除等使用post
export default {
  'GET /api/rule': getRule,
  'POST /api/rule': postRule,
};
