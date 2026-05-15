"use client";

import dynamic from "next/dynamic";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/react-query/queryClient";

const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then((mod) => ({
      default: mod.ReactQueryDevtools,
    })),
  { ssr: false },
);

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
