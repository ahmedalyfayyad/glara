import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type Spec = { label: string; labelAr: string; value: string; valueAr: string };

const baseSpecs = (width: string, depth: string, height: string): Spec[] => [
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
  {
    label: "Lead time",
    labelAr: "مدة التنفيذ",
    value: "3–4 weeks",
    valueAr: "٣–٤ أسابيع",
  },
];

const MATERIALS_EN =
  "Greenlam compact laminate over a marine-grade plywood core. Italian wood veneer on the wood finishes, brushed metal accents, and a leather-wrapped pull on request. Every panel is edge-sealed so water never reaches the substrate.";
const MATERIALS_AR =
  "لاميناتيد جرينلام المضغوط فوق قلب من الخشب البحري. قشرة خشب إيطالي في التشطيبات الخشبية، ولمسات معدنية مصنفرة، ومقبض مغلّف بالجلد عند الطلب. كل لوح مُحكم من الحواف حتى لا تصل المياه إلى القلب.";

const INSTALL_EN =
  "Ships with a wall-mount rail, a paper drilling template, and torque-rated fixings for brick, block, or drywall with a backing plate. One technician, about ninety minutes. Plumbing rough-in must sit within the shaded zone on the template.";
const INSTALL_AR =
  "تُشحن مع سكة تثبيت حائطية وقالب تخريم ورقي ومسامير بعزم محدد للطوب أو البلوك أو الجبس بلوح دعم. فني واحد، نحو تسعين دقيقة. يجب أن تقع مواسير الصرف داخل المنطقة المظللة على القالب.";

const WARRANTY_EN =
  "Ten years on the cabinet structure, five on the soft-close hardware, two on the finish. Registered automatically at delivery and transferable with the property.";
const WARRANTY_AR =
  "عشر سنوات على هيكل الوحدة، وخمس على مفصلات الإغلاق الهادئ، وسنتان على التشطيب. يُسجَّل تلقائيًا عند التسليم وينتقل مع العقار.";

type FinishSeed = {
  key: string;
  label: string;
  labelAr: string;
  swatch: string;
  imageUrl: string;
  priceDelta?: number;
};

type SizeSeed = { label: string; cm: number; priceDelta: number };

const standardSizes: SizeSeed[] = [
  { label: "80cm", cm: 80, priceDelta: 0 },
  { label: "100cm", cm: 100, priceDelta: 450 },
  { label: "120cm", cm: 120, priceDelta: 900 },
  { label: "140cm", cm: 140, priceDelta: 1400 },
];

const towerSizes: SizeSeed[] = [
  { label: "100cm", cm: 100, priceDelta: 0 },
  { label: "120cm", cm: 120, priceDelta: 650 },
  { label: "140cm", cm: 140, priceDelta: 1200 },
];

type ProductSeed = {
  slug: string;
  name: string;
  nameAr: string;
  collection: string;
  collectionAr: string;
  type: "vanity" | "storage" | "mirror";
  tagline: string;
  taglineAr: string;
  description: string;
  descriptionAr: string;
  basePrice: number;
  featured?: boolean;
  isNew?: boolean;
  sortOrder: number;
  specs: Spec[];
  finishes: FinishSeed[];
  sizes: SizeSeed[];
  images: Array<{ url: string; alt: string; finishKey?: string }>;
};

