import { AppLayout } from "@ftgo/ui";
import { useAuth } from "../lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { consumers } from "@ftgo/util";

interface RestaurantLayoutProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export function ConsumerLayout({ sidebar, children }: RestaurantLayoutProps) {
  const { user } = useAuth();
  const consumer = useQuery({
    queryKey: ["consumers", user?.consumerId],
    queryFn: () => consumers.get(user!.consumerId),
    enabled: user !== undefined,
  });
  return (
    <AppLayout
      title="FTGO 소비자"
      theme="orange"
      username={user !== null ? (consumer.data?.name ?? "") : undefined}
      sidebar={sidebar}
    >
      {children}
    </AppLayout>
  );
}
