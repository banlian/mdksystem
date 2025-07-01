import { FloatingNav } from '../components/FloatingNav';
import { ScrollProgress } from '../components/ScrollProgress';
import { ScrollToTop } from '../components/ScrollToTop';
import { Meta } from '../layout/Meta';
import { AppConfig } from '../utils/AppConfig';
import { Banner } from './Banner';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { VerticalFeatures } from './VerticalFeatures';

const TechnologyStack = () => (
  <section className="flex min-h-screen items-center">
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Built with Modern Technology
        </h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-600">
          MDK System leverages cutting-edge web technologies to deliver a
          powerful, scalable, and maintainable industrial automation platform.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div className="text-center">
          <div className="industrial-card p-6">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-lg bg-blue-100">
              <svg
                className="size-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Next.js 13+
            </h3>
            <p className="text-sm text-gray-600">React Framework</p>
          </div>
        </div>

        <div className="text-center">
          <div className="industrial-card p-6">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-lg bg-blue-100">
              <svg
                className="size-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              React 18+
            </h3>
            <p className="text-sm text-gray-600">UI Library</p>
          </div>
        </div>

        <div className="text-center">
          <div className="industrial-card p-6">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-lg bg-blue-100">
              <svg
                className="size-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              TypeScript 5+
            </h3>
            <p className="text-sm text-gray-600">Type Safety</p>
          </div>
        </div>

        <div className="text-center">
          <div className="industrial-card p-6">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-lg bg-blue-100">
              <svg
                className="size-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Tailwind CSS
            </h3>
            <p className="text-sm text-gray-600">Styling Framework</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Base = () => (
  <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-gray-600 antialiased">
    <Meta title={AppConfig.title} description={AppConfig.description} />
    <ScrollProgress />
    <section id="home" className="min-h-screen">
      <Hero />
    </section>
    <section id="features" className="min-h-screen">
      <VerticalFeatures />
    </section>
    <section id="technology" className="min-h-screen">
      <TechnologyStack />
    </section>
    <section id="cta" className="min-h-screen">
      <Banner />
    </section>
    <div id="footer">
      <Footer />
    </div>
    <FloatingNav />
    <ScrollToTop />
  </div>
);

export { Base };
