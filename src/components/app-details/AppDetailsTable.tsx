// src/components/app-details/AppDetailsTable.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type AppRow = {
  name: string;
  version?: string | null;
  rating?: number | null;
  latestUpdate?: string | null;   // ← TEXTE COMPLET reçu du parent
  lastUpdatedAt?: string | null;
  platform: "ios" | "android";
  bundleId: string;
};

type Props = {
  currentApp: AppRow;
  linkedApps?: AppRow[];
  className?: string;
  truncateAt?: number; // longueur d’aperçu (par défaut 80)
  onShowMore?: (fullText: string, appName: string) => void; // callback vers le parent
};

const truncate = (s?: string | null, n = 80) =>
  s && s.length > n ? s.slice(0, n) + "…" : s || "";

export function AppDetailsTable({
  currentApp,
  linkedApps = [],
  className,
  truncateAt = 80,
  onShowMore,
}: Props) {
  const rows: AppRow[] = [currentApp, ...linkedApps];

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="divide-y">
          {rows.map((row) => {
            const full = row.latestUpdate || ""; // ✅ garde le TEXTE COMPLET
            const isLong = full.length > truncateAt;
            const preview = truncate(full, truncateAt); // tronque pour l’AFFICHAGE uniquement

            return (
              <div key={row.bundleId} className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-medium">{row.name}</div>
                  <div className="text-sm text-muted-foreground">
                    v{row.version || "Unknown"} · {row.platform.toUpperCase()}
                  </div>
                </div>

                {full && (
                  <div className="text-sm leading-relaxed">
                    {preview}{" "}
                    {isLong && (
                      <Button
                        variant="link"
                        size="sm"
                        className="px-1 ml-1 align-baseline"
                        onClick={() => onShowMore?.(full, row.name)} // ✅ envoie le TEXTE COMPLET
                      >
                        Show more
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