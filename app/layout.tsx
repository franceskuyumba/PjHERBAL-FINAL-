import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PJHERBAL Clinic',
  description: 'Herbal Remedies and Supplements',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
