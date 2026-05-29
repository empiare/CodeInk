import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default function MarkdownRenderer({ content }) {
  return (
    <div className="article-body">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => <h1 id={slugify(props.children?.toString() || '')} {...props} />,
          h2: ({ node, ...props }) => <h2 id={slugify(props.children?.toString() || '')} {...props} />,
          h3: ({ node, ...props }) => <h3 id={slugify(props.children?.toString() || '')} {...props} />,
          h4: ({ node, ...props }) => <h4 id={slugify(props.children?.toString() || '')} {...props} />,
          h5: ({ node, ...props }) => <h5 id={slugify(props.children?.toString() || '')} {...props} />,
          h6: ({ node, ...props }) => <h6 id={slugify(props.children?.toString() || '')} {...props} />,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}