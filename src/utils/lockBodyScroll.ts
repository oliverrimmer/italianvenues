/**
 * Lock body scroll by adding overflow-hidden
 */
export function lockBodyScroll(): void {
  if (typeof document === 'undefined') return;
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

/**
 * Unlock body scroll by removing overflow-hidden
 */
export function unlockBodyScroll(): void {
  if (typeof document === 'undefined') return;
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}
