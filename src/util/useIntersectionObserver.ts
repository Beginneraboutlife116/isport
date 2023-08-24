import { useRef, useEffect } from 'react';

export default function useIntersectionObserver(
	callback: IntersectionObserverCallback,
	options: IntersectionObserverInit = { root: null, rootMargin: '0px', threshold: 0 },
	hasMounted: boolean,
) {
	const observerRef = useRef<IntersectionObserver>();
	const targetRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (window && hasMounted) {
			observerRef.current = new IntersectionObserver(callback, {
				root: null,
				rootMargin: '0px',
				threshold: 0,
				...options,
			});
			if (targetRef.current) {
				observerRef.current.observe(targetRef.current);
			}
		}
		return () => {
			observerRef.current?.disconnect();
		};
	}, [hasMounted, options]);

	return targetRef;
}
