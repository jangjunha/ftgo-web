import { useQuery } from "@apollo/client";
import { gql } from "../__generated__";
import { Link } from "react-router-dom";

const LIST_RESTAURANTS = gql(`
  query ListRestaurants {
    restaurants {
      id
      name
    }
  }
`);

const Index = (): React.ReactElement => {
  const { loading, data } = useQuery(LIST_RESTAURANTS);

  return (
    <div className="bg-neutral-100 pb-16">
      <h3 className="p-2">가게 목록</h3>
      {loading && "불러오는 중"}
      <ul className="flex flex-col">
        {data?.restaurants.map((restaurant) => (
          <li key={restaurant.id} className="flex flex-col">
            <Link
              to={`/restaurants/${restaurant.id}/`}
              className="p-2 bg-white"
            >
              {restaurant.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Index;
