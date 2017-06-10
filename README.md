# website
# 基于 Nodejs & Bootstrap & mysql 的快速开发框架

1. 动态表单生成，并支持自定义表单
2. 定义常规控件及表单样式
3. 集成文件上传组件
4. 集成权限管理、用户管理、角色管理模块
5. 集成日志记录及查询模块
6. 集成参数设置及数据字典管理模块
7. 集成即使通讯模块
8. 集成百度ECharts图标控件



# Common API

madan 懒得写描述了

## 路由列表 | Routes List

  * 用户鉴权 | api/account
  * 活动管理 | api/activity
  * 字典管理 | api/dict
  * 日志管理 | api/logs
  * 机构管理 | api/organization  
  * 角色管理 | api/roles
  * 参数设置 | api/settings
  * 用户管理 | api/users


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

### 2.用户登录 | login

序号|类型|描述
:----|:-----:|-----:
u|string|登录账号
p|string|登录密码


