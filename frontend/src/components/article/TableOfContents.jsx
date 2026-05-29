import { useState, useEffect, useCallback, useMemo } from 'react';
import { List, X } from 'lucide-react';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default function TableOfContents({ content }) {
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const headings = useMemo(() => {
    if (!content) return [];

    const contentWithoutCode = content.replace(/```[\s\S]*?```/g, '');
    const regex = /^(#{1,6})\s+(.+)$/gm;
    const items = [];
    let match;
    let index = 0;

    while ((match = regex.exec(contentWithoutCode)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = slugify(text) || `heading-${index}`;
      items.push({ id, text, level });
      index++;
    }

    return items;
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      }
    );

    const timeout = setTimeout(() => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [headings]);

  const handleClick = useCallback((e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
      setActiveId(id);
      setIsOpen(false);
    }
  }, []);

  if (headings.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-30 w-10 h-10 rounded-full bg-amber-600 dark:bg-amber-500 text-white shadow-lg flex items-center justify-center hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors"
        aria-label="目录"
      >
        <List size={18} />
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="hidden lg:block fixed top-16 left-8 z-40 h-[calc(100vh-5rem)] w-72 bg-white dark:bg-stone-900 border-r border-stone-100 dark:border-stone-800 rounded-2xl mt-4 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="p-4 pb-3 border-b border-stone-100 dark:border-stone-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              目录
            </h4>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 pt-3">
            <ul className="space-y-1 border-l border-stone-200/60 dark:border-stone-800/60">
              {headings.map(({ id, text, level }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => handleClick(e, id)}
                    className={`
                      block text-[13px] leading-relaxed py-1.5 transition-colors duration-200 no-underline hover:no-underline border-l-2 -ml-[1px]
                      ${level === 1 ? 'pl-3 font-medium' : ''}
                      ${level === 2 ? 'pl-3' : ''}
                      ${level === 3 ? 'pl-6' : ''}
                      ${level === 4 ? 'pl-8' : ''}
                      ${level >= 5 ? 'pl-10' : ''}
                      ${
                        activeId === id
                          ? 'border-amber-600 dark:border-amber-400 text-amber-700 dark:text-amber-400'
                          : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:border-stone-300 dark:hover:border-stone-600'
                      }
                    `}
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div
        className={`
          lg:hidden fixed top-16 left-8 z-40 h-[calc(100vh-5rem)] w-72 mt-4 rounded-2xl
          bg-white dark:bg-stone-900
          shadow-xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 pb-3 border-b border-stone-100 dark:border-stone-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              目录
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
            >
              <X size={16} />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 pt-3">
            <ul className="space-y-1 border-l border-stone-200/60 dark:border-stone-800/60">
              {headings.map(({ id, text, level }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => handleClick(e, id)}
                    className={`
                      block text-[13px] leading-relaxed py-1.5 transition-colors duration-200 no-underline hover:no-underline border-l-2 -ml-[1px]
                      ${level === 1 ? 'pl-3 font-medium' : ''}
                      ${level === 2 ? 'pl-3' : ''}
                      ${level === 3 ? 'pl-6' : ''}
                      ${level === 4 ? 'pl-8' : ''}
                      ${level >= 5 ? 'pl-10' : ''}
                      ${
                        activeId === id
                          ? 'border-amber-600 dark:border-amber-400 text-amber-700 dark:text-amber-400'
                          : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:border-stone-300 dark:hover:border-stone-600'
                      }
                    `}
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}