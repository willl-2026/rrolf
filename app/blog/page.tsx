"use client";

import Link from "next/link";
import useSWR from "swr";

type HelloResponse = { message: string };

const fetcher = async (url: string): Promise<HelloResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  return res.json();
};

export default function Blog() {
  const { data, error, isLoading } = useSWR<HelloResponse>("/api/hello", fetcher);

  const message = data?.message ?? "hello, next.js";

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start gap-10">
        {isLoading ? (
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-zinc-400 dark:text-zinc-600">
            加载中…
          </h1>
        ) : error ? (
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-red-600 dark:text-red-400">
            请求失败
          </h1>
        ) : (
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50">
            {message}
          </h1>
        )}

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="/"
          >
            返回首页
          </Link>
        </div>
      </main>
    </div>
  );
}
