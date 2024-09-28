import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import SocketProvider from "@/context/SocketContext";
import { Provider } from "react-redux";
import store from "@/app/store";
import { Box } from "@mui/material";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <Box>
      <SocketProvider>
        <Provider store={store}>
          {getLayout(<Component {...pageProps} />)}
        </Provider>
        <Toaster />
      </SocketProvider>
    </Box>
  );
}
