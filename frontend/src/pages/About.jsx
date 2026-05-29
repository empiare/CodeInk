import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Atom, Palette, Sparkles, Route, Globe, Shapes,
  Leaf, Database, HardDrive, Key, Shield, Zap,
  ChevronDown, Heart, Code2, BookOpen, Coffee
} from 'lucide-react';

const frontendTech = [
  { name: 'React', icon: Atom, desc: '组件化开发，高效UI渲染，构建可复用的界面组件' },
  { name: 'Tailwind CSS', icon: Palette, desc: '实用优先的CSS框架，快速实现精美设计' },
  { name: 'Framer Motion', icon: Sparkles, desc: '流畅的动画效果，提升用户体验' },
  { name: 'React Router', icon: Route, desc: '单页应用路由管理，无缝页面切换' },
  { name: 'Axios', icon: Globe, desc: 'Promise化的HTTP客户端，优雅处理API请求' },
  { name: 'Lucide React', icon: Shapes, desc: '简洁美观的图标库，视觉一致性保障' },
];

const backendTech = [
  { name: 'Spring Boot', icon: Leaf, desc: '快速开发框架，微服务架构首选' },
  { name: 'MyBatis-Plus', icon: Database, desc: '简化数据库操作，提升开发效率' },
  { name: 'MySQL', icon: HardDrive, desc: '可靠的关系型数据库，稳定存储' },
  { name: 'JWT', icon: Key, desc: '无状态认证机制，安全可靠' },
  { name: 'OAuth2', icon: Shield, desc: 'Google第三方登录，便捷安全' },
  { name: 'Redis', icon: Zap, desc: '高性能缓存，加速数据访问' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* 装饰性几何图形 */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-stone-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 text-center max-w-3xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-medium"
        >
          <Code2 size={16} />
          <span>用代码书写故事</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-stone-100 tracking-tight mb-6"
        >
          CodeInk
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-xl text-stone-600 dark:text-stone-400 leading-relaxed mb-4"
        >
          在代码的世界里，每一行都是一个故事
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-stone-500 dark:text-stone-500 max-w-xl mx-auto"
        >
          这里是我记录技术学习笔记、项目经验和偶尔个人思考的地方
        </motion.p>
      </motion.div>

      {/* 滚动指示器 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-stone-400 dark:text-stone-600"
        >
          <span className="text-xs">向下滚动</span>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}

function PhilosophySection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <BookOpen size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
                  博客的起源
                </h2>
                <div className="w-12 h-0.5 bg-amber-500 rounded-full" />
              </div>
            </div>

            <div className="space-y-4 text-stone-600 dark:text-stone-400 leading-relaxed">
              <p>
                作为一名开发者，我总是习惯用代码解决问题。但渐渐地，我发现仅仅写代码是不够的
                —— 我需要一个地方来沉淀思考，记录成长的轨迹。
              </p>
              <p>
                CodeInk 由此诞生。"Code" 代表技术，"Ink" 代表文字。
                我相信，好的技术文章不仅要有清晰的代码，更要有深入浅出的解释。
                每一篇博文，都是我与技术对话的记录。
              </p>
              <p>
                这个博客使用 React + Spring Boot 构建，文章使用 Markdown 编写。
                我选择了自己熟悉且热爱的技术栈，亲手打造了这个属于自己的数字空间。
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 text-stone-500 dark:text-stone-500">
              <Coffee size={18} />
              <span className="text-sm">写于无数个与代码相伴的深夜</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function TechStackSection({ title, subtitle, techs, iconColor = 'amber' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const colorClasses = {
    amber: {
      badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
      icon: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-500/10',
    },
    stone: {
      badge: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300',
      icon: 'text-stone-600 dark:text-stone-400',
      iconBg: 'bg-stone-100 dark:bg-stone-800',
    }
  };

  const colors = colorClasses[iconColor];

  return (
    <section className="py-16 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4 ${colors.badge}`}>
            {subtitle}
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 dark:text-stone-100">
            {title}
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {techs.map((tech) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                variants={itemVariants}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                }}
                className="glass-card rounded-2xl p-6 cursor-default transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${colors.iconBg}`}>
                    <Icon size={22} className={colors.icon} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1.5">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                      {tech.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <AnimatedSection>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 p-4 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 mb-8"
          >
            <Heart size={28} className="fill-current" />
          </motion.div>

          <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 dark:text-stone-100 mb-6">
            感谢你的到访
          </h2>

          <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
            如果你对这里的某些内容有共鸣，或者有任何问题和建议，
            欢迎在文章下方留言交流。技术的世界很大，很高兴能与你同行。
          </p>

          <div className="flex items-center justify-center gap-4">
            <div className="glass-card rounded-xl px-5 py-3 flex items-center gap-3">
              <Code2 size={18} className="text-amber-600 dark:text-amber-400" />
              <span className="text-sm text-stone-700 dark:text-stone-300">
                React + Spring Boot
              </span>
            </div>
            <div className="glass-card rounded-xl px-5 py-3 flex items-center gap-3">
              <Sparkles size={18} className="text-amber-600 dark:text-amber-400" />
              <span className="text-sm text-stone-700 dark:text-stone-300">
                持续迭代中
              </span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <div className="min-h-screen overflow-hidden">
      <div className="fixed inset-0 hero-gradient opacity-10 dark:opacity-20 pointer-events-none" />
      <HeroSection />
      <PhilosophySection />
      <TechStackSection
        title="前端技术栈"
        subtitle="构建用户界面"
        techs={frontendTech}
        iconColor="amber"
      />
      <TechStackSection
        title="后端技术栈"
        subtitle="驱动服务端"
        techs={backendTech}
        iconColor="stone"
      />
      <ClosingSection />
    </div>
  );
}
