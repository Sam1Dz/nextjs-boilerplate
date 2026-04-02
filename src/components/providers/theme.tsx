'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

/**
 * Theme provider wrapper for next-themes integration.
 *
 * @remarks
 * Provides theme context to the application using next-themes.
 * Supports system theme detection, theme persistence, and prevents
 * FOUC (Flash of Unstyled Content) during theme transitions.
 *
 * @example
 * ```tsx
 * <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * @param props - Props forwarded to the underlying next-themes ThemeProvider.
 * @returns The themed provider component.
 */
export function ThemeProvider(props: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />;
}
