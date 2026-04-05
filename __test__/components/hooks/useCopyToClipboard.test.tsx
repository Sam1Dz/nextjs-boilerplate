import { act, renderHook } from '@testing-library/react';

import { useCopyToClipboard } from '../../../src/components/hooks/useCopyToClipboard';

const setClipboard = (clipboard?: Pick<Clipboard, 'writeText'>) => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: clipboard,
  });
};

const setExecCommand = (execCommand: typeof document.execCommand) => {
  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    value: execCommand,
  });
};

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    Reflect.deleteProperty(navigator, 'clipboard');
    Reflect.deleteProperty(document, 'execCommand');
  });

  it('copies text with the Clipboard API and clears it after the reset delay', async () => {
    jest.useFakeTimers();

    const writeText = jest.fn().mockResolvedValue(undefined);

    setClipboard({ writeText });

    const { result } = renderHook(() => useCopyToClipboard(100));

    let didCopy = false;

    await act(async () => {
      didCopy = await result.current[1]('Copied text');
    });

    expect(didCopy).toBe(true);
    expect(writeText).toHaveBeenCalledWith('Copied text');
    expect(result.current[0]).toBe('Copied text');

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current[0]).toBeNull();
  });

  it('clears copied state when asked to copy an empty string', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);

    setClipboard({ writeText });

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current[1]('Copied text');
    });

    let didCopy = true;

    await act(async () => {
      didCopy = await result.current[1]('');
    });

    expect(didCopy).toBe(false);
    expect(result.current[0]).toBeNull();
  });

  it('falls back to execCommand when the Clipboard API write fails', async () => {
    const writeText = jest.fn().mockRejectedValue(new Error('Permission denied'));
    const execCommand = jest.fn().mockReturnValue(true);

    setClipboard({ writeText });
    setExecCommand(execCommand);

    const { result } = renderHook(() => useCopyToClipboard());

    let didCopy = false;

    await act(async () => {
      didCopy = await result.current[1]('Fallback text');
    });

    expect(didCopy).toBe(true);
    expect(writeText).toHaveBeenCalledWith('Fallback text');
    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(console.warn).toHaveBeenCalled();
    expect(result.current[0]).toBe('Fallback text');
  });

  it('returns false when both copy strategies fail', async () => {
    const execCommand = jest.fn(() => {
      throw new Error('Copy failed');
    });

    setExecCommand(execCommand);

    const { result } = renderHook(() => useCopyToClipboard());

    let didCopy = true;

    await act(async () => {
      didCopy = await result.current[1]('Uncopied text');
    });

    expect(didCopy).toBe(false);
    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(console.error).toHaveBeenCalled();
    expect(result.current[0]).toBeNull();
  });
});
