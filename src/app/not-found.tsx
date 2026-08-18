import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-fb flex min-h-[52vh] flex-col items-center justify-center py-20 text-center">
      <p className="mono text-[12px] uppercase tracking-[0.2em] text-[var(--muted)]">Error 404</p>
      <h1 className="font-display mt-3 text-[40px] leading-none sm:text-[56px]">
        This page has wilted
      </h1>
      <p className="mt-3 max-w-[42ch] text-[14px] text-[var(--muted)]">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved. Let&rsquo;s get you
        back to something in bloom.
      </p>
      <div className="mt-7 flex gap-3">
        <Button href="/" variant="primary">Back home</Button>
        <Button href="/catalog" variant="outline">Browse bouquets</Button>
      </div>
    </div>
  );
}
