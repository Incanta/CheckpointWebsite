"use client";

import { JSX, useState } from "react";

const faqs = [
  {
    question: "What counts as an active user?",
    answer:
      (<span>
        An active write user (AWU) is anyone who commits, locks files,
        creates branches, or merges pull requests in a given month. An
        active read user (ARU) is anyone who clones, checks out, or reads
        the repository without making changes. Users who don't interact
        with the repo that month aren't counted.
      </span>),
  },
  {
    question: "How does storage billing work?",
    answer:
      (<span>
        Cloud storage is $1/mo for up to 10 GB, then $4.50 per additional 50 GB/mo.
        500 GB of bandwidth is included each month, with overages billed at $0.01/GB.
        If you self-host, storage is entirely on you; use whatever infrastructure you prefer.
      </span>),
  },
  {
    question: "What's the $5 minimum charge about?",
    answer:
      (<div>
        <span>Our payment processing fees are a high percentage for small transactions,
        so to be able to charge you as little as $1 in a particular month, we
        set a minimum charge of $5.</span><br/>
        <br/>
        <span>Here's how billing works:</span>
        <ol className="list-decimal list-inside space-y-1 mt-2 text-sm text-muted">
          <li>At the end of each month, we calculate your total charge based on active users and storage.</li>
          <li>We apply any applicable discounts or credits from prior months.</li>
          <li>If the total is less than $5, we charge $5 and roll over the difference as credit toward future months.</li>
          <li>If the total is $5 or more, we charge the full amount as usual.</li>
        </ol>
        <br />
        <strong>If your bill is $0 for the month, no charge is made.</strong>
      </div>),
  },
  {
    question: "Can I receive a refund for unused credit?",
    answer:
      (<span>
        Yes, up to 6 months after payment! If you have a positive credit balance
        and would like to request a refund, please <a href="/contact" className="text-primary hover:underline">contact us</a>.
      </span>),
  },
  {
    question: "What's the difference between Cloud and Self-hosted?",
    answer:
      (<span>
        Cloud is fully managed by us: zero setup, automatic updates,
        built-in storage, and guaranteed uptime. Self-hosted means you
        run Checkpoint on your own infrastructure. The core is open source
        and free to self-host; Pro and Studio tiers have a small per-user
        fee for the additional features.
      </span>),
  },
  {
    question: "Is the open source version really free to self-host?",
    answer:
      (<span>
        Yes. The Basic tier, checkouts, locking, branching, and all clients,
        is completely free when self-hosted. You can find the source and
        instructions on GitHub. We ask that you respect the license and
        consider contributing back if you build something useful.
      </span>),
  },
  {
    question: "What is a \"write user\" vs a \"read user\"?",
    answer:
      (<span>
        Write users can make changes: commits, locks, branches, pull requests.
        Read users can view and download the repository contents but cannot
        push changes. Read users are cheaper because they consume less infrastructure.
        Both are only counted in months where they're actually active.
      </span>),
  },
  {
    question: "Can I mix Cloud and Self-hosted across my team?",
    answer:
      (<span>
        No, an organization is on either Cloud or Self-hosted. However, you
        can run multiple organizations if you genuinely need a split setup.
      </span>),
  },
  {
    question: "Do you support large binary files like textures, meshes, or video?",
    answer:
      (<span>
        That's exactly what Checkpoint is built for. There are no artificial
        file size limits. Large binaries are stored and transferred efficiently
        without bloating history, unlike systems that bolt on LFS as an afterthought.
      </span>),
  },
  {
    question: "What is the free trial?",
    answer:
      (<span>
        Each new user can claim a one-month trial for an organization that hasn't
        received one before and is less than a week old. The trial includes up to
        3 active users and 10 GB of storage (a $13 value). Usage beyond those
        limits is billed normally.
      </span>),
  },
  {
    question: "Why don't you have a free storage tier for cloud?",
    answer:
      (<span>
        We're a small team without deep pockets, so we have to be mindful of our costs.
        Cloud storage isn't free for us, and offering a free tier would lead to abuse
        and unsustainable expenses. Free tiers from other providers are subsidized by
        high profit margins in their paid plans
        It also enables us to offer a flexible pricing model that scales with your usage
        and reduce our profit margins to pass savings onto you, rather than cutting you off at an arbitrary limit.
      </span>),
  },
  {
    question: "Can I switch tiers later?",
    answer:
      (<span>
        Yes, you can upgrade or downgrade at any time. Upgrades take effect immediately and are prorated;
        downgrades apply at the start of the next billing cycle.
      </span>),
  },
];

function FaqItem({ question, answer }: { question: string; answer: JSX.Element }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass rounded-2xl overflow-hidden transition-all duration-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-surface-hover transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-medium">{question}</span>
        <svg
          className={`w-4 h-4 text-muted shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm text-muted leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="relative py-32 overflow-hidden">
      {/* Divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-muted text-lg">
            Still have questions?{" "}
            <a
              href="https://github.com/Incanta/Checkpoint/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-light hover:underline"
            >
              Ask on GitHub
            </a>
            .
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
