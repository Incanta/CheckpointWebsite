"use client";

import { useState } from "react";
import { COMING_SOON } from "@/config";

type HostingMode = "cloud" | "self-hosted";

export const StorageCostPerGb = 0.05;

export interface Tier {
  name: string;
  enabled: boolean;
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
  cloudFeaturesFirst?: boolean;
  cloudFeatures?: string[];
  selfHostedAddons?: string[];
  cloudAddons?: string[];
  highlighted?: boolean;
  cta: string;
  ctaHref: string;
}

export const tiers: Tier[] = [
  {
    name: "Basic",
    enabled: true,
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
    cloudFeaturesFirst: true,
    cloudFeatures: [
      "30 Day Free Trial (up to 25 GB storage included)",
    ],
    features: [
      "Unlimited users",
      "Checkouts",
      "File locking",
      "Branching",
      "Unreal Engine, Desktop, CLI, & web clients",
    ],
    cta: "Get Started",
    ctaHref: "https://app.checkpointvcs.com",
  },
  {
    name: "Pro",
    enabled: true,
    description: "Collaboration features for growing teams.",
    cloud: {
      writePrice: "$9",
      readPrice: "$4",
      label: "/mo per active user",
    },
    selfHosted: {
      writePrice: "$4",
      readPrice: "$2",
      label: "/mo per active user",
    },
    features: [
      "Everything in Basic",
      "Issues",
      "Pull requests & reviews",
      "Shelves",
    ],
    highlighted: true,
    cta: "Get Started",
    ctaHref: "https://app.checkpointvcs.com",
  },
  {
    name: "Studio",
    enabled: true,
    description: "Enterprise-grade for large studios and organizations.",
    cloud: {
      writePrice: "$24",
      readPrice: "$12",
      label: "/mo per active user",
    },
    selfHosted: {
      writePrice: "$9",
      readPrice: "$4",
      label: "/mo per active user",
    },
    features: [
      "Everything in Pro",
      "Artifacts (CI build outputs, like UnrealGameSync)",
      // "Data replicas",
    ],
    selfHostedFeatures: [
      "Cloudflare R2 storage",
    ],
    cloudFeatures: [
      // "Enterprise SAML / SSO",
      "Priority support",
    ],
    selfHostedAddons: [
      // "Enterprise SAML / SSO",
      "Priority support",
      "Offline / air-gapped network deployment",
    ],
    cloudAddons: [
      "Single-tenant deployment",
      "Bring your own storage (BYOS)",
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
            Usage-based pricing
          </h2>
          <p className="mx-auto max-w-2xl text-muted text-lg mb-8">
            Pay per active user - ${(StorageCostPerGb * 50).toFixed(2)} per 50 GB/mo - Bandwidth included
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
          {tiers.filter(tier => tier.enabled).map((tier) => {
            const pricing =
              mode === "cloud" ? tier.cloud : tier.selfHosted;
            const isFree =
              pricing.writePrice === "Free" && pricing.readPrice === "Free";


            const tierFeatures = [
              ...tier.features,
              ...(mode === "self-hosted" ? tier.selfHostedFeatures || [] : []),
            ];

            if (tier.cloudFeaturesFirst && mode === "cloud") {
              tierFeatures.unshift(
                ...(tier.cloudFeatures || [])
              );
            } else if (mode === "cloud") {
              tierFeatures.push(
                ...(tier.cloudFeatures || [])
              );
            }

            const addons =
              mode === "self-hosted"
                ? tier.selfHostedAddons || []
                : tier.cloudAddons || [];

            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] flex flex-col ${
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

                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{tier.name}</h3>

                    {tier.name === "Basic" && (
                      <a
                        href="https://github.com/Incanta/Checkpoint"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 glass rounded-full px-2.5 py-2 text-xs font-medium text-muted hover:text-foreground transition-colors leading-none"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                        Open Source
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    )}
                  </div>

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
                        {pricing.readPrice === "Free" ? "Free" : `${pricing.readPrice}/mo`}
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

                {/* Self-hosted add-ons */}
                {addons.length > 0 && (
                  <div className="mb-8">
                    <p className="text-xs uppercase tracking-wider text-muted/50 font-medium mb-3">
                      Available add-ons · <a href="/contact" className="text-primary hover:underline">Contact us</a>
                    </p>
                    <ul className="space-y-3">
                      {addons.map((addon) => (
                        <li
                          key={addon}
                          className="flex items-start gap-3 text-sm"
                        >
                          <svg
                            className="w-5 h-5 text-muted/40 shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          <span className="text-muted/50">{addon}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                {COMING_SOON ? (
                  <span
                    className="mt-auto block w-full text-center rounded-full py-3 text-sm font-semibold bg-muted/30 text-muted cursor-not-allowed"
                  >
                    Coming Soon
                  </span>
                ) : (
                  <a
                    href={tier.ctaHref}
                    className={`mt-auto block w-full text-center rounded-full py-3 text-sm font-semibold transition-all ${
                      tier.highlighted
                        ? "bg-primary text-white hover:bg-primary-light hover:shadow-lg hover:shadow-primary/25"
                        : "glass hover:bg-surface-hover text-foreground"
                    }`}
                  >
                    {tier.cta}
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Storage & billing notes */}
        <div className="mt-8 space-y-2 max-w-lg mx-auto text-center">
          <p className="text-xs text-muted/60">
            Cloud storage: $2.50 per 50 GB/mo. Unlimited bandwidth included. Self-hosted storage is managed by you.
          </p>
          <p className="text-xs text-muted/60">
            To continue to provide our affordable pricing, we will automatically
            charge an active write user fee if you have no write usage in 12 months.
          </p>
          <p className="text-xs text-muted/60">
            If you have an outstanding balance with insufficient credit, we charge a <span className="text-muted/80 font-medium">$5 minimum{" "}</span>. Any remainder rolls over as credit toward future months.
          </p>
        </div>
      </div>
    </section>
  );
}
