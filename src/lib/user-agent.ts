export function getUserAgent(userAgent: string) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
  return {
    isMobile,
    isDesktop: !isMobile,
  };
}
