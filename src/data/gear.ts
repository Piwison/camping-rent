import type { GearItem, GearBundle } from "@/types/gear";

// The literal Catalog is private to this module — callers read it only through
// the query functions below, so the Phase 2 datastore swap (ADR-0001) stays
// behind this seam.
const items: GearItem[] = [
  {
    id: "tent-01",
    slug: "canvas-bell-tent-4m",
    name: "Canvas Bell Tent 4m",
    nameChinese: "帆布鐘形帳篷 4公尺",
    category: "shelter",
    dailyPrice: 800,
    description:
      "A spacious, beautifully proportioned canvas bell tent that transforms any campsite into a sanctuary. Natural cotton canvas breathes in summer warmth.",
    descriptionChinese: "寬敞優美的帆布鐘形帳篷，讓每個營地都成為你的私人空間。",
    images: [
      "https://picsum.photos/seed/tent01a/800/600",
      "https://picsum.photos/seed/tent01b/800/600",
      "https://picsum.photos/seed/tent01c/800/600",
    ],
    specs: [
      { label: "Diameter", value: "4 m" },
      { label: "Height", value: "2.5 m" },
      { label: "Capacity", value: "2–4 persons" },
      { label: "Material", value: "280g Cotton canvas" },
      { label: "Setup time", value: "~30 min" },
    ],
    featured: true,
  },
  {
    id: "tent-02",
    slug: "a-frame-ridge-tent",
    name: "A-Frame Ridge Tent",
    nameChinese: "A型稜線帳篷",
    category: "shelter",
    dailyPrice: 500,
    description:
      "Classic silhouette, modern materials. This A-frame tent pairs effortlessly with a tarp overhead for a layered, editorial campsite look.",
    descriptionChinese: "經典外型，現代材質，搭配天幕更顯層次美感。",
    images: [
      "https://picsum.photos/seed/tent02a/800/600",
      "https://picsum.photos/seed/tent02b/800/600",
    ],
    specs: [
      { label: "Footprint", value: "220 × 130 cm" },
      { label: "Height", value: "110 cm" },
      { label: "Capacity", value: "2 persons" },
      { label: "Material", value: "210T Polyester" },
      { label: "Setup time", value: "~15 min" },
    ],
  },
  {
    id: "tarp-01",
    slug: "waxed-canvas-tarp-3x4",
    name: "Waxed Canvas Tarp 3×4m",
    nameChinese: "蠟塗帆布天幕 3×4公尺",
    category: "shelter",
    dailyPrice: 350,
    description:
      "A generously proportioned waxed canvas tarp. The warm khaki tone photographs beautifully and provides shade over dining and lounge areas.",
    descriptionChinese: "寬大蠟塗帆布天幕，卡其色調搭配任何場景都好看。",
    images: [
      "https://picsum.photos/seed/tarp01a/800/600",
      "https://picsum.photos/seed/tarp01b/800/600",
    ],
    specs: [
      { label: "Size", value: "3 × 4 m" },
      { label: "Material", value: "Waxed 380g canvas" },
      { label: "Includes", value: "8× guy ropes, 8× stakes" },
    ],
    featured: true,
  },
  {
    id: "table-01",
    slug: "folding-teak-camp-table",
    name: "Folding Teak Camp Table",
    nameChinese: "折疊柚木露營桌",
    category: "furniture",
    dailyPrice: 280,
    description:
      "Solid teak slats on a powder-coated steel frame. Folds flat for transport, opens in seconds. The kind of table that makes camp food taste better.",
    descriptionChinese: "實木柚木桌面搭配烤漆鋼架，折疊收納，輕鬆展開。",
    images: [
      "https://picsum.photos/seed/table01a/800/600",
      "https://picsum.photos/seed/table01b/800/600",
    ],
    specs: [
      { label: "Open size", value: "90 × 60 × 72 cm" },
      { label: "Folded size", value: "90 × 60 × 8 cm" },
      { label: "Weight", value: "5.2 kg" },
      { label: "Capacity", value: "Up to 6 persons" },
    ],
    featured: true,
  },
  {
    id: "chair-01",
    slug: "canvas-director-chair",
    name: "Canvas Director Chair",
    nameChinese: "帆布導演椅",
    category: "furniture",
    dailyPrice: 180,
    description:
      "The director chair is a campsite icon. Ours has a wider seat, reinforced stitching, and a natural canvas that ages gracefully.",
    descriptionChinese: "露營必備導演椅，加寬座面，耐用帆布，越用越有味道。",
    images: [
      "https://picsum.photos/seed/chair01a/800/600",
      "https://picsum.photos/seed/chair01b/800/600",
    ],
    specs: [
      { label: "Seat height", value: "44 cm" },
      { label: "Weight limit", value: "120 kg" },
      { label: "Material", value: "300D Oxford canvas + beech frame" },
    ],
  },
  {
    id: "chair-02",
    slug: "low-lounge-camp-chair",
    name: "Low Lounge Chair",
    nameChinese: "低腳休閒椅",
    category: "furniture",
    dailyPrice: 150,
    description:
      "Sink low, relax completely. This low-profile chair is perfect around the fire pit or under the tarp, with a recline that encourages staying a while.",
    descriptionChinese: "貼地低座，適合火堆旁或天幕下放鬆，讓你不想起身。",
    images: [
      "https://picsum.photos/seed/chair02a/800/600",
    ],
    specs: [
      { label: "Seat height", value: "22 cm" },
      { label: "Recline", value: "3-position" },
      { label: "Weight limit", value: "100 kg" },
    ],
  },
  {
    id: "kitchen-01",
    slug: "camp-kitchen-set",
    name: "Camp Kitchen Set",
    nameChinese: "露營廚房套組",
    category: "kitchen",
    dailyPrice: 450,
    description:
      "Everything you need to cook a proper meal at camp: a two-burner gas stove, cast iron pan, enamel pot, cutting board, and utensil roll.",
    descriptionChinese: "完整露營廚房：雙爐瓦斯爐、鑄鐵鍋、琺瑯鍋、砧板與餐具組。",
    images: [
      "https://picsum.photos/seed/kitchen01a/800/600",
      "https://picsum.photos/seed/kitchen01b/800/600",
    ],
    specs: [
      { label: "Stove", value: "2-burner, up to 3000W/burner" },
      { label: "Cookware", value: "Cast iron 26cm pan + 18cm enamel pot" },
      { label: "Includes", value: "Cutting board, utensil roll, lighter" },
    ],
    featured: true,
  },
  {
    id: "kitchen-02",
    slug: "enamel-tableware-set-4",
    name: "Enamel Tableware Set (4 persons)",
    nameChinese: "琺瑯餐具組（四人份）",
    category: "kitchen",
    dailyPrice: 200,
    description:
      "Speckled enamel plates, mugs, and bowls for four. The kind of tableware that makes instant ramen feel like a curated meal.",
    descriptionChinese: "四人份琺瑯餐盤、馬克杯與碗，讓每一餐都有質感。",
    images: [
      "https://picsum.photos/seed/enamel01a/800/600",
    ],
    specs: [
      { label: "Set includes", value: "4× plate, 4× mug, 4× bowl" },
      { label: "Material", value: "Speckled enamel on steel" },
      { label: "Dishwasher safe", value: "Yes" },
    ],
  },
  {
    id: "light-01",
    slug: "brass-oil-lantern",
    name: "Brass Oil Lantern",
    nameChinese: "黃銅煤油燈",
    category: "lighting",
    dailyPrice: 150,
    description:
      "A brass oil lantern that casts the warmest light imaginable. No batteries, no charging — just a wick, oil, and the best ambient glow in the forest.",
    descriptionChinese: "黃銅煤油燈，散發最溫暖的光，不需電池，盡享林間氛圍。",
    images: [
      "https://picsum.photos/seed/lantern01a/800/600",
      "https://picsum.photos/seed/lantern01b/800/600",
    ],
    specs: [
      { label: "Fuel", value: "Lamp oil (included)" },
      { label: "Burn time", value: "~8 hrs per fill" },
      { label: "Height", value: "28 cm" },
    ],
    featured: true,
  },
  {
    id: "light-02",
    slug: "string-lights-10m",
    name: "String Lights 10m",
    nameChinese: "串燈 10公尺",
    category: "lighting",
    dailyPrice: 100,
    description:
      "Warm Edison bulbs strung across 10 metres of cable. Run them overhead between trees for an instant camp atmosphere after dark.",
    descriptionChinese: "暖色愛迪生燈泡，10公尺串燈，讓夜晚的營地充滿氛圍。",
    images: [
      "https://picsum.photos/seed/lights01a/800/600",
    ],
    specs: [
      { label: "Length", value: "10 m" },
      { label: "Bulbs", value: "20× E12 2W warm white" },
      { label: "Power", value: "USB-C, 5V/2A" },
    ],
  },
  {
    id: "bedding-01",
    slug: "linen-sleeping-bag",
    name: "Linen Sleeping Bag",
    nameChinese: "亞麻睡袋",
    category: "bedding",
    dailyPrice: 250,
    description:
      "A breathable linen sleeping bag liner for Taiwan's temperate camping conditions. Light enough for summer, layerable for cooler nights.",
    descriptionChinese: "透氣亞麻睡袋，適合台灣四季露營，夏輕冬疊。",
    images: [
      "https://picsum.photos/seed/sleeping01a/800/600",
    ],
    specs: [
      { label: "Size", value: "210 × 80 cm" },
      { label: "Material", value: "100% washed linen" },
      { label: "Temperature", value: "15–28°C comfort" },
    ],
  },
  {
    id: "other-01",
    slug: "camp-rug-jute",
    name: "Jute Camp Rug 120×180cm",
    nameChinese: "黃麻地毯 120×180公分",
    category: "other",
    dailyPrice: 180,
    description:
      "A natural jute rug that anchors a living space at camp. Defines the lounge area, softens the ground, and photographs in every tone.",
    descriptionChinese: "天然黃麻地毯，劃定營地起居區，質感畫面的關鍵。",
    images: [
      "https://picsum.photos/seed/rug01a/800/600",
    ],
    specs: [
      { label: "Size", value: "120 × 180 cm" },
      { label: "Material", value: "Natural jute" },
      { label: "Weight", value: "1.8 kg" },
    ],
  },
];

