import { AppLayout } from "@ftgo/ui";
import { useAuth } from "../lib/auth-context";

interface CourierLayoutProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export function CourierLayout({ sidebar, children }: CourierLayoutProps) {
  const { user } = useAuth();
  return (
    <AppLayout
      title="FTGO 배달원"
      theme="emerald"
      username={
        user !== null ? (
          <span className="font-mono text-xs">{user.courierId}</span>
        ) : undefined
      }
      sidebar={sidebar}
    >
      {children}
    </AppLayout>
  );
}
