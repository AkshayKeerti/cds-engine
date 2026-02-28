'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">

      {/* The Problem */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-8 rounded-full bg-danger" />
          <h1 className="text-2xl font-bold">The Problem</h1>
        </div>

        <Card className="border-danger/20 bg-danger/5">
          <CardContent className="py-6 space-y-4">
            <p className="text-lg font-medium text-danger">
              90–95% of drug interaction alerts are overridden by clinicians.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Current Clinical Decision Support (CDS) systems use <strong className="text-foreground">static, binary lookups</strong> — if Drug A and Drug B are on the same list, an alert fires. Every time. Regardless of whether the patient is actually at risk.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <div className="text-2xl font-bold text-danger">5–15</div>
                <div className="text-xs text-muted-foreground mt-1">drugs per ICU patient</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <div className="text-2xl font-bold text-warn">300+</div>
                <div className="text-xs text-muted-foreground mt-1">alerts per physician per day</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <div className="text-2xl font-bold text-danger">93%</div>
                <div className="text-xs text-muted-foreground mt-1">override rate</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This creates <strong className="text-foreground">alert fatigue</strong> — clinicians learn to ignore all alerts, including the rare ones that matter. The result: preventable adverse drug events still harm patients, and the safety system designed to stop them has become background noise.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* How Might We */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-8 rounded-full bg-primary" />
          <h1 className="text-2xl font-bold">How Might We</h1>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-6">
            <p className="text-lg font-medium text-primary leading-relaxed">
              How might we make drug interaction alerts fire only when a patient is <em>actually</em> in danger — so that when an alert appears, clinicians trust it and act on it?
            </p>
          </CardContent>
        </Card>
      </section>

      {/* The Solution */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-8 rounded-full bg-safe" />
          <h1 className="text-2xl font-bold">The Solution</h1>
        </div>

        <Card className="border-safe/20 bg-safe/5">
          <CardContent className="py-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Context-Aware CDS</strong> replaces static lookups with a <strong className="text-foreground">dynamic risk engine</strong> that cross-references two things in real time:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                <Badge className="bg-info text-white">What drugs</Badge>
                <p className="text-sm text-muted-foreground">
                  Which drugs the patient is on, how they interact, and which organ clears them (renal, hepatic)
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                <Badge className="bg-warn text-black">What organs</Badge>
                <p className="text-sm text-muted-foreground">
                  Whether that organ is actually failing — using live labs (creatinine, GFR, liver enzymes) and their trend
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <p className="text-sm font-medium">The key insight:</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex gap-2">
                  <span className="text-safe flex-shrink-0">1.</span>
                  <span>Two nephrotoxic drugs with <strong className="text-foreground">normal kidney function</strong> = theoretical risk only. <strong className="text-safe">No alert.</strong></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-warn flex-shrink-0">2.</span>
                  <span>Same drugs but <strong className="text-foreground">creatinine trending up</strong> = clearance pathway degrading. <strong className="text-warn">Monitor.</strong></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-danger flex-shrink-0">3.</span>
                  <span>Same drugs with <strong className="text-foreground">GFR below 40 and rising creatinine</strong> = drugs accumulating past safe levels. <strong className="text-danger">Intervene now</strong> — with specific mechanism, projected risk, and recommended alternative.</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                The result: instead of 12 generic warnings that get overridden, clinicians get <strong className="text-safe">1 precise alert</strong> at exactly the moment it matters — with enough context to act immediately. Fewer alerts, higher trust, better outcomes.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
