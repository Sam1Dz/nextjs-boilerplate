'use client';

import { Button, buttonVariants, Card, cn, Link, Tooltip, type PressEvent } from '@heroui/react';
import {
  IconBook,
  IconBrandTypescript,
  IconCheck,
  IconCopy,
  IconHexagon,
  IconMoon,
  IconShield,
  IconSun,
  IconTable,
  IconTerminal,
} from '@tabler/icons-react';
import Image from 'next/image';
import * as React from 'react';

import { useCopyToClipboard } from '~/components/hooks/useCopyToClipboard';

const scripts = [
  { name: 'dev', desc: 'Start development server', cmd: 'npm run dev' },
  {
    name: 'build',
    desc: 'Create optimized production build',
    cmd: 'npm run build',
  },
  { name: 'start', desc: 'Start production server', cmd: 'npm run start' },
  { name: 'lint', desc: 'Run ESLint on the project', cmd: 'npm run lint' },
  {
    name: 'lint:fix',
    desc: 'Run ESLint with auto-fix',
    cmd: 'npm run lint:fix',
  },
  { name: 'format', desc: 'Format code with Prettier', cmd: 'npm run format' },
  {
    name: 'outdated',
    desc: 'Check for package updates',
    cmd: 'npm run outdated',
  },
];

const features = [
  {
    bg: 'bg-blue-50 dark:bg-blue-950',
    icon: <IconBrandTypescript className="size-5 text-blue-500 dark:text-blue-400" />,
    title: 'TypeScript First',
    desc: 'Full TypeScript support with strict mode and proper type definitions out of the box.',
  },
  {
    bg: 'bg-violet-50 dark:bg-violet-950',
    icon: <IconSun className="size-5 text-violet-500 dark:text-violet-400" />,
    title: 'React Compiler',
    desc: 'Automatic optimizations via babel-plugin-react-compiler for better runtime performance.',
  },
  {
    bg: 'bg-cyan-50 dark:bg-cyan-950',
    icon: <IconMoon className="size-5 text-cyan-500 dark:text-cyan-400" />,
    title: 'Dark Mode Ready',
    desc: 'next-themes integration for seamless light/dark mode switching with zero layout shift.',
  },
  {
    bg: 'bg-green-50 dark:bg-green-950',
    icon: <IconShield className="size-5 text-green-500 dark:text-green-400" />,
    title: 'Linting & Formatting',
    desc: 'ESLint + Prettier with Tailwind plugin, pre-configured with zero conflicts.',
  },
  {
    bg: 'bg-orange-50 dark:bg-orange-950',
    icon: <IconTable className="size-5 text-orange-500 dark:text-orange-400" />,
    title: 'HeroUI Components',
    desc: 'Beautiful, accessible UI components with built-in dark mode and animation support.',
  },
  {
    bg: 'bg-pink-50 dark:bg-pink-950',
    icon: <IconHexagon className="size-5 text-pink-500 dark:text-pink-400" />,
    title: 'Tailwind CSS v4',
    desc: 'Latest Tailwind with PostCSS plugin, CSS-first config, and tailwind-merge utility.',
  },
];

