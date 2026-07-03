import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Next.js",
  description: "Learn about Next.js, the React framework for the web.",
};

export default function About() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start gap-10">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={120}
          height={24}
          priority
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50">
            About Next.js
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Next.js 是由 Vercel 开发维护的 React 全栈框架,让开发者能够使用一套技术栈构建从静态内容展示到复杂数据交互的各类 Web 应用。
          </p>
        </div>

        <div className="flex flex-col gap-8 w-full">
          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              核心特性
            </h2>
            <ul className="flex flex-col gap-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">
              <li>
                <span className="font-medium text-black dark:text-zinc-50">App Router</span>
                :基于文件系统的路由,通过嵌套布局组织页面结构。
              </li>
              <li>
                <span className="font-medium text-black dark:text-zinc-50">渲染方式</span>
                :支持服务端渲染(SSR)、静态生成(SSG)和客户端渲染,可在路由级别灵活切换。
              </li>
              <li>
                <span className="font-medium text-black dark:text-zinc-50">React Server Components</span>
                :默认使用服务端组件,在服务端获取数据并减少客户端 JavaScript 体积。
              </li>
              <li>
                <span className="font-medium text-black dark:text-zinc-50">内置优化</span>
                :对图片、字体和脚本进行自动优化,提升加载性能。
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              适用场景
            </h2>
            <p className="text-base leading-7 text-zinc-700 dark:text-zinc-300">
              无论是营销官网、电商前台,还是后台管理系统、内容站点,Next.js 都能提供合适的渲染策略与数据获取方式。配合 Vercel 平台,应用可一键部署并享受全球边缘网络加速。
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              延伸阅读
            </h2>
            <div className="flex flex-col gap-2 text-base">
              <a
                className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
                href="https://nextjs.org/docs?utm_source=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js 文档
              </a>
              <a
                className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
                href="https://nextjs.org/learn?utm_source=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js 学习中心
              </a>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="/"
          >
            返回首页
          </a>
        </div>
      </main>
    </div>
  );
}
