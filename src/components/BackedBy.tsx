export default function BackedBy() {
  const notBackedBy = [
    "No VCs",
    "No Board Seats",
    "No Growth Mandates",
    "No Investors",
    "No IPO Pressure",
    "No Quarterly Targets",
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            Backed By
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Absolutely no one
          </h2>
          <p className="mx-auto max-w-2xl text-muted text-lg leading-relaxed">
            No investors. No board. No pressure to &ldquo;10x&rdquo; next
            quarter. We&apos;re bootstrapped — which means we answer to our
            users, not shareholders. The savings from not chasing infinite growth
            get passed directly to you.
          </p>
        </div>

        {/* "Logos" strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {notBackedBy.map((label) => (
            <div
              key={label}
              className="glass rounded-xl px-6 py-4 text-sm font-medium text-muted/50 line-through decoration-muted/20 select-none"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Punchline card */}
        <div className="mx-auto max-w-2xl glass-primary rounded-2xl p-8 text-center glow-primary">
          <p className="text-lg font-medium leading-relaxed">
            &ldquo;Instead of raising prices to satisfy investors, we lower them
            to satisfy{" "}
            <span className="text-primary-light font-semibold">you</span>
            .&rdquo;
          </p>
          <p className="mt-3 text-sm text-muted">
            — The Checkpoint team, happily unfunded since day one
          </p>
        </div>
      </div>
    </section>
  );
}
