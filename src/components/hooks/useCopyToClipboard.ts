'use client';

import * as React from 'react';

type CopiedValue = string | null;
type CopyToClipboard = (text: string) => Promise<boolean>;

/**
 * Copies text to the user's clipboard and tracks the latest copied value.
 *
 * @remarks
 * This hook prefers the modern Clipboard API and falls back to
 * `document.execCommand('copy')` for older browser support. When a reset delay
 * is provided, the copied state clears automatically after the timeout.
 *
 * Timeout cleanup is handled on repeated copy attempts and component unmount to
 * avoid stale timers updating unmounted UI.
 *
 * @param resetDelay - Duration in milliseconds before the copied state resets.
 * Pass `null` to keep the copied state until the next manual reset.
 * @returns A tuple containing the last copied text and an async copy function.
 */
export function useCopyToClipboard(
  resetDelay: number | null = null
): readonly [CopiedValue, CopyToClipboard] {
  const [copiedText, setCopiedText] = React.useState<CopiedValue>(null);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const clearResetTimeout = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleCopySuccess = (text: string) => {
    clearResetTimeout();
    setCopiedText(text);

    if (resetDelay !== null) {
      timeoutRef.current = window.setTimeout(() => {
        setCopiedText(currentValue => (currentValue === text ? null : currentValue));
        timeoutRef.current = null;
      }, resetDelay);
    }

    return true;
  };

  const copyToClipboard = async (text: string) => {
    if (!text) {
      clearResetTimeout();
      setCopiedText(null);

      return false;
    }

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);

        return handleCopySuccess(text);
      } catch (error) {
        console.warn('Clipboard API copy failed. Falling back to execCommand.', error);
      }
    }

    try {
      const textArea = document.createElement('textarea');

      textArea.value = text;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const didCopy = document.execCommand('copy');

      document.body.removeChild(textArea);

      if (!didCopy) {
        clearResetTimeout();
        setCopiedText(null);

        return false;
      }

      return handleCopySuccess(text);
    } catch (error) {
      console.error('Failed to copy text to the clipboard:', error);
      clearResetTimeout();
      setCopiedText(null);

      return false;
    }
  };

  return [copiedText, copyToClipboard] as const;
}
