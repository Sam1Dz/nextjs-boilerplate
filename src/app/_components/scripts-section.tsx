'use client';

import { Button, Card, Tooltip } from '@heroui/react';
import { IconCheck, IconCopy } from '@tabler/icons-react';

import { useCopyToClipboard } from '~/components/hooks/useCopyToClipboard';

export interface ScriptDefinition {
  readonly name: string;
  readonly desc: string;
  readonly cmd: string;
}

export function ScriptsSection(props: { scripts: readonly ScriptDefinition[] }) {
  const { scripts } = props;
  const [copiedScript, copyToClipboard] = useCopyToClipboard(3000);

  return (
    <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2.5 max-md:grid-cols-1">
      {scripts.map(script => {
        const isCopied = copiedScript === script.cmd;

        return (
          <Card key={script.name}>
            <Card.Content className="flex flex-row items-start justify-between gap-3">
              <div className="min-w-0 flex-1 p-0">
                <div className="text-foreground mb-0.5 font-mono text-[13px] font-semibold">
                  {script.name}
                </div>
                <div className="text-muted text-xs">{script.desc}</div>
                <div className="mt-2 inline-block rounded-md bg-[oklch(0.2429_0.0304_283.91)] px-2 py-0.75 font-mono text-[11px] whitespace-nowrap text-[oklch(0.8787_0.0426_272.28)]">
                  {script.cmd}
                </div>
              </div>

              <Tooltip delay={0}>
                <Button
                  isIconOnly
                  aria-label={
                    isCopied ? `Copied ${script.name} command` : `Copy ${script.name} command`
                  }
                  isDisabled={isCopied}
                  size="sm"
                  variant="ghost"
                  onPress={() => {
                    if (!isCopied) {
                      void copyToClipboard(script.cmd);
                    }
                  }}
                >
                  {isCopied ? <IconCheck className="text-success" /> : <IconCopy />}
                </Button>

                <Tooltip.Content>
                  <p>{isCopied ? 'Copied' : 'Copy'}</p>
                </Tooltip.Content>
              </Tooltip>
            </Card.Content>
          </Card>
        );
      })}
    </div>
  );
}
