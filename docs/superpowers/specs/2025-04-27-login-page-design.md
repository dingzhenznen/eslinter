# 登录页面设计文档

## 项目背景
基于 Next.js 16 + TypeScript + Tailwind CSS 的前端项目，需要开发一个独立的登录页面。

## 需求摘要
- **类型**: 纯前端登录界面（连接外部 API 或 mock 数据）
- **表单字段**: 用户名 + 密码
- **功能**: 表单验证、显示/隐藏密码、加载状态、成功/失败提示
- **风格**: 现代简约（圆角、柔和阴影、渐变按钮）

## 架构设计

### 路由结构
```
src/
├── app/
│   ├── login/
│   │   └── page.tsx          # 登录页面
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 首页
└── components/
    ├── login/
    │   ├── LoginForm.tsx     # 登录表单组件
    │   ├── PasswordInput.tsx # 密码输入框（带显示/隐藏）
    │   └── useLoginForm.ts   # 表单逻辑 hook
    └── ui/
        └── Toast.tsx         # 提示组件
```

### 组件职责
| 组件 | 职责 |
|------|------|
| `LoginForm` | 表单 UI、验证逻辑、提交处理 |
| `PasswordInput` | 封装密码输入 + 显隐切换 |
| `useLoginForm` | 表单状态、验证规则、提交回调 |
| `Toast` | 全局提示组件 |

## 页面布局

### 视觉设计
- 全屏居中布局，浅灰背景（`bg-zinc-50`）
- 白色卡片，圆角（`rounded-2xl`），柔和阴影（`shadow-xl`）
- 卡片最大宽度 400px，内边距充足（`p-8`）

### 页面结构
```
/login 页面
├── 居中的登录卡片
│   ├── 标题区域（Logo/标题）
│   ├── 表单区域
│   │   ├── 用户名输入框
│   │   ├── 密码输入框（带显隐切换）
│   │   └── 登录按钮
│   └── 底部链接（忘记密码）
```

## 表单功能

### 字段验证规则
| 字段 | 规则 | 错误提示 |
|------|------|----------|
| 用户名 | 必填，3-20字符 | "请输入用户名" / "用户名需3-20个字符" |
| 密码 | 必填，最少6字符 | "请输入密码" / "密码至少6个字符" |

### 交互流程
1. 用户输入时实时清除该字段错误
2. 失去焦点（blur）时验证该字段
3. 点击登录时验证全部字段
4. 验证通过 → 显示加载状态 → 模拟 API 调用（1秒延迟）→ Toast 提示结果

### 视觉状态
- **输入框聚焦**: 蓝色边框（`ring-2 ring-blue-500`）
- **错误状态**: 红色边框 + 下方红色错误文字
- **加载状态**: 按钮禁用，显示 Spinner 动画
- **成功提示**: 绿色 Toast，2秒后自动跳转首页
- **失败提示**: 红色 Toast，显示错误信息

## 组件接口

### LoginForm Props
```typescript
interface LoginFormProps {
  onSuccess?: () => void;  // 登录成功回调
}
```

### useLoginForm Return
```typescript
interface UseLoginFormReturn {
  username: string;
  password: string;
  errors: {
    username?: string;
    password?: string;
  };
  isLoading: boolean;
  isVisible: boolean;  // 密码是否可见
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  toggleVisibility: () => void;
  handleSubmit: (e: FormEvent) => void;
}
```

## 测试策略
- `LoginForm` 组件渲染测试
- 表单验证逻辑测试
- 密码显隐切换测试
- 提交流程测试

## 技术约束
- 无需额外 npm 依赖
- 使用 React 原生 hooks
- Tailwind CSS 样式
- 符合现有 ESLint 规则
