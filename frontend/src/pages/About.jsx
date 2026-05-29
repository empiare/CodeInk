export default function About() {
  return (
    <div className="container container--narrow">
      <div className="about-content">
        <h1 className="section-header" style={{ marginTop: '2rem' }}>关于</h1>
        <div className="article-body">
          <p>
            你好，我是这个博客的作者。这里是我记录技术学习笔记、项目经验和偶尔个人思考的地方。
          </p>
          <p>
            我是一名开发者，喜欢探索新技术，也喜欢用文字整理自己的想法。
            如果你对这里的某些内容有共鸣，欢迎留言交流。
          </p>
          <h2>关于本站</h2>
          <p>
            本博客使用 React + Spring Boot 构建，文章使用 Markdown 编写，
            托管于自己的服务器上。
          </p>
        </div>
      </div>
    </div>
  );
}
