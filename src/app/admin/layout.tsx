import { AdminLayout } from "@/components/AdminLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | Tierytek Construction",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
