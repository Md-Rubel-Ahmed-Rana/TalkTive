import store from "@/redux/store";
import "@/styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import GoogleOneTapSignin from "@/auth/google-one-tap-signin";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Provider store={store}>
          {getLayout(<Component {...pageProps} />)}
          <Toaster position="top-right" />
          <GoogleOneTapSignin />
        </Provider>
      </ThemeProvider>
    </>
  );
}
