# MDKSYS 项目设置指南

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问应用

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目功能

### 🎨 项目设计
- 可视化工位设计
- 拖拽式工位布局
- 工位属性配置

### ⚙️ 项目配置
- **IO配置**: 数字输入/输出、模拟输入/输出、信号配置
- **轴配置**: 运动轴参数和限制配置
- **工位配置**: 工位与IO、轴的关联配置
- **任务配置**: 任务序列和步骤配置

### 🚀 模拟运行
- 在线项目模拟
- 实时运行日志
- 可调节运行速度

### 📤 配置导出
- 一键导出JSON配置文件
- 包含所有项目配置信息
- 支持项目备份和迁移

## 使用流程

1. **创建项目**: 在项目设计页面添加工位
2. **配置参数**: 在项目配置页面设置IO、轴、工位、任务
3. **模拟验证**: 在模拟运行页面测试项目
4. **导出配置**: 点击导出按钮保存配置文件

## 技术特性

- ✅ Next.js 14 + TypeScript
- ✅ Tailwind CSS 响应式设计
- ✅ Zustand 状态管理
- ✅ 模块化组件架构
- ✅ 实时数据同步
- ✅ JSON配置导出

## 开发说明

### 项目结构
```
mdksys-web/
├── app/                 # Next.js App Router
├── components/          # React组件
├── store/              # 状态管理
├── types/              # TypeScript类型
└── README.md           # 项目文档
```

### 自定义开发
- 修改 `types/project.ts` 扩展数据类型
- 更新 `store/projectStore.ts` 添加状态逻辑
- 在 `components/` 中创建新组件
- 使用 Tailwind CSS 进行样式定制

## 故障排除

### 常见问题

1. **依赖安装失败**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript错误**
   ```bash
   npm run build
   ```

3. **端口占用**
   ```bash
   npm run dev -- -p 3001
   ```

## 支持

如有问题，请查看：
- [Next.js文档](https://nextjs.org/docs)
- [Tailwind CSS文档](https://tailwindcss.com/docs)
- [Zustand文档](https://github.com/pmndrs/zustand)
