# website


## 基于 Nodejs & Bootstrap & mysql 的快速开发框架

bootstrap负责UI展示，nodejs用于后台请求处理，数据存储到mysql

## 概述

用最少的代码处理更多的事情。

基于nodejs的后台对express进行了封装，将filter，handler，controller拆分成组件形式。通过framework.js对相应目录进行扫描实现动态加载。

前端采用标准bootstrap框架，对表单进行了拆分、重构及封装，可通过定制表单结构自动生成增删改查等简单操作，亦可根据业务需求实现自定义表单内容及处理流程。

---

备注：

1. `http://domain:3000/apis` 当前框架已加载的controll（包括名称、描述、权限）

2. `http://domain:3000/` blog类UI

3. `http://domain:3000/admin/` 管理系统或后台类UI

4. `http://domain:3000/chat/` 基于socket.io的即时通讯开发示例
---
## 安装 & 部署

### 依赖关系

1. Nodejs
2. MySQL

### 安装

1. 进入website根目录
2. 初始化nodejs依赖包 `npm install`

### 部署

1. 进入website根目录
2. 执行启动命令 `npm start`

# 更新日志 

### v0.0.1 2017年6月10日 18:25 初次建库
1. 动态表单生成，并支持自定义表单
2. 定义常规控件及表单样式
3. 集成文件上传组件
4. 集成权限管理、用户管理、角色管理模块
5. 集成日志记录及查询模块
6. 集成参数设置及数据字典管理模块
7. 集成即使通讯模块
8. 集成百度ECharts图标控件

# 示例

## 一、 Controller 定义
```javascript
module.exports = {
  // API根目录
  "rootpath": "/api/school/",
  // API定义 default为默认根目录
  "mapping": {
    "default": { "description": "获取学校列表" },
    "insert": { "description": "新增学校" },
    "update": { "description": "修改学校" },
    "delete": { "description": "删除学校" }
  },
  // 数据模型定义
  "entity": {
    // 数据表名称
    "table": "object_school",
    // 数据表对应字段名称、数据类型定义
    "columns": [
      { "name": "id", "primary": true },
      { "name": "name", "base64": true, "requid": true, "filter": "like" },
      { "name": "type", "filter": "multiple", "requid": true },
      { "name": "addr", "base64": true, "requid": true, "filter": "like" },
      { "name": "telphone", "filter": "like" },
      { "name": "describe", "base64": true, "filter": true },
      { "name": "jointime", "filter": "daterange" },
      { "name": "imgs" }
    ]
  }
}
```

```javascript
// entity.column 介绍
// name           数据表对应的字段名称
// primary        是否为数据表主键，用于增删改操作，记录操作日志时也会用到
// base64         标示数据项在传输过程中是否采用base64加密
// filter         当数据项作为查询条件时的处理方式 枚举值
//    mulitple    多数值匹配类型，常用于字典表
//    like        模糊查询
//    daterange   日期时间段 
//    true        标示数据项在查询时作为筛选条件
// requid         标示数据项在新增和修改时为必填项
// unique         标示数据项唯一
// default        方法类型,为数据项设置默认值
//    function(req,res){return string}
```

# Common API

暂无描述

## API Request & Response

1. 操作成功
```json
{
  // 操作结果 0表示成功；0其他为失败
  "c":0,
  // 返回的数据
  "data":{
    // 分页数据专有：页面大小
    "pagesize":6,
    // 分页数据专有：页面总数
    "pagecount":2,
    // 分页数据专有：记录总数
    "recordcount":7,
    // 分页数据专有：当前页码
    "pagenumber":1,
    // 列表数据专有：表示数据列表
    "list":[]
  }
}
```
2. 操作失败
```json
{
  // 操作结果
  "c":1,
  // 错误消息描述：采用base64加密
  "m":"55So5oi35ZCN5oiW5a+G56CB5LiN5q2j56Gu",
  // 调试模式专有：未加密错误描述
  "zh_cn":"用户名或密码不正确"
}
```