const products: ProductSeed[] = [
  {
    slug: "linea-floating-vanity",
    name: "Linea Floating Vanity",
    nameAr: "وحدة لينيا المعلّقة",
    collection: "Linea",
    collectionAr: "لينيا",
    type: "vanity",
    tagline: "CNC-cut. Seamless drawers. Integrated basin.",
    taglineAr: "قص CNC. أدراج بلا فواصل. حوض مدمج.",
    description:
      "The unit that started the studio. One uninterrupted drawer face, a basin moulded into the top, and a shadow gap that makes 140 cm of cabinetry look like it is floating. No visible handle, no visible fixing, no visible compromise.",
    descriptionAr:
      "الوحدة التي بدأ بها الاستوديو. واجهة درج واحدة بلا انقطاع، وحوض مصبوب داخل السطح، وفراغ ظل يجعل ١٤٠ سم من النجارة تبدو معلّقة في الهواء. بلا مقبض ظاهر، وبلا تثبيت ظاهر، وبلا تنازلات.",
    basePrice: 4200,
    featured: true,
    sortOrder: 1,
    specs: baseSpecs("80 · 100 · 120 · 140 cm", "48 cm", "50 cm"),
    finishes: [
      { key: "wood", label: "Natural Oak", labelAr: "بلوط طبيعي", swatch: "#b89270", imageUrl: "/products/linea-oak-01.png" },
      { key: "matte", label: "Matte White", labelAr: "أبيض مطفي", swatch: "#e8e5df", imageUrl: "/products/white-matte-01.png" },
      { key: "gloss", label: "Gloss White", labelAr: "أبيض لامع", swatch: "#ffffff", imageUrl: "/products/white-gloss-01.png", priceDelta: 180 },
    ],
    sizes: standardSizes,
    images: [
      { url: "/products/linea-oak-01.png", alt: "Linea floating vanity in natural oak", finishKey: "wood" },
      { url: "/products/linea-oak-02.png", alt: "Linea vanity, three-quarter view" },
      { url: "/products/linea-oak-03.png", alt: "Linea vanity drawer detail" },
      { url: "/products/linea-oak-04.png", alt: "Linea vanity with the drawer open" },
    ],
  },
  {
    slug: "onyx-gloss-vanity",
    name: "Onyx Gloss Vanity",
    nameAr: "وحدة أونكس اللامعة",
    collection: "Onyx",
    collectionAr: "أونكس",
    type: "vanity",
    tagline: "Two drawers. Mirror-gloss lacquer. Zero hardware.",
    taglineAr: "درجان. ورنيش لامع كالمرآة. بلا مقابض.",
    description:
      "Nine coats of lacquer, each one flatted back by hand, over a marine core that will not move when the room fills with steam. The gloss reads almost black until light hits it from the side.",
    descriptionAr:
      "تسع طبقات من الورنيش، كل طبقة تُصنفر يدويًا، فوق قلب بحري لا يتمدد حين يمتلئ المكان بالبخار. اللمعة تبدو سوداء تمامًا حتى يلمسها الضوء من الجانب.",
    basePrice: 4650,
    featured: true,
    sortOrder: 2,
    specs: baseSpecs("80 · 100 · 120 · 140 cm", "48 cm", "50 cm"),
    finishes: [
      { key: "gloss", label: "Gloss Black", labelAr: "أسود لامع", swatch: "#141414", imageUrl: "/products/black-01.png" },
      { key: "matte", label: "Matte White", labelAr: "أبيض مطفي", swatch: "#e8e5df", imageUrl: "/products/white-matte-01.png" },
      { key: "wood", label: "Natural Oak", labelAr: "بلوط طبيعي", swatch: "#b89270", imageUrl: "/products/oak-drawer-01.png" },
    ],
    sizes: standardSizes,
    images: [
      { url: "/products/black-01.png", alt: "Onyx gloss vanity in black", finishKey: "gloss" },
      { url: "/products/black-02.png", alt: "Onyx vanity, front elevation" },
      { url: "/products/black-03.png", alt: "Onyx vanity detail" },
    ],
  },
  {
    slug: "pura-gloss-vanity",
    name: "Pura Gloss Vanity",
    nameAr: "وحدة بورا اللامعة",
    collection: "Pura",
    collectionAr: "بورا",
    type: "vanity",
    tagline: "The quiet one. Gloss white, twin soft-close drawers.",
    taglineAr: "الهادئة. أبيض لامع، درجان بإغلاق صامت.",
    description:
      "Built for small bathrooms that still deserve a proper unit. The white reflects whatever light the room has, and the twin drawers swallow everything that usually ends up on the counter.",
    descriptionAr:
      "صُممت للحمامات الصغيرة التي تستحق وحدة حقيقية. الأبيض يعكس أي ضوء في المكان، والدرجان يبتلعان كل ما ينتهي به الحال عادةً فوق الرخامة.",
    basePrice: 3600,
    sortOrder: 3,
    specs: baseSpecs("80 · 100 · 120 cm", "46 cm", "50 cm"),
    finishes: [
      { key: "gloss", label: "Gloss White", labelAr: "أبيض لامع", swatch: "#ffffff", imageUrl: "/products/white-01.png" },
      { key: "matte", label: "Matte Bone", labelAr: "عاجي مطفي", swatch: "#e8e5df", imageUrl: "/products/white-matte-01.png" },
    ],
    sizes: standardSizes.slice(0, 3),
    images: [
      { url: "/products/white-01.png", alt: "Pura gloss vanity in white", finishKey: "gloss" },
      { url: "/products/white-02.png", alt: "Pura vanity, angled view" },
      { url: "/products/white-03.png", alt: "Pura vanity detail" },
      { url: "/products/white-04.png", alt: "Pura vanity front" },
    ],
  },
  {
    slug: "terra-open-shelf-vanity",
    name: "Terra Open-Shelf Vanity",
    nameAr: "وحدة تيرا بالرف المفتوح",
    collection: "Terra",
    collectionAr: "تيرا",
    type: "vanity",
    tagline: "Walnut veneer. One drawer, one open bay.",
    taglineAr: "قشرة جوز. درج واحد ورف مفتوح.",
    description:
      "Half storage, half display. The open bay is lined in the same veneer as the front, so folded towels sit against walnut rather than against a raw carcass edge.",
    descriptionAr:
      "نصفها تخزين ونصفها عرض. الرف المفتوح مبطّن بنفس القشرة الأمامية، فتستقر المناشف المطوية على الجوز لا على حرف خشب خام.",
    basePrice: 4980,
    featured: true,
    isNew: true,
    sortOrder: 4,
    specs: baseSpecs("100 · 120 · 140 cm", "48 cm", "52 cm"),
    finishes: [
      { key: "wood", label: "Italian Walnut", labelAr: "جوز إيطالي", swatch: "#6b4a34", imageUrl: "/products/walnut-open-01.png" },
      { key: "matte", label: "Matte Graphite", labelAr: "جرافيت مطفي", swatch: "#3a3a3a", imageUrl: "/products/walnut-02.png" },
    ],
    sizes: standardSizes.slice(1),
    images: [
      { url: "/products/walnut-open-01.png", alt: "Terra open-shelf vanity in walnut", finishKey: "wood" },
      { url: "/products/walnut-02.png", alt: "Terra vanity, side view" },
      { url: "/products/walnut-shelf-01.png", alt: "Terra vanity open shelf detail" },
    ],
  },
  {
    slug: "nova-oak-vanity",
    name: "Nova Oak Vanity",
    nameAr: "وحدة نوفا البلوط",
    collection: "Nova",
    collectionAr: "نوفا",
    type: "vanity",
    tagline: "Full-width drawer. Rift-cut oak. Integrated basin.",
    taglineAr: "درج بعرض كامل. بلوط مشقوق. حوض مدمج.",
    description:
      "The grain runs continuously across the drawer front — a single leaf of veneer, book-matched, so the line never breaks at 140 cm. The most requested unit in the studio.",
    descriptionAr:
      "يمتد عرق الخشب متصلًا عبر واجهة الدرج — ورقة قشرة واحدة متطابقة، فلا ينكسر الخط حتى عند ١٤٠ سم. أكثر وحدة يُطلب تنفيذها في الاستوديو.",
    basePrice: 4400,
    featured: true,
    sortOrder: 5,
    specs: baseSpecs("100 · 120 · 140 cm", "48 cm", "50 cm"),
    finishes: [
      { key: "wood", label: "Rift Oak", labelAr: "بلوط مشقوق", swatch: "#c8a678", imageUrl: "/products/oak-wide-01.png" },
      { key: "matte", label: "Matte Sand", labelAr: "رملي مطفي", swatch: "#d9cfc0", imageUrl: "/products/oak-drawer-01.png" },
    ],
    sizes: standardSizes.slice(1),
    images: [
      { url: "/products/oak-wide-01.png", alt: "Nova oak vanity", finishKey: "wood" },
      { url: "/products/oak-wide-02.png", alt: "Nova vanity, wide view" },
      { url: "/products/oak-drawer-01.png", alt: "Nova vanity drawer detail" },
      { url: "/products/oak-drawer-02.png", alt: "Nova vanity front elevation" },
    ],
  },
  {
    slug: "marina-navy-vanity",
    name: "Marina Navy Vanity",
    nameAr: "وحدة مارينا الكحلية",
    collection: "Marina",
    collectionAr: "مارينا",
    type: "vanity",
    tagline: "Deep navy matte with a brushed brass pull.",
    taglineAr: "كحلي مطفي عميق بمقبض نحاسي مصنفر.",
    description:
      "A colour that behaves like a neutral once it is on the wall. Matte navy absorbs the glare from downlights instead of throwing it back at you.",
    descriptionAr:
      "لون يتصرف كأنه محايد بمجرد تثبيته على الحائط. الكحلي المطفي يمتص وهج الإضاءة السقفية بدل أن يعكسه في عينيك.",
    basePrice: 4750,
    sortOrder: 6,
    specs: baseSpecs("80 · 100 · 120 · 140 cm", "48 cm", "50 cm"),
    finishes: [
      { key: "matte", label: "Matte Navy", labelAr: "كحلي مطفي", swatch: "#25344d", imageUrl: "/products/navy-01.png" },
      { key: "gloss", label: "Gloss Navy", labelAr: "كحلي لامع", swatch: "#1d2c46", imageUrl: "/products/navy-set-01.png", priceDelta: 200 },
    ],
    sizes: standardSizes,
    images: [
      { url: "/products/navy-01.png", alt: "Marina navy vanity", finishKey: "matte" },
      { url: "/products/navy-set-04.png", alt: "Marina vanity with tower" },
      { url: "/products/navy-set-06.png", alt: "Marina vanity detail" },
    ],
  },
  {
    slug: "sage-olive-vanity",
    name: "Sage Olive Vanity",
    nameAr: "وحدة سيج الزيتونية",
    collection: "Sage",
    collectionAr: "سيج",
    type: "vanity",
    tagline: "Olive matte, warm-white top, black shadow gap.",
    taglineAr: "زيتوني مطفي، سطح أبيض دافئ، فراغ ظل أسود.",
    description:
      "Mixed in the workshop rather than pulled off a chart. Olive sits between green and grey depending on the hour, which is exactly why it works in a room with one small window.",
    descriptionAr:
      "لون يُخلط في الورشة لا يُختار من كتالوج. الزيتوني يتأرجح بين الأخضر والرمادي حسب ساعة النهار، ولهذا ينجح تمامًا في غرفة بنافذة واحدة صغيرة.",
    basePrice: 4820,
    isNew: true,
    sortOrder: 7,
    specs: baseSpecs("100 · 120 · 140 cm", "48 cm", "50 cm"),
    finishes: [
      { key: "matte", label: "Matte Olive", labelAr: "زيتوني مطفي", swatch: "#4b5040", imageUrl: "/products/olive-01.png" },
      { key: "wood", label: "Oak & Olive", labelAr: "بلوط وزيتوني", swatch: "#8d8461", imageUrl: "/products/olive-set-01.png" },
    ],
    sizes: standardSizes.slice(1),
    images: [
      { url: "/products/olive-01.png", alt: "Sage olive vanity", finishKey: "matte" },
      { url: "/products/olive-set-02.png", alt: "Sage vanity with tower" },
      { url: "/products/olive-set-03.png", alt: "Sage vanity detail" },
    ],
  },
  {
    slug: "aria-compact-vanity",
    name: "Aria Compact Vanity",
    nameAr: "وحدة آريا المدمجة",
    collection: "Aria",
    collectionAr: "آريا",
    type: "vanity",
    tagline: "80 cm of storage in a guest bathroom footprint.",
    taglineAr: "٨٠ سم من التخزين في مساحة حمام ضيوف.",
    description:
      "Shallower by four centimetres than the rest of the range, which is usually the difference between a door that opens fully and one that does not.",
    descriptionAr:
      "أقل عمقًا بأربعة سنتيمترات عن باقي المجموعة، وهو غالبًا الفارق بين باب يُفتح بالكامل وباب لا يُفتح.",
    basePrice: 3900,
    sortOrder: 8,
    specs: baseSpecs("80 · 100 cm", "42 cm", "48 cm"),
    finishes: [
      { key: "wood", label: "Warm Oak", labelAr: "بلوط دافئ", swatch: "#c3a071", imageUrl: "/products/oak-drawer-02.png" },
      { key: "matte", label: "Matte White", labelAr: "أبيض مطفي", swatch: "#e8e5df", imageUrl: "/products/white-05.png" },
      { key: "gloss", label: "Gloss Black", labelAr: "أسود لامع", swatch: "#141414", imageUrl: "/products/black-gloss-01.png" },
    ],
    sizes: standardSizes.slice(0, 2),
    images: [
      { url: "/products/oak-drawer-02.png", alt: "Aria compact vanity in oak", finishKey: "wood" },
      { url: "/products/white-05.png", alt: "Aria vanity in matte white" },
      { url: "/products/black-gloss-01.png", alt: "Aria vanity in gloss black" },
    ],
  },

  // --- Storage: vanity + tower systems -------------------------------------
  {
    slug: "nova-vanity-tower-system",
    name: "Nova Vanity + Tower System",
    nameAr: "منظومة نوفا: وحدة وبرج",
    collection: "Nova",
    collectionAr: "نوفا",
    type: "storage",
    tagline: "Floating vanity paired with a full-height tower.",
    taglineAr: "وحدة معلّقة مع برج بارتفاع كامل.",
    description:
      "The tower takes the tall bottles, the vanity takes everything else. Both run off the same rail, so the reveal between them is a consistent 12 mm from floor to ceiling.",
    descriptionAr:
      "البرج يستوعب العبوات الطويلة، والوحدة تستوعب ما تبقى. كلاهما يعمل على السكة نفسها، فيظل الفراغ بينهما ثابتًا عند ١٢ مم من الأرض للسقف.",
    basePrice: 6400,
    featured: true,
    sortOrder: 9,
    specs: baseSpecs("100 · 120 · 140 cm + 40 cm tower", "48 cm", "50 cm / 180 cm tower"),
    finishes: [
      { key: "wood", label: "Rift Oak", labelAr: "بلوط مشقوق", swatch: "#c8a678", imageUrl: "/products/oak-set-01.png" },
      { key: "matte", label: "Matte Sand", labelAr: "رملي مطفي", swatch: "#d9cfc0", imageUrl: "/products/oak-set-03.png" },
    ],
    sizes: towerSizes,
    images: [
      { url: "/products/oak-set-01.png", alt: "Nova vanity and tower in oak", finishKey: "wood" },
      { url: "/products/oak-set-02.png", alt: "Nova system, full elevation" },
      { url: "/products/oak-set-03.png", alt: "Nova tower detail" },
      { url: "/products/oak-set-04.png", alt: "Nova system in situ" },
    ],
  },
  {
    slug: "marina-vanity-tower-system",
    name: "Marina Vanity + Tower System",
    nameAr: "منظومة مارينا: وحدة وبرج",
    collection: "Marina",
    collectionAr: "مارينا",
    type: "storage",
    tagline: "Navy lacquer across a two-piece wall system.",
    taglineAr: "ورنيش كحلي عبر منظومة حائطية من قطعتين.",
    description:
      "Specified most often for master bathrooms where the vanity has to hold two people's routines without either of them opening the other's drawer.",
    descriptionAr:
      "الأكثر طلبًا لحمامات الغرف الرئيسية، حيث تستوعب الوحدة روتين شخصين دون أن يفتح أحدهما درج الآخر.",
    basePrice: 6900,
    featured: true,
    sortOrder: 10,
    specs: baseSpecs("100 · 120 · 140 cm + 40 cm tower", "48 cm", "50 cm / 180 cm tower"),
    finishes: [
      { key: "matte", label: "Matte Navy", labelAr: "كحلي مطفي", swatch: "#25344d", imageUrl: "/products/navy-set-01.png" },
      { key: "gloss", label: "Gloss Navy", labelAr: "كحلي لامع", swatch: "#1d2c46", imageUrl: "/products/navy-set-05.png", priceDelta: 260 },
    ],
    sizes: towerSizes,
    images: [
      { url: "/products/navy-set-01.png", alt: "Marina vanity and tower in navy", finishKey: "matte" },
      { url: "/products/navy-set-02.png", alt: "Marina system elevation" },
      { url: "/products/navy-set-03.png", alt: "Marina tower detail" },
      { url: "/products/navy-set-05.png", alt: "Marina system in gloss" },
    ],
  },
  {
    slug: "terra-vanity-tower-system",
    name: "Terra Vanity + Tower System",
    nameAr: "منظومة تيرا: وحدة وبرج",
    collection: "Terra",
    collectionAr: "تيرا",
    type: "storage",
    tagline: "Walnut, open bay, matching full-height tower.",
    taglineAr: "جوز، رف مفتوح، وبرج مطابق بارتفاع كامل.",
    description:
      "Veneer is sequenced across both pieces from the same log, so the tower and the vanity read as one run of timber rather than two separate purchases.",
    descriptionAr:
      "تُرتّب القشرة على القطعتين من الجذع نفسه، فيبدو البرج والوحدة امتدادًا واحدًا للخشب لا قطعتين منفصلتين.",
    basePrice: 7200,
    isNew: true,
    sortOrder: 11,
    specs: baseSpecs("100 · 120 · 140 cm + 40 cm tower", "48 cm", "52 cm / 180 cm tower"),
    finishes: [
      { key: "wood", label: "Italian Walnut", labelAr: "جوز إيطالي", swatch: "#6b4a34", imageUrl: "/products/walnut-openset-01.png" },
      { key: "matte", label: "Matte Graphite", labelAr: "جرافيت مطفي", swatch: "#3a3a3a", imageUrl: "/products/walnut-set-01.png" },
    ],
    sizes: towerSizes,
    images: [
      { url: "/products/walnut-openset-01.png", alt: "Terra vanity and tower in walnut", finishKey: "wood" },
      { url: "/products/walnut-openset-02.png", alt: "Terra system elevation" },
      { url: "/products/walnut-openset-03.png", alt: "Terra open bay detail" },
      { url: "/products/walnut-set-01.png", alt: "Terra system, alternate finish" },
    ],
  },
  {
    slug: "sage-vanity-tower-system",
    name: "Sage Vanity + Tower System",
    nameAr: "منظومة سيج: وحدة وبرج",
    collection: "Sage",
    collectionAr: "سيج",
    type: "storage",
    tagline: "Olive matte pairing, workshop-mixed colour.",
    taglineAr: "زيتوني مطفي متكامل، بلون يُخلط في الورشة.",
    description:
      "The tower carries a full-height door with a push latch — no handle to catch a sleeve on in a narrow room.",
    descriptionAr:
      "يحمل البرج بابًا بارتفاع كامل بمزلاج ضغط — بلا مقبض يعلق به الكُم في غرفة ضيقة.",
    basePrice: 6600,
    sortOrder: 12,
    specs: baseSpecs("100 · 120 · 140 cm + 40 cm tower", "48 cm", "50 cm / 180 cm tower"),
    finishes: [
      { key: "matte", label: "Matte Olive", labelAr: "زيتوني مطفي", swatch: "#4b5040", imageUrl: "/products/olive-set-01.png" },
      { key: "wood", label: "Oak & Olive", labelAr: "بلوط وزيتوني", swatch: "#8d8461", imageUrl: "/products/olive-set-03.png" },
    ],
    sizes: towerSizes,
    images: [
      { url: "/products/olive-set-01.png", alt: "Sage vanity and tower in olive", finishKey: "matte" },
      { url: "/products/olive-set-02.png", alt: "Sage system elevation" },
      { url: "/products/olive-set-03.png", alt: "Sage tower detail" },
    ],
  },
];

