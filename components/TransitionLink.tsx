'use client';

import { useRouter } from 'next/navigation';
import { startViewTransition } from '@/lib/viewTransition';
import type { ReactNode, MouseEvent, AnchorHTMLAttributes } from 'react';

interface Props extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: ReactNode;
}

export default function TransitionLink({ href, children, onClick, ...props }: Props) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Allow modifier keys for open-in-new-tab behavior
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onClick?.(e);
    startViewTransition(() => router.push(href));
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