## 路由列表 | Routes List

  * 用户鉴权 | api/account
  * 活动管理 | api/activity
  * 动态管理 | api/article
  * 字典管理 | api/dict
  * 日志管理 | api/logs
  * 机构管理 | api/organization  
  * 学校管理 | api/school  
  * 角色管理 | api/roles
  * 参数设置 | api/settings
  * 用户管理 | api/users
  * 评论插件 | api/comment
  * 环境变量 | api/environment
  * 文件列表 | api/files
  * 文件修改 | api/files/update   [未完成]
  * 文件删除 | api/files/delete   [未完成]
  * 文件上传 | api/upload
  * 获取文件 | /file

q

## 用户鉴权 | api/account

主要功能为实现用户登录及用户注销,并且给于响应的session验证及权限验证.

方法列表

1. 用户登录
2. 用户注销

### 1.用户登录 | login

序号|类型|描述
:----|:-----:|-----:
u|string|登录账号
p|string|登录密码

```json
// /api/account/login?u=d2FuZ3hpbg%3D%3D&p=MTIzNDU2
{
  "c":0,
  "data":{
    "account":"d2FuZ3hpbg==",
    "name":"546L6ZGr",
    "nickname":"5bCP5LyN",
    "email":"YWRtaW5fc21hbGxAMTYzLmNvbQ==",
    "rolename":"57O757uf566h55CG5ZGY",
    "list":[
      "101",
      "102"
    ]
  }
}
```

### 2.用户登录 | login

序号|类型|描述
:----|:-----:|-----:
u|string|登录账号
p|string|登录密码

```json
// /api/account/logout
{"c":0}
```

/api/activity/

获取活动列表

需要权限验证
/api/activity/add

新增活动

需要权限验证
/api/activity/update

修改活动

需要权限验证
/api/activity/delete

删除活动

需要权限验证
/api/article/

获取动态列表

需要权限验证
/api/comment/

获取评论列表

需要权限验证
/api/comment/add

评论

需要权限验证
/api/comment/delete

根据评论编号,删除一条评论.

需要权限验证
/api/comment/user

根据用户编号获取该用户的全部评论

需要权限验证
/api/organization/

获取培训机构列表

需要权限验证
/api/organization/add

新增培训机构

需要权限验证
/api/organization/update

修改培训机构

需要权限验证
/api/organization/delete

删除培训机构

需要权限验证
/api/school/

获取学校列表

需要权限验证
/api/school/add

新增学校

需要权限验证
/api/school/update

修改学校

需要权限验证
/api/school/delete

删除学校

需要权限验证
/api/dict/

获取字典数据列表

需要权限验证
/api/dict/all

获取全部字典数据列表

需要权限验证
/api/dict/add

新增字典数据

需要权限验证
/api/dict/update

修改字典数据

需要权限验证
/api/dict/delete

删除字典数据

需要权限验证
/api/environment/

获取系统运行环境

需要权限验证
/api/files

获取用户拥有的文件列表

需要权限验证
/api/upload

文件上传

需要权限验证
/file

根据编号获取文件

/api/files/update

修改文件信息

需要权限验证
/api/files/delete

删除文件

需要权限验证
/api/settings/

获取全部参数信息

需要权限验证
/api/settings/read

获取设置信息

需要权限验证
/api/settings/save

保存设置信息

需要权限验证
/api/ecr/login

获取活动列表

/api/ecr/rolelist

/api/account/login

用户登录

/api/account/logout

用户注销登录

/api/account/changepwd

用户修改密码

/api/account/changeinfo

用户修改基本信息

/api/account/regist

新用户注册

/api/account/forgot

用户找回密码请求

/api/account/reset

用户重置密码

/api/logs/

获取日志列表

需要权限验证
/api/logs/types

获取日志类型类表

需要权限验证
/api/roles/

获取角色列表

需要权限验证
/api/roles/all

获取全部角色列表

/api/roles/add

新增角色

需要权限验证
/api/roles/update

修改角色

需要权限验证
/api/roles/delete

删除角色

需要权限验证
/api/users/

获取用户列表

需要权限验证
/api/users/add

新增用户

需要权限验证
/api/users/update

修改用户

需要权限验证
/api/users/delete

删除用户

需要权限验证
/api/users/info

查看用户详细信息

需要权限验证