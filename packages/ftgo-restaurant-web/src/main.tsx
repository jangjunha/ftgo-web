import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import Root from "./routes/root";
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
import { decodeJwt } from "jose";
import restaurantContext from "./context";
import TicketsPage from "./routes/tickets";
import { relayStylePagination } from "@apollo/client/utilities";
import TicketPage from "./routes/ticket";
import IndexPage from "./routes";
import "./firebase";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <IndexPage />,
      },
      {
        path: "/tickets/",
        element: <TicketsPage />,
      },
      {
        path: "/tickets/:ticketId/",
        element: <TicketPage />,
      },
      {
        path: "/auth/callback/",
        element: <Authorized />,
      },
    ],
  },
]);

const createApolloClient = (token: string | null) => {
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
    cache: new InMemoryCache({
      typePolicies: {
        Restaurant: {
          fields: {
            tickets: relayStylePagination(),
          },
        },
      },
    }),
  });
};

const Authenticated = (): React.ReactElement => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [restaurantId, setRestaurantId] = useState<string>();
  const [client, setClient] = useState<ApolloClient<any>>();
  useEffect(() => {
    const load = async () => {
      const token = isAuthenticated ? await getAccessTokenSilently() : null;

      if (token != null) {
        const claims = decodeJwt(token);
        setRestaurantId(
          claims["https://ftgo.jangjunha.me/auth/restaurant-id"] as string,
        );
      } else {
        setRestaurantId(undefined);
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
      <restaurantContext.Provider value={restaurantId ?? null}>
        <RouterProvider router={router} />
      </restaurantContext.Provider>
    </ApolloProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="ftgo-jangjunha.jp.auth0.com"
      clientId="zZapKvRntZXQ1OFvFIXsSUVz7zioMZgx"
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
