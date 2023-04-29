import './globals.css';
import { Inter } from 'next/font/google';
import Providers from '@/components/util/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'ChatAI',
  description: 'The best AI chat app in the world',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className='h-full dark'
      style={{
        colorScheme: 'dark',
      }}
    >
      <body
        className={`bg-slate-50 dark:bg-slate-900 h-full ${inter.variable} font-inter`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
