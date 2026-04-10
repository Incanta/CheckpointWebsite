"use client";

import { useState } from "react";
import { tiers, Tier, StorageCostPerGb } from "./Pricing";

// ─────────────────────────────────────────────────────────────────────────────
// Edit this data to update the pricing calculator
// ─────────────────────────────────────────────────────────────────────────────

type RevenueTier = "lt100k" | "100k-200k" | "gt200k";
type CheckpointPlan = "basic" | "pro" | "studio";
type HostingType = "cloud" | "self-hosted";

const REVENUE_TIERS: { value: RevenueTier; label: string }[] = [
  { value: "lt100k", label: "<$100K" },
  { value: "100k-200k", label: "$100K–200K" },
  { value: "gt200k", label: ">$200K" },
];

const CHECKPOINT_PLANS: { value: CheckpointPlan; label: string }[] = [
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
  { value: "studio", label: "Studio" },
];

const HOSTING_TYPES: { value: HostingType; label: string }[] = [
  { value: "cloud", label: "Cloud" },
  { value: "self-hosted", label: "Self-hosted" },
];

interface Provider {
  name: string;
  disabled?: boolean;
  /** Highlight row (Checkpoint) */
  isUs?: boolean;
  /** Brand color for the cost bar */
  color: string;
  /**
   * Function that returns total monthly cost given user count, storage in GB,
   * the company's annual revenue tier, and for Checkpoint specifically,
   * the selected plan and hosting type.
   * Keep these simple; they're evaluated on every slider change.
   */
  monthlyCost: (users: number, storageGb: number, revenue: RevenueTier, plan: CheckpointPlan, hosting: HostingType) => number | [number, number];
  /** Note shown below price (e.g. free tier caveats) */
  note?: string;
}

const basicTier: Tier = tiers.find(tier => tier.name.toLowerCase() === "basic")!;
const proTier: Tier = tiers.find(tier => tier.name.toLowerCase() === "pro")!;
const studioTier: Tier = tiers.find(tier => tier.name.toLowerCase() === "studio")!;

function stringTierPrice(tier: Tier, hosting: HostingType): number {
  const priceStr = hosting === "self-hosted" ? tier.selfHosted.writePrice : tier.cloud.writePrice;
  return Number(priceStr.replace("Free", "0").replace("$", ""));
}

