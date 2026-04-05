'use client';

import * as React from 'react';

import { ThemeProvider } from './theme';

/**
 * Composes multiple React providers into a single provider component.
 *
 * @remarks
 * Uses reduceRight to nest providers from right to left, ensuring the
 * first provider in the array wraps all subsequent providers. This allows
 * for clean, composable provider setup at the app root.
 *
 * @example
 * ```tsx
 * const CombinedProvider = composeProviders(
 *   ThemeProvider,
 *   QueryProvider,
 *   AuthProvider
 * );
 *
 * <CombinedProvider>
 *   <App />
 * </CombinedProvider>
 * ```
 *
 * @param providers - Array of provider components to compose.
 * @returns A single composed provider component.
 */
const composeProviders = (
  ...providers: React.FC<React.PropsWithChildren>[]
): React.FC<React.PropsWithChildren> => {
  return ({ children }: React.PropsWithChildren) => {
    return providers.reduceRight<React.ReactNode>(
      (child, Provider) => <Provider>{child}</Provider>,
      children
    ) as React.ReactElement;
  };
};

/**
 * Internal theme provider wrapper with default configuration.
 *
 * @remarks
 * Configures the ThemeProvider with project-standard settings:
 * - System theme detection enabled
 * - Class-based theme application (for Tailwind CSS dark mode)
 * - Default theme follows system preference
 * - Transitions disabled on theme change to prevent visual glitches
 *
 * @param children - Child components to receive theme context.
 * @returns The configured theme provider.
 */
function AppThemeProvider({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider disableTransitionOnChange enableSystem attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}

/**
 * Root provider composition for the application.
 *
 * @remarks
 * Combines all application-level providers into a single component
 * for clean app initialization. Currently includes theme support
 * with next-themes. Additional providers can be added to the
 * composeProviders call as needed.
 *
 * @example
 * ```tsx
 * // In root layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <BaseProvider>
 *           {children}
 *         </BaseProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @param children - Child components to receive all provider contexts.
 * @returns The composed provider tree.
 */
export const BaseProvider = composeProviders(AppThemeProvider);