async function main() {
  console.log("→ clearing existing catalogue");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.configuration.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productFinish.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.product.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.user.deleteMany();

  console.log("→ seeding products");
  for (const p of products) {
    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        nameAr: p.nameAr,
        collection: p.collection,
        collectionAr: p.collectionAr,
        type: p.type,
        tagline: p.tagline,
        taglineAr: p.taglineAr,
        description: p.description,
        descriptionAr: p.descriptionAr,
        basePrice: p.basePrice,
        featured: p.featured ?? false,
        isNew: p.isNew ?? false,
        sortOrder: p.sortOrder,
        materials: MATERIALS_EN,
        materialsAr: MATERIALS_AR,
        installation: INSTALL_EN,
        installationAr: INSTALL_AR,
        warranty: WARRANTY_EN,
        warrantyAr: WARRANTY_AR,
        specs: JSON.stringify(p.specs),
        images: {
          create: p.images.map((image, index) => ({
            url: image.url,
            alt: image.alt,
            finishKey: image.finishKey ?? null,
            sortOrder: index,
          })),
        },
        finishes: {
          create: p.finishes.map((finish, index) => ({
            key: finish.key,
            label: finish.label,
            labelAr: finish.labelAr,
            swatch: finish.swatch,
            imageUrl: finish.imageUrl,
            priceDelta: finish.priceDelta ?? 0,
            sortOrder: index,
          })),
        },
        sizes: {
          create: p.sizes.map((size, index) => ({
            label: size.label,
            cm: size.cm,
            priceDelta: size.priceDelta,
            sortOrder: index,
          })),
        },
      },
    });
  }

  console.log("→ seeding accounts");
  await prisma.user.create({
    data: {
      email: "admin@glara-eg.com",
      name: "GLARA Studio",
      phone: "+20 1011911502",
      role: "ADMIN",
      passwordHash: await bcrypt.hash("Glara@2026", 10),
    },
  });
  await prisma.user.create({
    data: {
      email: "customer@example.com",
      name: "Nour Hassan",
      phone: "+20 1000000000",
      role: "USER",
      passwordHash: await bcrypt.hash("Customer@2026", 10),
    },
  });

  const counts = {
    products: await prisma.product.count(),
    finishes: await prisma.productFinish.count(),
    sizes: await prisma.productSize.count(),
    images: await prisma.productImage.count(),
    users: await prisma.user.count(),
  };
  console.log("✓ seeded", counts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
