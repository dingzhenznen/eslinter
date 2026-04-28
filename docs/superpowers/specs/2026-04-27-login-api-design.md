# 登录接口设计

## 目标

为现有登录页面添加一个真实的服务端登录接口，使用 JWT 和 HTTP-only cookie 维护登录态。

## 范围

本次只覆盖：

- 新增 `POST /api/login`
- 校验固定凭据 `admin / 123456`
- 成功后签发 JWT 并写入 HTTP-only cookie
- 前端登录表单改为调用该接口
- 保持现有 Toast 和成功跳转行为

本次不覆盖：

- 注册
- 登出
- 刷新 token
- 受保护路由
- 数据库用户系统

## 现状

- 当前登录页在客户端模拟登录成功和失败。
- `LoginForm` 已经具备表单校验、加载态和 Toast。
- `/login` 页面当前将固定凭据逻辑写在页面组件内部。

这意味着当前缺的是服务端认证边界，而不是表单交互本身。

## 方案选择

采用 `HTTP-only cookie + 服务端签发 JWT`。

原因：

- 前端不直接持有 token，边界更清晰。
- 更适合 Next.js App Router 后续扩展服务端鉴权。
- 对当前项目足够简单，不需要引入外部认证系统。

不采用以下方案：

- 前端自行保存 token：实现直，但安全边界较差。
- 同时返回 token 和写 cookie：对当前需求过度设计。

## 接口设计

### 路由

- 文件：`src/app/api/login/route.ts`
- 方法：`POST`

### 请求体

```json
{
  "username": "admin",
  "password": "123456"
}
```

### 成功响应

状态码：`200`

```json
{
  "success": true,
  "user": {
    "username": "admin"
  }
}
```

同时写入 cookie：

- 名称：`auth_token`
- `httpOnly: true`
- `sameSite: 'lax'`
- `path: '/'`
- `secure`: 生产环境为 `true`，本地开发为 `false`
- `maxAge`: 7 天

### 失败响应

参数错误：

- 状态码：`400`
- 响应体：

```json
{
  "success": false,
  "message": "用户名和密码不能为空"
}
```

认证失败：

- 状态码：`401`
- 响应体：

```json
{
  "success": false,
  "message": "用户名或密码错误"
}
```

### JWT 内容

JWT payload 只保留当前需求所需的最小信息：

```json
{
  "username": "admin"
}
```

签名密钥来自环境变量：

- `JWT_SECRET`

若环境变量缺失，接口返回 `500`，并给出统一错误消息。不会在响应中暴露内部细节。

## 前端行为

`LoginForm` 的提交流程改为：

1. 通过 `fetch('/api/login', { method: 'POST' ... })` 提交用户名和密码。
2. 当响应为 `200` 时，显示“登录成功” Toast。
3. 当响应为 `401` 或 `400` 时，显示接口返回的错误消息；如果消息不可用，则回退为“登录失败，请重试”。
4. 成功后按现有逻辑延迟跳转到 `/`。

`/login` 页面不再直接承担凭据校验逻辑，只保留成功跳转逻辑。

## 架构边界

职责拆分如下：

- `src/app/api/login/route.ts`
  负责请求解析、凭据校验、JWT 签发、cookie 写入、JSON 响应。

- `src/components/login/LoginForm.tsx`
  负责发起登录请求、消费接口返回结果、展示 Toast。

- `src/app/login/page.tsx`
  负责页面布局和登录成功后的导航。

这样可以避免把认证逻辑继续塞在页面组件里，也避免让表单组件直接承担 cookie/JWT 细节。

## 测试策略

至少覆盖：

- Route handler：
  - 正确凭据返回 `200`
  - 错误凭据返回 `401`
  - 空用户名或密码返回 `400`
  - 成功响应包含 `Set-Cookie`

- 前端：
  - `LoginForm` 成功时显示成功 Toast
  - `LoginForm` 失败时显示接口错误消息
  - 提交时正确调用 `/api/login`

## 风险与约束

- 当前认证源是固定凭据，只适合本地演示和当前阶段开发。
- JWT 一旦签发，后续如果增加鉴权中间件，需要统一读取 `auth_token`。
- 需要新增 `jsonwebtoken` 及其类型依赖。
- 需要为本地开发准备 `JWT_SECRET`，否则接口无法正常签发 token。

## 后续扩展

这个设计为以下功能留出明确演进路径：

- `/api/logout`
- 中间件鉴权
- 基于 cookie 的用户信息读取
- 替换固定凭据为数据库或外部身份源
