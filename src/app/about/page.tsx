'use client';

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8">

      {/* The Problem */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-6 rounded-full bg-clinical-danger" />
          <h1 className="text-lg font-bold text-foreground">The Problem</h1>
        </div>

        <div className="bg-clinical-danger-bg border border-clinical-danger-border rounded-lg px-5 py-5 space-y-4">
          <p className="text-base font-semibold text-clinical-danger">
            90&ndash;95% of drug interaction alerts are overridden by clinicians.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Current CDS systems use <strong className="text-foreground">static, binary lookups</strong> &mdash; if Drug A and Drug B are on the same list, an alert fires. Every time. Regardless of whether the patient is actually at risk.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '5-15', label: 'drugs per ICU patient' },
              { value: '300+', label: 'alerts per physician/day' },
              { value: '93%', label: 'override rate' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded bg-white border border-border">
                <div className="text-xl font-bold vitals text-foreground">{stat.value}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This creates <strong className="text-foreground">alert fatigue</strong> &mdash; clinicians learn to ignore all alerts, including the rare ones that matter. The safety system becomes background noise.
          </p>
        </div>
      </section>

      {/* How Might We */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-6 rounded-full bg-primary" />
          <h1 className="text-lg font-bold text-foreground">How Might We</h1>
        </div>

        <div className="bg-white border-2 border-primary/20 rounded-lg px-5 py-5">
          <p className="text-base font-medium text-primary leading-relaxed">
            How might we make drug interaction alerts fire only when a patient is <em>actually</em> in danger &mdash; so that when an alert appears, clinicians trust it and act on it?
          </p>
        </div>
      </section>

      {/* The Solution */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-6 rounded-full bg-clinical-safe" />
          <h1 className="text-lg font-bold text-foreground">The Solution</h1>
        </div>

        <div className="bg-clinical-safe-bg border border-clinical-safe-border rounded-lg px-5 py-5 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Context-Aware CDS</strong> replaces static lookups with a <strong className="text-foreground">dynamic risk engine</strong> that cross-references two things in real time:
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded bg-white border border-border space-y-1.5">
              <span className="text-[10px] font-bold text-clinical-info uppercase tracking-wider">What drugs</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Which drugs the patient is on, how they interact, and which organ clears them
              </p>
            </div>
            <div className="p-3.5 rounded bg-white border border-border space-y-1.5">
              <span className="text-[10px] font-bold text-clinical-warn uppercase tracking-wider">What organs</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Whether that organ is actually failing &mdash; using live labs and their trend
              </p>
            </div>
          </div>

          <div className="border-t border-clinical-safe-border pt-3 space-y-2">
            <p className="text-xs font-semibold text-foreground">The key insight:</p>
            {[
              { n: '1', color: 'text-clinical-safe', text: 'Two nephrotoxic drugs with normal kidney function = theoretical risk only. No alert.' },
              { n: '2', color: 'text-clinical-warn', text: 'Same drugs but creatinine trending up = clearance degrading. Monitor.' },
              { n: '3', color: 'text-clinical-danger', text: 'Same drugs with GFR below 40 and rising creatinine = drugs accumulating past safe levels. Intervene now — with specific mechanism and recommended alternative.' },
            ].map((item) => (
              <div key={item.n} className="flex gap-2 text-xs text-muted-foreground">
                <span className={`font-bold flex-shrink-0 ${item.color}`}>{item.n}.</span>
                <span className="leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-clinical-safe-border pt-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Instead of 12 generic warnings, clinicians get <strong className="text-clinical-safe">1 precise alert</strong> at exactly the moment it matters &mdash; fewer alerts, higher trust, better outcomes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
