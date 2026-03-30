"use client";

import { useState } from "react";

type HostingMode = "cloud" | "self-hosted";

interface Tier {
  name: string;
  description: string;
  cloud: {
    writePrice: string;
    readPrice: string;
    label: string;
  };
  selfHosted: {
    writePrice: string;
    readPrice: string;
    label: string;
  };
  features: string[];
  selfHostedFeatures?: string[];
  cloudFeatures?: string[];
  highlighted?: boolean;
  cta: string;
  ctaHref: string;
}

const tiers: Tier[] = [
  {
    name: "Basic",
    description: "Core version control for small teams getting started.",
    cloud: {
      writePrice: "$4",
      readPrice: "$2",
      label: "/mo per active user",
    },
    selfHosted: {
      writePrice: "Free",
      readPrice: "Free",
      label: "",
    },
    features: [
      "Checkouts & file locking",
      "Branching",
      "CLI, desktop & web clients",
      "Open source self-host option",
    ],
    cta: "Get Started",
    ctaHref: "https://app.checkpointvcs.com",
  },
  {
    name: "Pro",
    description: "Collaboration features for growing teams.",
    cloud: {
      writePrice: "$9",
      readPrice: "$4",
      label: "/mo per active user",
    },
    selfHosted: {
      writePrice: "$2",
      readPrice: "$1",
      label: "/mo per active user",
    },
    features: [
      "Everything in Basic",
      "Pull requests & reviews",
      "Shelves",
      "Horde integration",
      "Artifacts",
    ],
    highlighted: true,
    cta: "Get Started",
    ctaHref: "https://app.checkpointvcs.com",
  },
  {
    name: "Studio",
    description: "Enterprise-grade for large studios and organizations.",
    cloud: {
      writePrice: "$19",
      readPrice: "$9",
      label: "/mo per active user",
    },
    selfHosted: {
      writePrice: "$6",
      readPrice: "$3",
      label: "/mo per active user",
    },
    features: [
      "Everything in Pro",
      "Data replicas",
    ],
    selfHostedFeatures: [
      "Cloudflare R2 storage",
    ],
    cloudFeatures: [
      "Enterprise SAML / SSO",
      "Priority support",
    ],
    cta: "Get Started",
    ctaHref: "https://app.checkpointvcs.com",
  },
];

export default function Pricing() {
  const [mode, setMode] = useState<HostingMode>("cloud");

  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      {/* Divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto max-w-2xl text-muted text-lg mb-8">
            Pay per active user. Storage starts at $1/mo for up to 10 GB, then
            $4.50 per 50 GB/mo. Bandwidth included.
          </p>

          {/* Hosting toggle */}
          <div className="inline-flex items-center glass rounded-full p-1">
            <button
              onClick={() => setMode("cloud")}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                mode === "cloud"
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Cloud
            </button>
            <button
              onClick={() => setMode("self-hosted")}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                mode === "self-hosted"
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Self-hosted
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => {
            const pricing =
              mode === "cloud" ? tier.cloud : tier.selfHosted;
            const isFree =
              pricing.writePrice === "Free" && pricing.readPrice === "Free";


            const tierFeatures = [
              ...tier.features,
              ...(mode === "cloud"
                ? tier.cloudFeatures || []
                : tier.selfHostedFeatures || []),
            ];

            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] ${
                  tier.highlighted
                    ? "glass-primary glow-primary"
                    : "glass"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <p className="text-sm text-muted mb-6">{tier.description}</p>

                {/* Price */}
                <div className="mb-8">
                  {isFree ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">Free</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">
                          {pricing.writePrice}
                        </span>
                        <span className="text-sm text-muted">
                          {pricing.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        Write users: {pricing.writePrice}/mo · Read users:{" "}
                        {pricing.readPrice}/mo
                      </p>
                    </div>
                  )}
                </div>

                {/* Features list */}
                <ul className="space-y-3 mb-8">
                  {tierFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <svg
                        className="w-5 h-5 text-primary shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      <span className="text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={tier.ctaHref}
                  className={`block w-full text-center rounded-full py-3 text-sm font-semibold transition-all ${
                    tier.highlighted
                      ? "bg-primary text-white hover:bg-primary-light hover:shadow-lg hover:shadow-primary/25"
                      : "glass hover:bg-surface-hover text-foreground"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            );
          })}
        </div>

        {/* Storage note */}
        <p className="text-center text-xs text-muted/60 mt-8 max-w-lg mx-auto">
          Cloud storage: $1/mo for up to 10 GB, then $4.50 per additional 50 GB/mo.
          500 GB bandwidth included. Self-hosted storage is managed by you.
        </p>
      </div>
    </section>
  );
}
