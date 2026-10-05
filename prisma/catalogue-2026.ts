/**
 * The 2026 additions to the range. Kept out of `seed.ts` so the original twelve
 * and their helpers stay readable; `seed.ts` concatenates the two lists.
 *
 * Renders in `public/products/` for these units were generated from the studio's
 * own catalogue shots as style references — same white sweep, same lighting, same
 * three-quarter framing — so the grid reads as one range rather than two. The
 * sweep was then matted out, so they carry an alpha channel like the Figma
 * exports beside them and the contact shadow survives as transparent black.
 */

type Spec = { label: string; labelAr: string; value: string; valueAr: string };

const specs = (width: string, depth: string, height: string): Spec[] => [
  { label: "Widths", labelAr: "العروض", value: width, valueAr: width },
  { label: "Depth", labelAr: "العمق", value: depth, valueAr: depth },
  { label: "Height", labelAr: "الارتفاع", value: height, valueAr: height },
  {
    label: "Core",
    labelAr: "القلب",
    value: "Marine-grade plywood, 18 mm",
    valueAr: "خشب بحري، ١٨ مم",
  },
  {
    label: "Edge",
    labelAr: "الحواف",
    value: "CNC-cut, laser-sealed",
    valueAr: "قص CNC، حواف ملحومة بالليزر",
  },
  {
    label: "Hardware",
    labelAr: "المفصلات",
    value: "Soft-close, push-to-open",
    valueAr: "إغلاق هادئ، فتح بالضغط",
  },
  {
    label: "Mounting",
    labelAr: "التثبيت",
    value: "Wall-hung rail, concealed",
    valueAr: "سكة حائطية مخفية",
  },
  { label: "Lead time", labelAr: "مدة التنفيذ", value: "3–4 weeks", valueAr: "٣–٤ أسابيع" },
];

const standard: Array<{ label: string; cm: number; priceDelta: number }> = [
  { label: "80cm", cm: 80, priceDelta: 0 },
  { label: "100cm", cm: 100, priceDelta: 450 },
  { label: "120cm", cm: 120, priceDelta: 900 },
  { label: "140cm", cm: 140, priceDelta: 1400 },
];

const wide = standard.slice(1);
const compact = [
  { label: "60cm", cm: 60, priceDelta: 0 },
  { label: "80cm", cm: 80, priceDelta: 380 },
];
const doubleSizes = [
  { label: "140cm", cm: 140, priceDelta: 0 },
  { label: "160cm", cm: 160, priceDelta: 720 },
  { label: "180cm", cm: 180, priceDelta: 1450 },
];
const towerSizes = [
  { label: "100cm", cm: 100, priceDelta: 0 },
  { label: "120cm", cm: 120, priceDelta: 650 },
  { label: "140cm", cm: 140, priceDelta: 1200 },
];
const tallOnly = [{ label: "40cm", cm: 40, priceDelta: 0 }];

