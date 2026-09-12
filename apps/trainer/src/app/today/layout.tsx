import { AuthGuard } from "@/components/auth/auth-guard";

export const metadata = { title: "Today · Traiv" };

export default function TodayLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
