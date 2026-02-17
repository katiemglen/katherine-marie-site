export function startViewTransition(callback: () => void) {
  if (typeof document !== 'undefined' && (document as any).startViewTransition) {
    (document as any).startViewTransition(callback);
  } else {
    callback();
  }
}
