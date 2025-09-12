import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AppRow = {
  name: string;
  version?: string | null;
  rating?: number | null;
  latestUpdate?: string | null;   // ← texte complet reçu du parent
  lastUpdatedAt?: string | null;
  platform: "ios" | "android";
  bundleId: string;
};

type Props = {
  currentApp: AppRow;
  linkedApps?: AppRow[];
  className?: string;
  truncateAt?: number;            // ← optionnel (par défaut 80)
};

const truncate = (s?: string | null, n = 80) =>
  s && s.length > n ? s.slice(0, n) + "…" : s || "";

export function AppDetailsTable({
  currentApp,
  linkedApps = [],
  className,
  truncateAt = 80,
}: Props) {
  // états d’expansion par ligne (clé = bundleId)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const rows: AppRow[] = [currentApp, ...linkedApps];

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="divide-y">
          {rows.map((row) => {
            const key = row.bundleId;
            const full = row.latestUpdate || "";
            const isLong = full.length > truncateAt;
            const showFull = !!expanded[key];
            const display = showFull ? full : truncate(full, truncateAt);

            return (
              <div key={key} className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-medium">{row.name}</div>
                  <div className="text-sm text-muted-foreground">
                    v{row.version || "Unknown"} · {row.platform.toUpperCase()}
                  </div>
                </div>

                {full && (
                  <div className="text-sm leading-relaxed">
                    {display}
                    {isLong && (
                      <Button
                        variant="link"
                        size="sm"
                        className="px-1 ml-1 align-baseline"
                        onClick={() => toggle(key)}
                      >
                        {showFull ? "Show less" : "Show more"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}