const PROVIDERS: Provider[] = [
  {
    name: "Checkpoint",
    isUs: true,
    color: "#6D00F7",
    monthlyCost: (users, gb, _revenue, plan, hosting) => {
      const pricePerUser = stringTierPrice(
        plan === "basic" ? basicTier : plan === "pro" ? proTier : studioTier,
        hosting
      );
      const seatCost = users * pricePerUser;
      const storageCost = hosting === "self-hosted" ? 0 : gb <= 10 ? 1 : 1 + Math.ceil((gb - 10) / 50) * StorageCostPerGb * 50;
      return [storageCost, seatCost + storageCost];
    },
    note: "Cost depends on active users",
  },
  {
    name: "Perforce Helix Core",
    color: "#00BCF2",
    monthlyCost: (users, gb, _revenue, _plan, hosting) => {
      // Free ≤5 users, then ~$39/user/mo (cloud). Storage bundled.
      const adjustedUsers = hosting === "self-hosted" ? users <= 5 ? 0 : users : users;
      const seatCost = adjustedUsers * 38;
      const storageCost = hosting === "self-hosted" ? 0 : Math.max(gb - 64, 0) * 30 * 0.00325; // Cloud storage is bundled, on-prem has a one-time cost
      return seatCost + storageCost;
    },
    note: "",
  },
  {
    name: "Unity Version Control",
    disabled: false,
    color: "#F0C830",
    monthlyCost: (users, gb, revenue, _plan, hosting) => {
      if (revenue === "gt200k") {
        const seatCost = users * 210;
        const gbOverage = Math.max(gb - 25, 0);
        const gbFirst100 = Math.min(gbOverage, 100);
        const gbOver100 = Math.max(gbOverage - 100, 0);
        const storageCost = hosting === "self-hosted" ? 0 : gbFirst100 * 0.10 + gbOver100 * 0.06;
        return seatCost + storageCost;
      } else {
        const seatCost = hosting === "self-hosted" ? users * 38 : 0;
        const gbOverage = Math.max(gb - 25, 0);
        const gbFirst100 = Math.min(gbOverage, 100);
        const gbOver100 = Math.max(gbOverage - 100, 0);
        const storageCost = hosting === "self-hosted" ? 0 : gbFirst100 * 0.10 + gbOver100 * 0.06;
        return seatCost + storageCost;
      }
    },
    note: "",
  },
  {
    name: "Diversion",
    color: "#FF6B6B",
    monthlyCost: (users, gb, revenue, _plan, hosting) => {
      const storageCost = gb <= 100 ? 0 : (gb - 100) * 0.10;
      if (users <= 20 && revenue === "lt100k" && hosting === "cloud") {
        const seatCost = users <= 5 ? 0 : users <= 10 ? (users - 5) * 12 : (5 * 12) + ((users - 10) * 25);
        return seatCost + storageCost;
      } else if (users <= 50 && hosting === "cloud") {
        const seatCost = users * 25;
        return seatCost + storageCost;
      } else {
        const seatCost = users * 35;
        return seatCost + storageCost;
      }
    },
    note: "",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

const USER_MIN = 1;
const USER_MAX = 100;
const STORAGE_MIN = 1;
const STORAGE_MAX = 1000;

function formatCost(cost: number): string {
  if (cost === 0) return "Free";
  return `$${Math.round(cost).toLocaleString()}`;
}

export default function PricingComparison() {
  const [users, setUsers] = useState(10);
  const [storageGb, setStorageGb] = useState(50);
  const [revenue, setRevenue] = useState<RevenueTier>("gt200k");
  const [plan, setPlan] = useState<CheckpointPlan>("basic");
  const [hosting, setHosting] = useState<HostingType>("cloud");

  // Calculate costs and find the max for bar scaling
  const results = PROVIDERS.filter(p => !p.disabled).map((p) => {
    const cost = p.monthlyCost(users, storageGb, revenue, plan, hosting);

    return {
      ...p,
      maxCost: Array.isArray(cost) ? cost[1] : null,
      cost: Array.isArray(cost) ? cost[0] : cost,
    };
  });
  const maxCost = Math.max(...results.map((r) => r.cost), 1);

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            Compare
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            See how we stack up
          </h2>
          <p className="mx-auto max-w-2xl text-muted text-lg">
            Drag the sliders to estimate your monthly cost across providers.
          </p>
        </div>

        {/* Sliders */}
        <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Users slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Users</label>
                <span className="text-sm font-mono font-semibold text-primary-light">
                  {users}
                </span>
              </div>
              <input
                type="range"
                min={USER_MIN}
                max={USER_MAX}
                value={users}
                onChange={(e) => setUsers(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-border rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted/50 mt-1">
                <span>{USER_MIN}</span>
                <span>{USER_MAX}</span>
              </div>
            </div>

            {/* Storage slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Storage</label>
                <span className="text-sm font-mono font-semibold text-primary-light">
                  {storageGb >= 1000
                    ? `${(storageGb / 1000).toFixed(1)} TB`
                    : `${storageGb} GB`}
                </span>
              </div>
              <input
                type="range"
                min={STORAGE_MIN}
                max={STORAGE_MAX}
                step={storageGb < 100 ? 5 : 25}
                value={storageGb}
                onChange={(e) => setStorageGb(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-border rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted/50 mt-1">
                <span>{STORAGE_MIN} GB</span>
                <span>1 TB</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-8 justify-center">
            <div>
              <label className="text-sm font-medium block mb-3">Checkpoint Plan</label>
              <div className="inline-flex items-center glass rounded-full p-1">
                {CHECKPOINT_PLANS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPlan(p.value)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                      plan === p.value
                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-3">Hosting</label>
              <div className="inline-flex items-center glass rounded-full p-1">
                {HOSTING_TYPES.map((h) => (
                  <button
                    key={h.value}
                    onClick={() => setHosting(h.value)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                      hosting === h.value
                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-3">Annual Revenue</label>
              <div className="inline-flex items-center glass rounded-full p-1">
                {REVENUE_TIERS.map((tier) => (
                  <button
                    key={tier.value}
                    onClick={() => setRevenue(tier.value)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                      revenue === tier.value
                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {results
            .sort((a, b) => a.cost - b.cost)
            .map((provider) => {
              const barWidth =
                maxCost > 0 ? Math.max((provider.cost / maxCost) * 100, 2) : 2;

              return (
                <div
                  key={provider.name}
                  className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
                    provider.isUs
                      ? "glass-primary glow-primary"
                      : "glass"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: provider.color }}
                      />
                      <div>
                        <span className="text-sm font-semibold">
                          {provider.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-bold">
                        {provider.maxCost ? `${formatCost(provider.cost)} - ${formatCost(provider.maxCost)}` : formatCost(provider.cost)}
                      </span>
                      {provider.cost > 0 && (
                        <span className="text-xs text-muted ml-1">/mo</span>
                      )}
                    </div>
                  </div>

                  {/* Cost bar */}
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: provider.color,
                        opacity: provider.isUs ? 0.9 : 0.5,
                      }}
                    />
                  </div>

                  {/* Note */}
                  {provider.note && (
                    <p className="text-xs text-muted/50">{provider.note}</p>
                  )}
                </div>
              );
            })}
        </div>

        <p className="mt-8 text-xs text-muted/50 text-center max-w-xl mx-auto">
          Estimates based on publicly available pricing pages as of Apr 2026.
          Actual costs may vary by plan, region, and negotiated contracts; verify
          with each provider. Self-hosted storage costs are not included due to
          high variability.
        </p>
      </div>
    </section>
  );
}