const bundles: GearBundle[] = [
  {
    id: "bundle-solo",
    slug: "solo-escape",
    name: "Solo Escape",
    nameChinese: "一人出走",
    tier: "solo",
    tagline: "Everything you need, nothing you don't.",
    description:
      "For the solo weekend wanderer. A minimal, beautiful setup that takes under an hour to pitch and looks incredible doing it.",
    itemIds: ["tent-02", "bedding-01", "light-01", "chair-02"],
    bundlePrice: 1800,
    originalPrice: 2200,
    images: [
      "https://picsum.photos/seed/bundle-solo-a/1200/800",
      "https://picsum.photos/seed/bundle-solo-b/1200/800",
    ],
    featured: true,
  },
  {
    id: "bundle-standard",
    slug: "camp-set",
    name: "Camp Set",
    nameChinese: "標準營地組",
    tier: "standard",
    tagline: "A full weekend, fully equipped.",
    description:
      "Our most popular bundle. Shelter, dining, cooking, and light — everything two people need for a proper weekend in nature.",
    itemIds: ["tent-01", "tarp-01", "table-01", "chair-01", "chair-01", "kitchen-01", "light-01"],
    bundlePrice: 3200,
    originalPrice: 4120,
    images: [
      "https://picsum.photos/seed/bundle-std-a/1200/800",
      "https://picsum.photos/seed/bundle-std-b/1200/800",
      "https://picsum.photos/seed/bundle-std-c/1200/800",
    ],
    featured: true,
  },
  {
    id: "bundle-deluxe",
    slug: "full-grounds",
    name: "Full Grounds",
    nameChinese: "完整營地",
    tier: "deluxe",
    tagline: "The complete glamping experience.",
    description:
      "No compromises. The Full Grounds bundle creates a finished, editorial campsite — the kind that makes strangers stop and ask where you got your gear.",
    itemIds: [
      "tent-01", "tarp-01", "table-01",
      "chair-01", "chair-01", "chair-02", "chair-02",
      "kitchen-01", "kitchen-02",
      "light-01", "light-02",
      "bedding-01", "other-01",
    ],
    bundlePrice: 5800,
    originalPrice: 7480,
    images: [
      "https://picsum.photos/seed/bundle-dlx-a/1200/800",
      "https://picsum.photos/seed/bundle-dlx-b/1200/800",
    ],
    featured: true,
  },
];

export function listItems(): readonly GearItem[] {
  return items;
}

export function listBundles(): readonly GearBundle[] {
  return bundles;
}

export function featuredItems(): GearItem[] {
  return items.filter((i) => i.featured);
}

export function featuredBundles(): GearBundle[] {
  return bundles.filter((b) => b.featured);
}

export function getItemById(id: string): GearItem | undefined {
  return items.find((i) => i.id === id);
}

export function getItemBySlug(slug: string): GearItem | undefined {
  return items.find((i) => i.slug === slug);
}

export function getBundleBySlug(slug: string): GearBundle | undefined {
  return bundles.find((b) => b.slug === slug);
}

export function getBundleItems(bundle: GearBundle): GearItem[] {
  return bundle.itemIds
    .map((id) => getItemById(id))
    .filter((item): item is GearItem => item !== undefined);
}

// Every Item and Bundle slug — the routable detail pages under /gear/[slug].
export function allCatalogSlugs(): string[] {
  return [...items, ...bundles].map((entry) => entry.slug);
}
