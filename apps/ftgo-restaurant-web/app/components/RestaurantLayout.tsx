import { AppLayout } from "@ftgo/ui";
import { useAuth } from "../lib/auth-context";

interface RestaurantLayoutProps {
  children: React.ReactNode;
}

export function RestaurantLayout({ children }: RestaurantLayoutProps) {
  const { user } = useAuth();
  return (
    <AppLayout title="FTGO 매장" theme="violet" username={user?.username}>
      {children}
    </AppLayout>
  );
}
