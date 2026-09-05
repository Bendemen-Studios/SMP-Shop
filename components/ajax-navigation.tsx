'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function AjaxNavigation() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash === window.location.hash) return;

      setLoading(true);
    };

    const onPopState = () => setLoading(true);
    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  return (
    <>
      <div className={`ajax-progress ${loading ? 'is-loading' : ''}`} aria-hidden="true">
        <span />
      </div>
      <div className={`ajax-loading-corner ${loading ? 'is-loading' : ''}`} aria-hidden="true" />
    </>
  );
}
