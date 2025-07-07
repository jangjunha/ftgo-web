import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/restaurants";
import { restaurants, users } from "@ftgo/util";
import { Button } from "@ftgo/ui";
import { RestaurantLayout } from "../components/RestaurantLayout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Your Restaurants - FTGO Restaurant" },
    { name: "description", content: "View and manage your restaurants" },
  ];
}

const Restaurant = ({ id }: { id: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["restaurants", id],
    queryFn: () => restaurants.get(id),
  });
  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }
  return (
    <Link to={`/restaurants/${id}`}>
      {!data && id}
      {data && (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {data.name}
          </h3>
          <p className="text-sm text-gray-600 mb-1">{data.address}</p>
        </>
      )}
    </Link>
  );
};

export default function Restaurants() {
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: users.getCurrentUser,
  });

  return (
    <RestaurantLayout>
      <div className="m-4 space-y-6">
        {meQuery.data?.granted_restaurants.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              No restaurants yet
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Create your first restaurant to get started.
            </p>
          </div>
        )}
        {meQuery.data && (
          <div>
            <ul>
              {meQuery.data.granted_restaurants.map((id) => (
                <li key={id}>
                  <Restaurant key={id} id={id} />
                </li>
              ))}
            </ul>
            <div className="text-center">
              <Link to="/restaurants/create">Create New Restaurant</Link>
            </div>
          </div>
        )}
        {meQuery.isLoading && (
          <div className="text-center py-12 animate-pulse">
            Loading your restaurants...
          </div>
        )}
      </div>
    </RestaurantLayout>
  );
}
