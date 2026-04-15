import './globals.css';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YAVUZ Kuaför',
  description: 'YAVUZ Kuaför - Modern kuaför hizmetleri ve online randevu.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
