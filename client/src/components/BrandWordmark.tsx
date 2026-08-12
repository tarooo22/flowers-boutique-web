type BrandWordmarkProps = {
  language: "ka" | "en";
  className?: string;
};

/**
 * The brand lockup is intentionally centralized so Header and Footer always
 * present the same language-specific identity.
 */
export function BrandWordmark({ language, className }: BrandWordmarkProps) {
  const ka = language === "ka";

  return (
    <span className={className} lang={language}>
      {ka ? (
        <>
          <span>ყვავილების ბუტიკი</span>
          <em>&amp; ივენთები</em>
        </>
      ) : (
        <>
          <span>Flower’s</span>
          <em>Boutique</em>
          <small>&amp; Events</small>
        </>
      )}
    </span>
  );
}
