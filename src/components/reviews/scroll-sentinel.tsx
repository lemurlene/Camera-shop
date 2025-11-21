import { useEffect, useRef } from 'react';

type ScrollSentinelProps = {
  isVisible: boolean;
  onIntersect: () => void;
}

function ScrollSentinel({ isVisible, onIntersect }: ScrollSentinelProps): JSX.Element | null {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setTimeout(() => {
            onIntersect();
          }, 100);
        }
      },
      {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, onIntersect]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={sentinelRef}
      style={{
        height: '1px',
        width: '100%',
        opacity: 0,
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    />
  );
}

export default ScrollSentinel;
