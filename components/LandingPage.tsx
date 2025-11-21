import React from 'react';
import { ArrowRight, Play, Shield, Zap, Settings, Package, CheckCircle, Users, BarChart3, Cpu, Database, Globe } from 'lucide-react';
import ImagePlaceholder from './ImagePlaceholder';

interface LandingPageProps {
  onShowAuth?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onShowAuth }) => {
  const features = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: '智能配置',
      description: '自动化系统配置管理，简化复杂参数设置'
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: '实时模拟',
      description: '项目模拟运行，实时预览系统行为'
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: '云端存储',
      description: '基于 Supabase 的数据持久化，安全可靠'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: '团队协作',
      description: '支持多用户协作，实时同步项目进度'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '安全保障',
      description: '企业级安全策略，数据隔离保护'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: '跨平台',
      description: '支持多种设备，随时随地访问'
    }
  ];

  const demoProjects = [
    {
      id: 1,
      title: '装配线控制系统',
      description: '完整的装配生产线自动化控制方案，包含多个工位协调、物料输送和质量检测。',
      tags: ['装配线', '自动化', '质量控制'],
      metrics: {
        工位数量: '8个',
        轴数量: '12个',
        IO点数: '96点'
      }
    },
    {
      id: 2,
      title: '智能仓储系统',
      description: '现代化智能仓储管理解决方案，实现货物自动分拣、存储和检索优化。',
      tags: ['仓储管理', 'AGV控制', '库存优化'],
      metrics: {
        存储位: '500+',
        载荷: '1000kg',
        效率: '提升40%'
      }
    },
    {
      id: 3,
      title: '包装生产线',
      description: '高速包装自动化系统，支持多种包装规格，集成视觉检测和质量控制。',
      tags: ['包装自动化', '视觉检测', '质量控制'],
      metrics: {
        产能: '200包/分钟',
        精度: '±0.1mm',
        合格率: '99.8%'
      }
    }
  ];

  const stats = [
    { number: '1000+', label: '活跃项目' },
    { number: '50+', label: '企业用户' },
    { number: '99.9%', label: '系统稳定性' },
    { number: '24/7', label: '技术支持' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            自动化系统设计
            <span className="block text-primary-600">从未如此简单</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            MDKSYS 是新一代自动化系统设计平台，提供从概念设计到部署运行的全流程解决方案。
            通过直观的可视化界面和强大的仿真功能，让复杂的自动化系统设计变得简单高效。
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={onShowAuth}
              className="rounded-lg bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors flex items-center gap-2"
            >
              立即开始
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-lg border-2 border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 hover:border-gray-400 transition-colors"
            >
              查看演示
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary-600">{stat.number}</div>
                <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              核心功能特性
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              MDKSYS 提供完整的自动化系统设计工具链，满足从概念到实现的各种需求
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="rounded-lg bg-primary-600 p-2 text-white">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Demo Projects Section */}
      <section id="demo-section" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              演示项目展示
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              探索使用 MDKSYS 创建的各种自动化系统项目，了解平台在实际应用中的强大功能
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {demoProjects.map((project) => (
              <article key={project.id} className="flex flex-col items-start justify-between">
                <div className="relative w-full">
                  <ImagePlaceholder
                    width={400}
                    height={250}
                    title={project.title}
                    className="aspect-[16/10] w-full rounded-2xl sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="rounded-full bg-primary-50 px-3 py-1.5 font-medium text-primary-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-primary-600">
                      <span className="absolute inset-0" />
                      {project.title}
                    </h3>
                    <p className="mt-5 text-sm leading-6 text-gray-600 line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold text-gray-900">{value}</div>
                        <div className="text-xs text-gray-600">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              准备好开始您的自动化项目了吗？
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              加入数千名工程师的行列，使用 MDKSYS 构建创新的自动化系统。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={onShowAuth}
                className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary-600 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
              >
                立即注册
              </button>
              <button
                onClick={() => window.location.href = '/demo'}
                className="rounded-lg border-2 border-primary-400 px-6 py-3 text-base font-semibold text-white hover:border-primary-300 transition-colors"
              >
                预约演示
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;