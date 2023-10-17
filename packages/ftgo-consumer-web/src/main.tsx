import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import Root from "./routes/root";
import Index from "./routes";
import ErrorPage from "./error-page";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import Authorized from "./routes/authorized";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import RestaurantPage from "./routes/restaurant";
import { decodeJwt } from "jose";
import consumerContext from "./context";
import OrdersPage from "./routes/orders";
import OrderPage from "./routes/order";
import ProfilePage from "./routes/profile";
import "./firebase";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/restaurants/:restaurantId/",
        element: <RestaurantPage />,
      },
      {
        path: "/orders/",
        element: <OrdersPage />,
      },
      {
        path: "/orders/:orderId/",
        element: <OrderPage />,
      },
      {
        path: "/profile/",
        element: <ProfilePage />,
      },
      {
        path: "/auth/callback/",
        element: <Authorized />,
      },
    ],
  },
]);

const createApolloClient = (token: string | null) => {
  console.log("URL", import.meta.env);
  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_ENDPOINT_URL,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

const Authenticated = (): React.ReactElement => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [consumerId, setConsumerId] = useState<string>();
  const [client, setClient] = useState<ApolloClient<any>>();
  useEffect(() => {
    const load = async () => {
      const token = isAuthenticated ? await getAccessTokenSilently() : null;

      if (token != null) {
        const claims = decodeJwt(token);
        setConsumerId(
          claims["https://ftgo.jangjunha.me/auth/consumer-id"] as string,
        );
      } else {
        setConsumerId(undefined);
      }

      setClient(createApolloClient(token));
    };
    load();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (client == null) {
    return <>Loading...</>;
  }

  return (
    <ApolloProvider client={client}>
      <consumerContext.Provider value={consumerId ?? null}>
        <RouterProvider router={router} />
      </consumerContext.Provider>
    </ApolloProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="ftgo-jangjunha.jp.auth0.com"
      clientId="2Z5uV8U5w7a3AqYk48STcyMrss9QCaup"
      authorizationParams={{
        audience: "https://api.ftgo.jangjunha.me",
        redirect_uri: `${window.location.origin}/auth/callback/`,
      }}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      <Authenticated />
    </Auth0Provider>
  </React.StrictMode>,
);