export default function Page() {
  const [copiedScript, copyToClipboard] = useCopyToClipboard(3000);

  const handleSmoothScroll = (e: PressEvent, targetId: string) => {
    const target = document.querySelector(targetId);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <React.Fragment>
      <main>
        <div className="bg-grid">
          <section className="pt-20 pb-12 text-center max-md:py-14 max-md:pb-9">
            <div className="mx-auto max-w-240 px-6">
              <div className="bg-background-inverse mx-auto mb-7 flex size-18 items-center justify-center rounded-[1.25rem] shadow-[0_8px_30px_oklch(0_0_0/12%)]">
                <Image
                  alt="Next.js"
                  className="size-9 invert dark:invert-0"
                  height={36}
                  src="/next.svg"
                  width={36}
                />
              </div>
              <h1 className="mb-3.5 text-[40px] leading-[1.1] font-extrabold tracking-[-0.035em] max-md:text-[30px]">
                Get started with Next.js
              </h1>
              <p className="bg-background text-muted mx-auto mb-8 max-w-125 text-base leading-[1.7]">
                A production-ready starter with TypeScript, Tailwind CSS v4, HeroUI, React Compiler,
                ESLint, and Prettier — configured and ready to go.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 max-[480px]:flex-col">
                <Button onPress={e => handleSmoothScroll(e, '#scripts')}>
                  <IconTerminal />
                  View Scripts
                </Button>
                <Link
                  className={cn('flex gap-2', buttonVariants({ variant: 'tertiary', size: 'md' }))}
                  href="https://nextjs.org/docs"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <IconBook />
                  Next.js Docs
                </Link>
              </div>
            </div>
          </section>

          <section className="pb-12">
            <div className="mx-auto max-w-240 px-6">
              <div className="overflow-hidden rounded-3xl bg-[oklch(0.2429_0.0304_283.91)] shadow-[0_20px_60px_oklch(0_0_0/15%),0_0_0_1px_oklch(0_0_0/5%)]">
                <div className="flex items-center gap-2 border-b border-white/6 bg-white/5 px-4.5 py-3.5">
                  <div className="size-3 rounded-full bg-red-600" />
                  <div className="size-3 rounded-full bg-yellow-600" />
                  <div className="size-3 rounded-full bg-green-600" />
                  <span className="ml-2 font-mono text-xs text-white/35">~/nextjs-boilerplate</span>
                </div>
                <div className="px-6 py-6 font-mono text-[13px] leading-loose">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-green-500 select-none">&#10095;</span>
                    <span className="text-[oklch(0.8787_0.0426_272.28)]">
                      npm run <span className="text-[oklch(0.7664_0.1113_259.88)]">dev</span>
                    </span>
                  </div>
                  <div className="pl-5.5 text-xs text-[oklch(0.4765_0.034_278.64)]">
                    # Start development server at localhost:3000
                  </div>
                  <div className="mt-1 flex items-center gap-2.5">
                    <span className="font-semibold text-green-500 select-none">&#10095;</span>
                    <span className="text-[oklch(0.8787_0.0426_272.28)]">
                      npm run <span className="text-[oklch(0.7664_0.1113_259.88)]">build</span>
                    </span>
                  </div>
                  <div className="pl-5.5 text-xs text-[oklch(0.4765_0.034_278.64)]">
                    # Create optimized production build
                  </div>
                  <div className="mt-1 flex items-center gap-2.5">
                    <span className="font-semibold text-green-500 select-none">&#10095;</span>
                    <span className="text-[oklch(0.8787_0.0426_272.28)]">
                      npm run <span className="text-[oklch(0.7664_0.1113_259.88)]">lint:fix</span>{' '}
                      && npm run <span className="text-[oklch(0.7664_0.1113_259.88)]">format</span>
                    </span>
                  </div>
                  <div className="pl-5.5 text-xs text-[oklch(0.4765_0.034_278.64)]">
                    # Lint and format your code automatically
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="py-12" id="scripts">
          <div className="mx-auto max-w-240 px-6">
            <div className="text-muted mb-1.5 text-[11px] font-bold tracking-widest uppercase">
              Scripts
            </div>
            <div className="text-xl font-bold tracking-[-0.02em]">Available commands</div>

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
                          <p>Copy</p>
                        </Tooltip.Content>
                      </Tooltip>
                    </Card.Content>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-240 px-6">
            <div className="text-muted mb-1.5 text-[11px] font-bold tracking-widest uppercase">
              Features
            </div>
            <div className="text-xl font-bold tracking-[-0.02em]">What&apos;s included</div>

            <div className="mt-5 grid grid-cols-3 gap-3.5 max-md:grid-cols-1">
              {features.map((feature, index) => (
                <Card key={index}>
                  <Card.Content className="block">
                    <div
                      className={cn(
                        'mb-3.5 flex size-10 items-center justify-center rounded-[0.625rem]',
                        feature.bg
                      )}
                    >
                      {feature.icon}
                    </div>
                    <div className="mb-1.5 text-sm font-semibold">{feature.title}</div>
                    <div className="text-muted text-[13px] leading-[1.65]">{feature.desc}</div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-separator mt-4 border-t py-8">
        <div className="mx-auto max-w-240 px-6">
          <div className="flex flex-wrap items-center justify-center gap-5 max-md:flex-col max-md:text-center">
            <Link
              className="text-muted hover:text-foreground no-underline transition-all duration-150 hover:underline"
              href="https://nextjs.org/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              Next.js Docs
              <Link.Icon />
            </Link>
            <Link
              className="text-muted hover:text-foreground no-underline transition-all duration-150 hover:underline"
              href="https://react.dev"
              rel="noopener noreferrer"
              target="_blank"
            >
              React Docs
              <Link.Icon />
            </Link>
            <Link
              className="text-muted hover:text-foreground no-underline transition-all duration-150 hover:underline"
              href="https://tailwindcss.com/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              Tailwind Docs
              <Link.Icon />
            </Link>
            <Link
              className="text-muted hover:text-foreground no-underline transition-all duration-150 hover:underline"
              href="https://www.heroui.com/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              HeroUI Docs
              <Link.Icon />
            </Link>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}
