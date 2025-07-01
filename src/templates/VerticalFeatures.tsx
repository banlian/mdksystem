import { Section } from '../layout/Section';

const VerticalFeatures = () => (
  <div className="flex min-h-screen items-center">
    <div className="w-full">
      <Section
        title="Powerful Features for Industrial Automation"
        description="Everything you need to build robust, scalable, and maintainable industrial automation solutions"
      >
        {/* Feature Grid Layout */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Modular Architecture */}
          <div className="industrial-card p-8">
            <div className="mb-4 flex items-center">
              <div className="mr-4 flex size-12 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="size-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Modular Architecture
              </h3>
            </div>
            <p className="mb-4 text-gray-600">
              Component-based design with configurable modules for all machine
              components including Digital Inputs/Outputs (DI/DO), Motion
              Control Axes, Custom Modules, Workstations, and Task Management.
            </p>
            <ul className="space-y-1 text-sm text-gray-500">
              <li>• Digital Inputs/Outputs (DI/DO)</li>
              <li>• Motion Control Axes</li>
              <li>• Custom Modules</li>
              <li>• Workstations</li>
              <li>• Task Management</li>
            </ul>
          </div>

          {/* Rapid Development */}
          <div className="industrial-card p-8">
            <div className="mb-4 flex items-center">
              <div className="mr-4 flex size-12 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="size-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Rapid Development
              </h3>
            </div>
            <p className="mb-4 text-gray-600">
              Develop and test tasks with real-time simulation, intuitive
              drag-and-drop interface for workflow design, and instant feedback
              during development cycles with hot reload.
            </p>
            <ul className="space-y-1 text-sm text-gray-500">
              <li>• Real-time Simulation</li>
              <li>• Drag-and-Drop Interface</li>
              <li>• Workflow Design</li>
              <li>• Hot Reload</li>
              <li>• Instant Feedback</li>
            </ul>
          </div>

          {/* Rich UI Components */}
          <div className="industrial-card p-8">
            <div className="mb-4 flex items-center">
              <div className="mr-4 flex size-12 items-center justify-center rounded-lg bg-purple-100">
                <svg
                  className="size-6 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Rich UI Components
              </h3>
            </div>
            <p className="mb-4 text-gray-600">
              Extensive collection of pre-built components with responsive
              design that works seamlessly across desktop and mobile devices,
              plus customizable appearance and branding.
            </p>
            <ul className="space-y-1 text-sm text-gray-500">
              <li>• Pre-built Components</li>
              <li>• Responsive Design</li>
              <li>• Cross-platform Support</li>
              <li>• Customizable Themes</li>
              <li>• Brand Integration</li>
            </ul>
          </div>

          {/* Scalable Framework */}
          <div className="industrial-card p-8">
            <div className="mb-4 flex items-center">
              <div className="mr-4 flex size-12 items-center justify-center rounded-lg bg-orange-100">
                <svg
                  className="size-6 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Scalable Framework
              </h3>
            </div>
            <p className="mb-4 text-gray-600">
              Easy to extend and customize with modular design, plugin
              architecture for adding new functionality without core
              modifications, and API-first approach with RESTful APIs for
              integration.
            </p>
            <ul className="space-y-1 text-sm text-gray-500">
              <li>• Plugin Architecture</li>
              <li>• Modular Design</li>
              <li>• API-first Approach</li>
              <li>• RESTful APIs</li>
              <li>• Easy Extension</li>
            </ul>
          </div>
        </div>

        {/* Additional Features Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="p-6 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="size-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-semibold text-gray-900">
              Quality Assurance
            </h4>
            <p className="text-sm text-gray-600">
              Built-in testing and validation tools for reliable industrial
              automation systems.
            </p>
          </div>

          <div className="p-6 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="size-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-semibold text-gray-900">
              High Performance
            </h4>
            <p className="text-sm text-gray-600">
              Optimized for real-time industrial applications with minimal
              latency.
            </p>
          </div>

          <div className="p-6 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-purple-100">
              <svg
                className="size-8 text-purple-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-semibold text-gray-900">
              Enterprise Security
            </h4>
            <p className="text-sm text-gray-600">
              Industrial-grade security features for protecting critical
              automation systems.
            </p>
          </div>
        </div>
      </Section>
    </div>
  </div>
);

export { VerticalFeatures };
