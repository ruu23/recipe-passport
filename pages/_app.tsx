import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/styles/globals.css';
import Layout from "@/components/layout/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}