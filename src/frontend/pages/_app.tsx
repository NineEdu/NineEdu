import type { AppProps } from 'next/app';
import '../app/globals.css';
import QueryProvider from '@/components/providers/query-provider';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <Toaster />
      <ToastContainer position="top-center" />
      <Component {...pageProps} />
    </QueryProvider>
  );
}