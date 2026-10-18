export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  readingTime: string;
  content: string[];
};

export const posts: Post[] = [
  {
    slug: "getting-started-with-nextjs",
    title: "Getting Started with Next.js",
    excerpt:
      "了解如何使用 create-next-app 快速搭建项目,认识 App Router 的目录约定,并完成你的第一个页面。",
    date: "2026 年 6 月 28 日",
    tag: "教程",
    readingTime: "5 分钟",
    content: [
      "Next.js 是由 Vercel 维护的 React 全栈框架,内置路由、渲染策略、数据获取与构建优化,适合从静态站点到复杂全栈应用的各种场景。",
      "使用 create-next-app 可以一键生成项目脚手架,默认采用 App Router 目录约定:app 目录下的文件会被映射为路由,page.tsx 定义可访问的路由,layout.tsx 定义共享布局。",
      "创建第一个页面时,只需在 app 目录下新增 page.tsx 并导出一个 React 组件即可。结合 Server Components,你可以在组件内部直接读取数据库或调用内部 API,无需额外的 fetch 层。",
      "开发时运行 npm run dev 启动开发服务器,支持热更新与快速刷新;构建时使用 next build 生成生产产物,可由 next start 或任意 Node 宿主运行。",
    ],
  },
  {
    slug: "understanding-react-server-components",
    title: "理解 React Server Components",
    excerpt:
      "Server Components 默认在服务端渲染,带来更小的客户端 bundle 和更接近数据源的开发体验。本文带你理清它与 Client Components 的关系。",
    date: "2026 年 7 月 2 日",
    tag: "原理",
    readingTime: "8 分钟",
    content: [
      "React Server Components(RSC)是 React 18 引入的能力,组件默认在服务端执行,可以直接访问文件系统、数据库和内部服务,而不会把相关代码打包进客户端 bundle。",
      "在 Next.js 的 App Router 中,所有组件默认都是 Server Components。如果某个组件需要交互、状态或浏览器 API(如 useState、useEffect、onClick),就要显式声明为 Client Component,即在文件顶部加上 'use client' 指令。",
      "Server 与 Client 之间存在边界:Server Components 可以渲染 Client Components,但 Client Components 不能直接 import Server Components。需要把 Server Components 作为 children 传入,这是常见的组合模式。",
      "数据获取更适合放在 Server Components 中完成:可以在组件内直接 await 数据库查询,无需手写 API 路由。这样既减少了请求往返,又避免了敏感逻辑泄露到客户端。",
      "理解 RSC 的关键是:它不是要取代 Client Components,而是把「获取数据 + 渲染静态结构」这部分职责移到服务端,让客户端只负责真正需要交互的部分。",
    ],
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
