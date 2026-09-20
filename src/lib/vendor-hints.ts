export type Category = "kid_activity" | "gym" | "insurance_utility" | "storage_misc";

export type VendorHint = {
  name: string;
  aliases: string[];
  category: Category;
  cycleDays: number;
  noticeDays: number;
};

const VENDOR_HINTS: VendorHint[] = [
  { name: "Planet Fitness", aliases: ["pf"], category: "gym", cycleDays: 30, noticeDays: 30 },
  { name: "LA Fitness", aliases: [], category: "gym", cycleDays: 30, noticeDays: 30 },
  { name: "Anytime Fitness", aliases: [], category: "gym", cycleDays: 30, noticeDays: 30 },
  { name: "Crunch Fitness", aliases: [], category: "gym", cycleDays: 30, noticeDays: 30 },
  { name: "24 Hour Fitness", aliases: [], category: "gym", cycleDays: 30, noticeDays: 30 },

  { name: "State Farm", aliases: [], category: "insurance_utility", cycleDays: 180, noticeDays: 30 },
  { name: "Geico", aliases: [], category: "insurance_utility", cycleDays: 180, noticeDays: 30 },
  { name: "Progressive", aliases: [], category: "insurance_utility", cycleDays: 180, noticeDays: 30 },
  { name: "Allstate", aliases: [], category: "insurance_utility", cycleDays: 180, noticeDays: 30 },
  { name: "Verizon", aliases: [], category: "insurance_utility", cycleDays: 30, noticeDays: 30 },

  { name: "Public Storage", aliases: [], category: "storage_misc", cycleDays: 30, noticeDays: 10 },
  { name: "Extra Space Storage", aliases: ["extra space"], category: "storage_misc", cycleDays: 30, noticeDays: 10 },
  { name: "CubeSmart", aliases: [], category: "storage_misc", cycleDays: 30, noticeDays: 10 },
  { name: "Life Storage", aliases: [], category: "storage_misc", cycleDays: 30, noticeDays: 10 },
];

export function hintsForCategory(category: Category): VendorHint[] {
  return VENDOR_HINTS.filter((hint) => hint.category === category);
}

export function findVendorHint(category: Category, query: string): VendorHint | null {
  const needle = query.trim().toLowerCase();
  if (!needle) return null;

  const match = VENDOR_HINTS.find(
    (hint) =>
      hint.category === category &&
      (hint.name.toLowerCase().includes(needle) ||
        hint.aliases.some((alias) => alias.toLowerCase().includes(needle)))
  );

  return match ?? null;
}
