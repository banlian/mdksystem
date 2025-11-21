# MDKSYS - 自动化系统设计平台

基于Next.js的Web自动化系统设计平台，支持项目配置和模拟运行。

## 功能特性

- **项目设计**: 可视化项目设计界面
- **项目配置**: 
  - IO配置 (数字输入/输出、模拟输入/输出、信号配置)
  - 轴配置 (运动轴参数配置)
  - 工位配置 (工位IO和轴配置关联)
  - 任务配置 (任务序列和步骤配置)
- **项目模拟运行**: 在线模拟项目运行，验证设计正确性
- **配置导出**: 支持导出项目配置文件为JSON格式

## 技术栈

- **前端框架**: Next.js 14
- **UI组件**: React + TypeScript
- **状态管理**: Zustand
- **样式**: Tailwind CSS
- **图标**: Lucide React

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
mdksys-web/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React组件
│   ├── ConfigurationPanel.tsx    # 配置面板
│   ├── IOConfiguration.tsx       # IO配置组件
│   ├── AxisConfiguration.tsx     # 轴配置组件
│   ├── StationConfiguration.tsx   # 工位配置组件
│   ├── TaskConfiguration.tsx    # 任务配置组件
│   ├── ProjectDesigner.tsx      # 项目设计器
│   ├── SimulationPanel.tsx      # 模拟运行面板
│   └── ExportButton.tsx          # 导出按钮
├── store/                 # 状态管理
│   └── projectStore.ts    # 项目状态存储
├── types/                 # TypeScript类型定义
│   └── project.ts         # 项目相关类型
└── package.json           # 项目配置
```

## 使用说明

### 1. 项目设计
- 在"项目设计"标签页中，可以添加和配置工位
- 点击"添加工位"按钮创建新的工位
- 工位可以在画布上拖拽定位

### 2. 项目配置
- **IO配置**: 配置数字输入/输出、模拟输入/输出和信号
- **轴配置**: 配置运动轴的参数和限制
- **工位配置**: 关联IO和轴配置到具体工位
- **任务配置**: 配置任务序列和步骤

### 3. 模拟运行
- 在"模拟运行"标签页中，可以启动项目模拟
- 支持调整运行速度
- 实时查看模拟日志和运行状态

### 4. 导出配置
- 点击右上角"导出配置"按钮
- 系统会生成包含所有配置的JSON文件
- 文件名格式: `mdk-project-YYYY-MM-DD.json`

## 配置数据结构

导出的JSON文件包含以下结构：

```json
{
  "id": "项目ID",
  "name": "项目名称",
  "description": "项目描述",
  "version": "版本号",
  "createdAt": "创建时间",
  "updatedAt": "更新时间",
  "ioConfigs": [
    {
      "id": "IO配置ID",
      "name": "IO名称",
      "type": "DI|DO|AI|AO|SIGNAL",
      "address": "IO地址",
      "description": "描述",
      "enabled": true
    }
  ],
  "axisConfigs": [
    {
      "id": "轴配置ID",
      "name": "轴名称",
      "type": "X|Y|Z|A|B|C",
      "maxSpeed": 100,
      "acceleration": 50,
      "deceleration": 50,
      "homePosition": 0,
      "softLimitMin": -1000,
      "softLimitMax": 1000,
      "enabled": true
    }
  ],
  "stationConfigs": [
    {
      "id": "工位配置ID",
      "name": "工位名称",
      "position": {"x": 100, "y": 100},
      "ioConfigs": ["IO配置ID列表"],
      "axisConfigs": ["轴配置ID列表"],
      "description": "描述",
      "enabled": true
    }
  ],
  "taskConfigs": [
    {
      "id": "任务配置ID",
      "name": "任务名称",
      "stationId": "关联工位ID",
      "sequence": [
        {
          "id": "步骤ID",
          "type": "MOVE|IO|WAIT|CONDITION",
          "parameters": {},
          "description": "步骤描述"
        }
      ],
      "priority": 1,
      "enabled": true
    }
  ]
}
```

## 开发说明

### 添加新功能
1. 在 `types/project.ts` 中定义相关类型
2. 在 `store/projectStore.ts` 中添加状态管理逻辑
3. 创建对应的React组件
4. 在主页面中集成新组件

### 自定义样式
- 使用Tailwind CSS类名进行样式定制
- 在 `tailwind.config.js` 中扩展主题配置
- 在 `app/globals.css` 中添加全局样式

## 许可证

MIT License
