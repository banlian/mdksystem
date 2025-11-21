
## 1. mdksys（Web系统设计平台）

### 1.1 概述
mdksys是一个基于Web的自动化系统设计平台，采用现代化的前端技术栈和微服务架构，旨在简化工业自动化项目的设计、配置与管理流程。通过模块化设计，支持多种工业协议和设备类型，满足不同应用场景的需求。

### 1.2 核心功能
- **项目设计**：可视化项目设计 
- **项目模拟运行**：在线模拟项目运行，验证设计正确性


### 1.3项目配置
- io配置 di/do/signal/ai/ao
- axis配置
- station配置
- task配置


### superbase 作为后端
project url 
https://vedqaqbovzeutdimcucw.supabase.co

apikey:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZHFhcWJvdnpldXRkaW1jdWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDQ3NzUsImV4cCI6MjA3OTIyMDc3NX0.8Pdx8kWwZ4vQOOoETw1dcIyBL4NNFadoldgftmlK1QI



NEXT_PUBLIC_SUPABASE_URL=https://vedqaqbovzeutdimcucw.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_cGZUKaMg_t-8rQYbihY8wQ_Hx_5YarU


sample:
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vedqaqbovzeutdimcucw.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

https://supabase.com/docs/guides/api

postgresql://postgres:[YOUR_PASSWORD]@db.vedqaqbovzeutdimcucw.supabase.co:5432/postgres

https://mcp.supabase.com/mcp?project_ref=vedqaqbovzeutdimcucw

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问应用
# http://localhost:3000


### 用户注册与登录功能


###  创建项目功能


### 数据库设计

### 项目表 `projects`

| 字段 | 类型 | 说明 | 约束 |
| --- | --- | --- | --- |
| id | uuid | 项目唯一标识 | PK，default uuid_generate_v4() |
| name | text | 项目名称 | not null，unique per tenant |
| code | text | 项目编码 | not null |
| description | text | 项目描述 |  |
| owner_id | uuid | 创建者 | references auth.users(id) |
| status | text | `draft`/`review`/`released` | default `draft` |
| created_at | timestamptz | 创建时间 | default now() |
| updated_at | timestamptz | 更新时间 | default now() |

### 设备模块表 `device_modules`

| 字段 | 类型 | 说明 | 约束 |
| --- | --- | --- | --- |
| id | uuid | 模块唯一标识 | PK |
| project_id | uuid | 所属项目 | FK → projects.id，cascade delete |
| name | text | 模块名称 | not null |
| module_type | text | 如 `robot`, `conveyor`, `vision` | not null |
| io_profile | jsonb | IO 配置模板 | default '{}'::jsonb |
| axis_count | int2 | 轴数量 | default 0 |
| metadata | jsonb | 自定义扩展字段 | default '{}'::jsonb |
| created_at | timestamptz | 创建时间 | default now() |
| updated_at | timestamptz | 更新时间 | default now() |

### 设备组件表 `device_components`

| 字段 | 类型 | 说明 | 约束 |
| --- | --- | --- | --- |
| id | uuid | 组件唯一标识 | PK |
| module_id | uuid | 所属设备模块 | FK → device_modules.id |
| name | text | 组件名称 | not null |
| component_type | text | 组件类型（驱动、传感器等） | not null |
| config | jsonb | 组件参数配置 | default '{}'::jsonb |
| position | int2 | 在模块中的排序 | default 0 |
| status | text | `inactive`/`active` | default `inactive` |
| created_at | timestamptz | 创建时间 | default now() |
| updated_at | timestamptz | 更新时间 | default now() |

### 界面组件表 `ui_components`

| 字段 | 类型 | 说明 | 约束 |
| --- | --- | --- | --- |
| id | uuid | 组件唯一标识 | PK |
| project_id | uuid | 所属项目 | FK → projects.id |
| name | text | 组件名称 | not null |
| ui_type | text | 组件类型（画布、控件等） | not null |
| props | jsonb | 属性配置（颜色、尺寸等） | default '{}'::jsonb |
| layout | jsonb | 布局信息（位置、层级） | default '{}'::jsonb |
| events | jsonb | 交互事件映射 | default '[]'::jsonb |
| created_at | timestamptz | 创建时间 | default now() |
| updated_at | timestamptz | 更新时间 | default now() |

### 工艺流程任务组件表 `process_tasks`

| 字段 | 类型 | 说明 | 约束 |
| --- | --- | --- | --- |
| id | uuid | 任务唯一标识 | PK |
| project_id | uuid | 所属项目 | FK → projects.id |
| name | text | 任务名称 | not null |
| task_type | text | 任务类型（装配、检测等） | not null |
| sequence | int2 | 执行顺序 | default 0 |
| prerequisites | uuid[] | 前置任务 | default '{}'::uuid[] |
| logic | jsonb | 任务逻辑/脚本 | default '{}'::jsonb |
| bound_module_ids | uuid[] | 绑定设备模块 | default '{}'::uuid[] |
| created_at | timestamptz | 创建时间 | default now() |
| updated_at | timestamptz | 更新时间 | default now() |

### 视觉组件表 `vision_components`

| 字段 | 类型 | 说明 | 约束 |
| --- | --- | --- | --- |
| id | uuid | 视觉组件唯一标识 | PK |
| module_id | uuid | 所属设备模块或视觉单元 | FK → device_modules.id |
| name | text | 视觉组件名称 | not null |
| camera_model | text | 相机型号 |  |
| lens | text | 镜头参数 |  |
| pipeline | jsonb | 视觉算法流水线配置 | default '{}'::jsonb |
| calibration | jsonb | 标定数据 | default '{}'::jsonb |
| output_channels | jsonb | 输出信号/数据定义 | default '[]'::jsonb |
| created_at | timestamptz | 创建时间 | default now() |
| updated_at | timestamptz | 更新时间 | default now() |