export const catalogue2026 = [
  {
    slug: "verde-floating-vanity",
    name: "Verde Floating Vanity",
    nameAr: "وحدة فيردي المعلّقة",
    collection: "Verde",
    collectionAr: "فيردي",
    type: "vanity" as const,
    tagline: "Emerald matte, brushed brass, one clean drawer.",
    taglineAr: "زمردي مطفي، نحاس مصنفر، درج واحد نظيف.",
    description:
      "Green is the colour people ask for and then lose their nerve over. Emerald at this depth behaves: it reads almost black in a dim room and only shows its colour when daylight reaches it, which is exactly when you want it to.",
    descriptionAr:
      "الأخضر هو اللون الذي يطلبه الناس ثم يترددون فيه. الزمردي بهذا العمق لا يصرخ: يبدو أقرب للأسود في الإضاءة الخافتة ولا يُظهر لونه إلا حين يصله ضوء النهار، وهو تحديدًا ما تريده.",
    basePrice: 4850,
    featured: true,
    isNew: true,
    sortOrder: 13,
    specs: specs("80 · 100 · 120 · 140 cm", "48 cm", "50 cm"),
    finishes: [
      { key: "matte", label: "Emerald Matte", labelAr: "زمردي مطفي", swatch: "#0f4536", imageUrl: "/products/verde-floating-vanity-01.webp" },
      { key: "gloss", label: "Emerald Gloss", labelAr: "زمردي لامع", swatch: "#0b5a42", imageUrl: "/products/verde-floating-vanity-02.webp", priceDelta: 210 },
    ],
    sizes: standard,
    images: [
      { url: "/products/verde-floating-vanity-01.webp", alt: "Verde floating vanity in emerald matte", finishKey: "matte" },
      { url: "/products/verde-floating-vanity-02.webp", alt: "Verde vanity, front elevation", elevation: true },
    ],
  },
  {
    slug: "basalt-stone-vanity",
    name: "Basalt Stone Vanity",
    nameAr: "وحدة بازلت الحجرية",
    collection: "Basalt",
    collectionAr: "بازلت",
    type: "vanity" as const,
    tagline: "Dark stone grain, recessed black pull.",
    taglineAr: "عروق حجرية داكنة، مقبض أسود غائر.",
    description:
      "A stone décor with the veining running horizontally across the full drawer, so a 140 cm front reads as one slab rather than a repeat. The pull is milled into the top edge: nothing protrudes, nothing collects dust.",
    descriptionAr:
      "خامة حجرية بعروق تمتد أفقيًا عبر الدرج بالكامل، فتبدو واجهة ١٤٠ سم كأنها لوح واحد لا نقشة مكررة. المقبض محفور في الحافة العليا: لا شيء بارز ولا شيء يجمع الغبار.",
    basePrice: 5200,
    featured: true,
    isNew: true,
    sortOrder: 14,
    specs: specs("80 · 100 · 120 · 140 cm", "48 cm", "50 cm"),
    finishes: [
      { key: "matte", label: "Basalt Grey", labelAr: "رمادي بازلتي", swatch: "#3c3f44", imageUrl: "/products/basalt-stone-vanity-01.webp" },
      { key: "gloss", label: "Basalt Polished", labelAr: "بازلت مصقول", swatch: "#2f3338", imageUrl: "/products/basalt-stone-vanity-02.webp", priceDelta: 240 },
    ],
    sizes: standard,
    images: [
      { url: "/products/basalt-stone-vanity-01.webp", alt: "Basalt stone vanity in dark grey", finishKey: "matte" },
      { url: "/products/basalt-stone-vanity-02.webp", alt: "Basalt vanity, front elevation", elevation: true },
    ],
  },
  {
    slug: "dune-sand-vanity",
    name: "Dune Sand Vanity",
    nameAr: "وحدة ديون الرملية",
    collection: "Dune",
    collectionAr: "ديون",
    type: "vanity" as const,
    tagline: "Two drawers, warm sand suede, no handles at all.",
    taglineAr: "درجان، شامواه رملي دافئ، بلا مقابض نهائيًا.",
    description:
      "Push-to-open on both drawers, so the front is an uninterrupted plane. Sand suede is the one finish in the range that hides water spots entirely — worth knowing if the unit is for a bathroom three people share.",
    descriptionAr:
      "فتح بالضغط في الدرجين، فتبقى الواجهة سطحًا واحدًا بلا انقطاع. الشامواه الرملي هو التشطيب الوحيد في المجموعة الذي يخفي أثر الماء تمامًا — وهو ما يهمك إن كان الحمام لثلاثة أشخاص.",
    basePrice: 4350,
    isNew: true,
    sortOrder: 15,
    specs: specs("80 · 100 · 120 cm", "46 cm", "50 cm"),
    finishes: [
      { key: "matte", label: "Sand Suede", labelAr: "شامواه رملي", swatch: "#cbb89a", imageUrl: "/products/dune-sand-vanity-01.webp" },
      { key: "wood", label: "Sand & Oak", labelAr: "رملي وبلوط", swatch: "#c3a071", imageUrl: "/products/dune-sand-vanity-02.webp" },
    ],
    sizes: standard.slice(0, 3),
    images: [
      { url: "/products/dune-sand-vanity-01.webp", alt: "Dune sand vanity in suede beige", finishKey: "matte" },
      { url: "/products/dune-sand-vanity-02.webp", alt: "Dune vanity, front elevation", elevation: true },
    ],
  },
  {
    slug: "vela-fluted-oak-vanity",
    name: "Vela Fluted Oak Vanity",
    nameAr: "وحدة فيلا البلوط المضلّع",
    collection: "Vela",
    collectionAr: "فيلا",
    type: "vanity" as const,
    tagline: "Solid oak ribs, milled one at a time.",
    taglineAr: "أضلاع بلوط مصمتة، تُفرَّز واحدًا واحدًا.",
    description:
      "Every rib is a separate length of solid oak, radiused and glued to the carcass face rather than pressed into a sheet. It costs more and takes longer, and it is the only way the shadow between the ribs stays crisp after a year of steam.",
    descriptionAr:
      "كل ضلع قطعة بلوط مصمتة مستقلة، تُدوَّر حوافها وتُلصق على واجهة الهيكل بدل أن تُكبس في لوح واحد. تكلفتها أعلى ووقتها أطول، وهي الطريقة الوحيدة ليظل الظل بين الأضلاع حادًا بعد عام من البخار.",
    basePrice: 5400,
    featured: true,
    isNew: true,
    sortOrder: 16,
    specs: specs("100 · 120 · 140 cm", "48 cm", "50 cm"),
    finishes: [
      { key: "wood", label: "Natural Oak", labelAr: "بلوط طبيعي", swatch: "#d2ab76", imageUrl: "/products/vela-fluted-oak-vanity-01.webp" },
      { key: "matte", label: "Oak & Ivory", labelAr: "بلوط وعاجي", swatch: "#e5d9c4", imageUrl: "/products/vela-fluted-oak-vanity-02.webp" },
    ],
    sizes: wide,
    images: [
      { url: "/products/vela-fluted-oak-vanity-01.webp", alt: "Vela fluted oak vanity", finishKey: "wood" },
      { url: "/products/vela-fluted-oak-vanity-02.webp", alt: "Vela fluted vanity, front elevation", elevation: true },
    ],
  },
  {
    slug: "luna-double-vanity",
    name: "Luna Double Vanity",
    nameAr: "وحدة لونا المزدوجة",
    collection: "Luna",
    collectionAr: "لونا",
    type: "vanity" as const,
    tagline: "Two basins, one drawer, gloss white.",
    taglineAr: "حوضان، درج واحد، أبيض لامع.",
    description:
      "The drawer runs the full 160 cm under both basins on a single pair of runners rated to forty kilos, because two shorter drawers would have put a joint exactly where you reach.",
    descriptionAr:
      "يمتد الدرج ١٦٠ سم كاملة تحت الحوضين على زوج واحد من المجاري يتحمل أربعين كيلو، لأن درجين أقصر كانا سيضعان فاصلًا في المكان الذي تمد يدك إليه بالضبط.",
    basePrice: 6200,
    featured: true,
    isNew: true,
    sortOrder: 17,
    specs: specs("140 · 160 · 180 cm", "50 cm", "50 cm"),
    finishes: [
      { key: "gloss", label: "Gloss White", labelAr: "أبيض لامع", swatch: "#ffffff", imageUrl: "/products/luna-double-vanity-01.webp" },
      { key: "matte", label: "Matte White", labelAr: "أبيض مطفي", swatch: "#eceae6", imageUrl: "/products/luna-double-vanity-02.webp" },
    ],
    sizes: doubleSizes,
    images: [
      { url: "/products/luna-double-vanity-01.webp", alt: "Luna double vanity in gloss white", finishKey: "gloss" },
      { url: "/products/luna-double-vanity-02.webp", alt: "Luna double vanity, front elevation", elevation: true },
    ],
  },
  {
    slug: "cairo-terrazzo-vanity",
    name: "Cairo Terrazzo Vanity",
    nameAr: "وحدة القاهرة بالتيرازو",
    collection: "Cairo",
    collectionAr: "القاهرة",
    type: "vanity" as const,
    tagline: "Terrazzo top, poured and ground in Egypt.",
    taglineAr: "سطح تيرازو، يُصبّ ويُجلى في مصر.",
    description:
      "The top is cast in our own workshop from marble and granite offcuts, then ground back by hand until the chips sit flush. No two tops are the same, which is the point — and the basin is formed in the same pour rather than dropped in afterwards.",
    descriptionAr:
      "يُصبّ السطح في ورشتنا من بقايا الرخام والجرانيت، ثم يُجلى يدويًا حتى تستوي الحصى مع السطح. لا يتطابق سطحان أبدًا، وهذا هو المقصود — والحوض يتشكل في نفس الصبّة لا يُركَّب بعدها.",
    basePrice: 5100,
    isNew: true,
    sortOrder: 18,
    specs: specs("100 · 120 · 140 cm", "48 cm", "52 cm"),
    finishes: [
      { key: "matte", label: "Ivory Terrazzo", labelAr: "تيرازو عاجي", swatch: "#ded5c2", imageUrl: "/products/cairo-terrazzo-vanity-01.webp" },
      { key: "gloss", label: "Polished Terrazzo", labelAr: "تيرازو مصقول", swatch: "#cfc6b2", imageUrl: "/products/cairo-terrazzo-vanity-02.webp", priceDelta: 260 },
    ],
    sizes: wide,
    images: [
      { url: "/products/cairo-terrazzo-vanity-01.webp", alt: "Cairo terrazzo vanity", finishKey: "matte" },
      { url: "/products/cairo-terrazzo-vanity-02.webp", alt: "Cairo terrazzo vanity, front elevation", elevation: true },
    ],
  },
  {
    slug: "siwa-compact-vanity",
    name: "Siwa Compact Vanity",
    nameAr: "وحدة سيوة المدمجة",
    collection: "Siwa",
    collectionAr: "سيوة",
    type: "vanity" as const,
    tagline: "60 cm, 38 cm deep, for the cloakroom.",
    taglineAr: "٦٠ سم بعمق ٣٨ سم، لحمام الضيوف.",
    description:
      "Built for the half-bath under the stairs where a standard unit leaves no room to turn around. Thirty-eight centimetres deep and still takes a full-size drawer — the basin is shallower, not smaller.",
    descriptionAr:
      "صُممت لحمام الضيوف تحت السلم حيث لا تترك الوحدة العادية مساحة للحركة. عمق ثمانية وثلاثين سنتيمترًا ومع ذلك تستوعب درجًا بمقاس كامل — الحوض أقل عمقًا، لا أصغر حجمًا.",
    basePrice: 2950,
    isNew: true,
    sortOrder: 19,
    specs: specs("60 · 80 cm", "38 cm", "46 cm"),
    finishes: [
      { key: "matte", label: "Matte White", labelAr: "أبيض مطفي", swatch: "#f2f1ee", imageUrl: "/products/siwa-compact-vanity-01.webp" },
      { key: "wood", label: "Warm Oak", labelAr: "بلوط دافئ", swatch: "#c3a071", imageUrl: "/products/siwa-compact-vanity-02.webp" },
    ],
    sizes: compact,
    images: [
      { url: "/products/siwa-compact-vanity-01.webp", alt: "Siwa compact cloakroom vanity", finishKey: "matte" },
      { url: "/products/siwa-compact-vanity-02.webp", alt: "Siwa compact vanity, front elevation", elevation: true },
    ],
  },
  {
    slug: "mono-concrete-vanity",
    name: "Mono Concrete Vanity",
    nameAr: "وحدة مونو الأسمنتية",
    collection: "Mono",
    collectionAr: "مونو",
    type: "vanity" as const,
    tagline: "Concrete décor, black finger pull, nothing else.",
    taglineAr: "خامة أسمنتية، مقبض أسود غائر، ولا شيء آخر.",
    description:
      "Concrete without the weight or the sealing schedule: a mineral décor with the same fine mottling, over the same marine core as everything else we build. Pairs with black brassware and refuses to pair with anything gold.",
    descriptionAr:
      "مظهر الأسمنت دون وزنه ولا جدول عزله: خامة معدنية بنفس التحبب الدقيق، فوق القلب البحري نفسه الذي نبني به كل شيء. تتناغم مع الخلاطات السوداء وترفض أي شيء ذهبي.",
    basePrice: 4600,
    sortOrder: 20,
    specs: specs("80 · 100 · 120 cm", "48 cm", "50 cm"),
    finishes: [
      { key: "matte", label: "Pale Concrete", labelAr: "أسمنتي فاتح", swatch: "#b9b7b2", imageUrl: "/products/mono-concrete-vanity-01.webp" },
      { key: "gloss", label: "Dark Concrete", labelAr: "أسمنتي داكن", swatch: "#6f6e6b", imageUrl: "/products/mono-concrete-vanity-02.webp" },
    ],
    sizes: standard.slice(0, 3),
    images: [
      { url: "/products/mono-concrete-vanity-01.webp", alt: "Mono concrete-effect vanity", finishKey: "matte" },
      { url: "/products/mono-concrete-vanity-02.webp", alt: "Mono concrete vanity, front elevation", elevation: true },
    ],
  },
  {
    slug: "ruba-marble-vanity",
    name: "Ruba Marble Vanity",
    nameAr: "وحدة ربى الرخامية",
    collection: "Ruba",
    collectionAr: "ربى",
    type: "vanity" as const,
    tagline: "Marble top, white fronts, brass pulls.",
    taglineAr: "سطح رخامي، واجهات بيضاء، مقابض نحاسية.",
    description:
      "Twenty millimetres of honed marble with the vein running front to back, so it carries over the edge instead of stopping at it. The white fronts are deliberately plain — the top is already doing the talking.",
    descriptionAr:
      "عشرون مليمترًا من الرخام المصنفر بعرق يمتد من الأمام للخلف، فيستمر فوق الحافة بدل أن يتوقف عندها. الواجهات البيضاء بسيطة عن قصد — السطح يتكلم بما يكفي.",
    basePrice: 5650,
    featured: true,
    sortOrder: 21,
    specs: specs("100 · 120 · 140 cm", "50 cm", "52 cm"),
    finishes: [
      { key: "matte", label: "Carrara & White", labelAr: "كرارا وأبيض", swatch: "#f4f3f1", imageUrl: "/products/ruba-marble-vanity-01.webp" },
      { key: "gloss", label: "Carrara & Gloss", labelAr: "كرارا ولامع", swatch: "#fbfbfb", imageUrl: "/products/ruba-marble-vanity-02.webp", priceDelta: 230 },
    ],
    sizes: wide,
    images: [
      { url: "/products/ruba-marble-vanity-01.webp", alt: "Ruba marble-top vanity", finishKey: "matte" },
      { url: "/products/ruba-marble-vanity-02.webp", alt: "Ruba marble vanity, front elevation", elevation: true },
    ],
  },
  {
    slug: "atlas-walnut-double-vanity",
    name: "Atlas Walnut Double Vanity",
    nameAr: "وحدة أطلس الجوز المزدوجة",
    collection: "Atlas",
    collectionAr: "أطلس",
    type: "vanity" as const,
    tagline: "Walnut across 140 cm, two basins, one grain.",
    taglineAr: "جوز عبر ١٤٠ سم، حوضان، عرق واحد.",
    description:
      "One leaf of walnut veneer across the whole drawer front, which is the hard part: at this width most makers join two and hope the light never catches it. The two basins sit far enough apart that two people are not sharing an elbow.",
    descriptionAr:
      "ورقة قشرة جوز واحدة عبر واجهة الدرج بالكامل، وهذا هو الجزء الصعب: عند هذا العرض يصل معظم المصنّعين ورقتين ويأملون ألا يكشفهما الضوء. والحوضان متباعدان بما يكفي ألا يتزاحم شخصان.",
    basePrice: 6450,
    featured: true,
    isNew: true,
    sortOrder: 22,
    specs: specs("140 · 160 · 180 cm", "50 cm", "50 cm"),
    finishes: [
      { key: "wood", label: "Italian Walnut", labelAr: "جوز إيطالي", swatch: "#6b4a34", imageUrl: "/products/atlas-walnut-double-vanity-01.webp" },
      { key: "matte", label: "Walnut & Graphite", labelAr: "جوز وجرافيت", swatch: "#4a4038", imageUrl: "/products/atlas-walnut-double-vanity-02.webp" },
    ],
    sizes: doubleSizes,
    images: [
      { url: "/products/atlas-walnut-double-vanity-01.webp", alt: "Atlas walnut double vanity", finishKey: "wood" },
      { url: "/products/atlas-walnut-double-vanity-02.webp", alt: "Atlas walnut double vanity, front elevation", elevation: true },
    ],
  },

  // --- Storage: vanity + tower systems -------------------------------------
  {
    slug: "verde-vanity-tower-system",
    name: "Verde Vanity + Tower System",
    nameAr: "منظومة فيردي: وحدة وبرج",
    collection: "Verde",
    collectionAr: "فيردي",
    type: "storage" as const,
    tagline: "Emerald across a two-piece wall system.",
    taglineAr: "زمردي عبر منظومة حائطية من قطعتين.",
    description:
      "The tower is colour-matched in the same batch as the vanity, not ordered separately later — which is the usual reason two green pieces in one room never quite agree.",
    descriptionAr:
      "يُطابَق لون البرج في نفس دفعة الوحدة، لا يُطلب لاحقًا بشكل منفصل — وهذا هو السبب المعتاد في أن قطعتين خضراوين في غرفة واحدة لا تتفقان تمامًا.",
    basePrice: 7100,
    featured: true,
    isNew: true,
    sortOrder: 23,
    specs: specs("100 · 120 · 140 cm + 40 cm tower", "48 cm", "50 cm / 180 cm tower"),
    finishes: [
      { key: "matte", label: "Emerald Matte", labelAr: "زمردي مطفي", swatch: "#0f4536", imageUrl: "/products/verde-vanity-tower-system-01.webp" },
      { key: "gloss", label: "Emerald Gloss", labelAr: "زمردي لامع", swatch: "#0b5a42", imageUrl: "/products/verde-vanity-tower-system-02.webp", priceDelta: 280 },
    ],
    sizes: towerSizes,
    images: [
      { url: "/products/verde-vanity-tower-system-01.webp", alt: "Verde vanity and tower in emerald", finishKey: "matte" },
      { url: "/products/verde-vanity-tower-system-02.webp", alt: "Verde system, front elevation" },
    ],
  },
  {
    slug: "basalt-vanity-tower-system",
    name: "Basalt Vanity + Tower System",
    nameAr: "منظومة بازلت: وحدة وبرج",
    collection: "Basalt",
    collectionAr: "بازلت",
    type: "storage" as const,
    tagline: "Stone grain carried from vanity to tower.",
    taglineAr: "عرق حجري ممتد من الوحدة إلى البرج.",
    description:
      "The décor is sequenced across both pieces so the veining continues from the drawer front up the tower door, which only works if the two are cut from the same sheet in the same pass.",
    descriptionAr:
      "تُرتَّب الخامة على القطعتين ليستمر العرق من واجهة الدرج صاعدًا إلى باب البرج، وهذا لا ينجح إلا إذا قُصّت القطعتان من اللوح نفسه في المرور نفسه.",
    basePrice: 7600,
    isNew: true,
    sortOrder: 24,
    specs: specs("100 · 120 · 140 cm + 40 cm tower", "48 cm", "50 cm / 180 cm tower"),
    finishes: [
      { key: "matte", label: "Basalt Grey", labelAr: "رمادي بازلتي", swatch: "#3c3f44", imageUrl: "/products/basalt-vanity-tower-system-01.webp" },
      { key: "gloss", label: "Basalt Polished", labelAr: "بازلت مصقول", swatch: "#2f3338", imageUrl: "/products/basalt-vanity-tower-system-02.webp", priceDelta: 300 },
    ],
    sizes: towerSizes,
    images: [
      { url: "/products/basalt-vanity-tower-system-01.webp", alt: "Basalt vanity and tower", finishKey: "matte" },
      { url: "/products/basalt-vanity-tower-system-02.webp", alt: "Basalt system, front elevation" },
    ],
  },
  {
    slug: "vela-fluted-tall-cabinet",
    name: "Vela Fluted Tall Cabinet",
    nameAr: "خزانة فيلا المضلّعة العالية",
    collection: "Vela",
    collectionAr: "فيلا",
    type: "storage" as const,
    tagline: "40 cm wide, 180 cm tall, solid oak ribs.",
    taglineAr: "عرض ٤٠ سم، ارتفاع ١٨٠ سم، أضلاع بلوط مصمتة.",
    description:
      "Five adjustable shelves behind a push-latch door, sized so a 30 cm bottle stands upright on any of them. Hangs off the same wall rail as the vanities, so the base line is continuous when the two sit side by side.",
    descriptionAr:
      "خمسة أرفف قابلة للتعديل خلف باب بمزلاج ضغط، بمقاس يسمح لعبوة بارتفاع ٣٠ سم أن تقف منتصبة على أي منها. تُعلَّق على نفس سكة الحائط الخاصة بالوحدات، فيبقى خط القاعدة متصلًا حين تتجاوران.",
    basePrice: 3900,
    isNew: true,
    sortOrder: 25,
    specs: specs("40 cm", "35 cm", "180 cm"),
    finishes: [
      { key: "wood", label: "Natural Oak", labelAr: "بلوط طبيعي", swatch: "#d2ab76", imageUrl: "/products/vela-fluted-tall-cabinet-01.webp" },
      { key: "matte", label: "Ivory Fluted", labelAr: "عاجي مضلّع", swatch: "#e5d9c4", imageUrl: "/products/vela-fluted-tall-cabinet-02.webp" },
    ],
    sizes: tallOnly,
    images: [
      { url: "/products/vela-fluted-tall-cabinet-01.webp", alt: "Vela fluted oak tall cabinet", finishKey: "wood" },
      { url: "/products/vela-fluted-tall-cabinet-02.webp", alt: "Vela tall cabinet, front elevation", elevation: true },
    ],
  },
];
