let {sqlmethod,generator,base64} = require('../../core/framework');
module.exports = {
  "rootpath": "/api/ecr/",
  "description":"ECR系统",
  "mapping": {
    "login": { "description": "获取活动列表",auth:false },
    "rolelist":{auth:false}
  },
  "login": (req, res) => {
    var json = {
      token:'admindemo',
      adminid:'adminid',
      loginname:'loginname',
      name:'5byg5LiJ5Liw',
      roleid:'roleid',
      rolename:'57O757uf566h55CG5ZGY',
      list:[
        {"funcid":"2d7e4a3a-6e66-11e5-9d70-feff819cdc9f","funcname":"角色管理"},
        {"funcid":"43947006-6e66-11e5-9d70-feff819cdc9f","funcname":"用户管理"},
        {"funcid":"5759c0fa-6e66-11e5-9d70-feff819cdc9f","funcname":"停车区域"},
        {"funcid":"68aa0ee6-6e66-11e5-9d70-feff819cdc9f","funcname":"车型信息"},
        {"funcid":"7028ff10-6e66-11e5-9d70-feff819cdc9f","funcname":"车辆信息"},
        {"funcid":"894c66ee-6e66-11e5-9d70-feff819cdc9f","funcname":"车辆监控"},
        {"funcid":"9e845e2c-6e66-11e5-9d70-feff819cdc9f","funcname":"车辆定位"},
        {"funcid":"a79bbfa0-6e66-11e5-9d70-feff819cdc9f","funcname":"开、关门"},
        {"funcid":"b331c0a8-6e66-11e5-9d70-feff819cdc9f","funcname":"断、供电"},
        {"funcid":"c1a6e67c-6e66-11e5-9d70-feff819cdc9f","funcname":"双闪、喇叭"},
        {"funcid":"97aca720-6e67-11e5-9d70-feff819cdc9f","funcname":"会员列表"},
        {"funcid":"a2fd224e-6e67-11e5-9d70-feff819cdc9f","funcname":"会员审核"},
        {"funcid":"a9e18370-6e67-11e5-9d70-feff819cdc9f","funcname":"状态管理"},
        {"funcid":"f0a39fc4-6e66-11e5-9d70-feff819cdc9f","funcname":"订单列表"},
        {"funcid":"f8647c74-6e66-11e5-9d70-feff819cdc9f","funcname":"订单处理"},
        {"funcid":"000f3a4a-6e67-11e5-9d70-feff819cdc9f","funcname":"订单导出"},
        {"funcid":"0f2c9a90-6e67-11e5-9d70-feff819cdc9f","funcname":"违章处理"},
        {"funcid":"dc20c4ea-6e67-11e5-9d70-feff819cdc9f","funcname":"计费规则设置"},
        {"funcid":"e5c63b24-6e67-11e5-9d70-feff819cdc9f","funcname":"计费时间设置"},
        {"funcid":"f4b9030a-6e67-11e5-9d70-feff819cdc9f","funcname":"优惠卷维护"},
        {"funcid":"ff10b15e-6e67-11e5-9d70-feff819cdc9f","funcname":"优惠卷维护"}
      ]
    };
    res.send(generator.data(json));
  },
  "rolelist":(req,res) =>{
    var json = {
      pagecount:10,
      pagenumber:1,
      list:[]
    };
    for(var i=0;i<10;i++){
      json.list.push(
        {"roleid":i,"rolename":"6KeS6Imy5ZCN56ewQkFTRTY05Yqg5a+G","state":"0"}
      );
    }
    res.send(generator.data(json));
  }
};