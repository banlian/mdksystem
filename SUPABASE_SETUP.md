## MDKSYS - Web自动化系统设计平台

### 概述
MDKSYS是一个基于Web的自动化系统设计平台，采用Next.js 14 + Supabase技术栈，为工业自动化项目提供完整的设计、配置与管理解决方案。平台支持用户认证、项目持久化存储、实时协作和云端同步。

### 核心功能
- **用户认证系统**：用户注册、登录、会话管理
- **项目管理**：创建、编辑、删除、导入导出项目
- **可视化项目设计**：基于React Flow的工位布局设计
- **全面的配置系统**：
  - **IO配置**：数字输入/输出 (DI/DO)、模拟输入/输出 (AI/AO)、信号配置
  - **轴配置**：X/Y/Z/A/B/C六轴运动控制参数
  - **工位配置**：工作站布局和IO/轴关联
  - **任务配置**：序列化任务管理（移动、IO操作、等待、条件判断）
- **项目模拟运行**：在线模拟验证设计正确性
- **云端数据存储**：基于Supabase的安全数据存储和同步

### Supabase 后端配置

#### 项目信息
- **Project URL**: https://vedqaqbovzeutdimcucw.supabase.co
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZHFhcWJvdnpldXRkaW1jdWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDQ3NzUsImV4cCI6MjA3OTIyMDc3NX0.8Pdx8kWwZ4vQOOoETw1dcIyBL4NNFadoldgftmlK1QI`
- **数据库连接**: `postgresql://postgres:[YOUR_PASSWORD]@db.vedqaqbovzeutdimcucw.supabase.co:5432/postgres`

#### 环境变量配置
创建 `.env.local` 文件：
```env
NEXT_PUBLIC_SUPABASE_URL=https://vedqaqbovzeutdimcucw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZHFhcWJvdnpldXRkaW1jdWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDQ3NzUsImV4cCI6MjA3OTIyMDc3NX0.8Pdx8kWwZ4vQOOoETw1dcIyBL4NNFadoldgftmlK1QI
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 技术架构
- **前端**：Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **状态管理**：Zustand
- **数据库**：PostgreSQL (Supabase)
- **认证**：Supabase Auth
- **UI组件**：React Flow + Lucide React
- **实时同步**：Supabase Realtime

### 安装和运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问应用
# http://localhost:3000
```

### 使用流程

#### 1. 用户注册/登录
- 首次使用需要注册账户
- 支持邮箱+密码认证
- 自动创建用户配置文件

#### 2. 项目管理
- 创建新项目：项目列表页点击"新建项目"
- 打开现有项目：点击项目卡片中的"打开项目"
- 删除项目：项目卡片中的删除按钮
- 导出项目：设计器页面的导出功能

#### 3. 项目设计流程
1. **工位布局设计**：在"项目设计"标签页中拖拽创建工位
2. **IO配置**：在"项目配置"中配置数字/模拟IO点
3. **轴配置**：设置运动轴参数和限制
4. **工位关联**：将IO和轴配置关联到具体工位
5. **任务配置**：创建自动化任务序列
6. **模拟运行**：在"模拟运行"中验证设计

#### 4. 数据保存
- 所有操作自动保存到本地状态
- 点击"保存项目"按钮同步到云端
- 支持导出JSON格式文件备份

### 数据库架构

#### 主要表结构
- **users**：用户基础信息
- **projects**：项目主表
- **io_configs**：IO配置表
- **axis_configs**：轴配置表
- **station_configs**：工位配置表
- **task_configs**：任务配置表
- **task_steps**：任务步骤表

#### 安全特性
- 行级安全（RLS）：用户只能访问自己的数据
- JWT认证：基于Supabase Auth的安全令牌
- 数据验证：前端和后端双重数据校验

### 项目结构
```
├── app/                    # Next.js App Router
├── components/             # React组件
│   ├── Auth/              # 认证相关组件
│   ├── ConfigurationPanel.tsx
│   ├── ProjectDesigner.tsx
│   └── SimulationPanel.tsx
├── lib/                   # 工具库
│   └── supabase/          # Supabase集成
├── store/                 # Zustand状态管理
├── types/                 # TypeScript类型定义
└── supabase/migrations/   # 数据库迁移文件
```

### 相关文档
- [Supabase API文档](https://supabase.com/docs/guides/api)
- [MCP连接](https://mcp.supabase.com/mcp?project_ref=vedqaqbovzeutdimcucw)
- [React Flow文档](https://reactflow.dev/)