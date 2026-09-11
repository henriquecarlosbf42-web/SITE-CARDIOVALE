"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { insurancePlans } from "@/lib/data/insurance-plans";

export function InsuranceSearch() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? insurancePlans.filter((plan) => plan.name.toLowerCase().includes(normalized))
    : [];

  return (
    <div className="mx-auto max-w-md">
      <div className="border-beam relative rounded-full">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Busque pelo nome do seu convênio"
          className="w-full rounded-full border border-ink-100 bg-white py-3 pl-11 pr-4 text-center text-sm text-ink-900 shadow-soft outline-none placeholder:text-ink-600 focus:border-brand"
        />
      </div>

      {normalized && (
        <div className="mt-5">
          {results.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-3">
              {results.map((plan) => (
                <div
                  key={plan.file}
                  className="flex h-16 w-32 items-center justify-center rounded-card border border-ink-100 bg-white p-3 shadow-soft"
                >
                  <Image
                    src={`/images/convenios/${plan.file}`}
                    alt={plan.name}
                    width={1550}
                    height={1020}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-ink-600">
              Não encontramos esse convênio na lista — fale com a recepção
              pra confirmar.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
