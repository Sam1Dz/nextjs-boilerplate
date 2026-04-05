import { cn } from '@heroui/styles';

import { BaseProvider } from '~/components/providers/base';
import { fontGeistMono, fontGeistSans } from '~/config/fonts';

import '../styles/globals.css';

export { metadata } from '~/config/site';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      className={cn(
        'h-full antialiased',
        fontGeistMono.variable,
        'font-sans',
        fontGeistSans.variable
      )}
      lang="en"
    >
      <body className="flex min-h-full flex-col">
        <BaseProvider>{children}</BaseProvider>
      </body>
    </html>
  );
}
