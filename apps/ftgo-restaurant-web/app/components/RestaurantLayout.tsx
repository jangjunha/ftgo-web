import { AppLayout } from "@ftgo/ui";
import { useAuth } from "../lib/auth-context";

interface RestaurantLayoutProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export function RestaurantLayout({ sidebar, children }: RestaurantLayoutProps) {
  const { user } = useAuth();
  return (
    <AppLayout
      title="FTGO 매장"
      theme="violet"
      username={user?.username}
      sidebar={sidebar}
    >
      {children}
    </AppLayout>
  );
}
