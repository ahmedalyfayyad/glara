/**
 * Demo data for portfolio screenshots.
 *
 * Fills the back office with plausible orders, enquiries and subscribers so the
 * admin screens photograph like a running shop rather than a fresh install.
 * Every person here is invented. Additive only — `npm run db:reset` clears it.
 *
 *   npx tsx scripts/demo-data.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CUSTOMERS = [
  { name: "Nadia Kamel", email: "nadia.kamel@example.com", phone: "+20 100 224 8871", city: "New Cairo", gov: "Cairo" },
  { name: "Tarek El-Sharkawy", email: "t.sharkawy@example.com", phone: "+20 122 908 3310", city: "Sheikh Zayed", gov: "Giza" },
  { name: "Hana Mostafa", email: "hana.mostafa@example.com", phone: "+20 106 771 4402", city: "Maadi", gov: "Cairo" },
  { name: "Omar Fahmy", email: "omar.fahmy@example.com", phone: "+20 111 305 6628", city: "Smouha", gov: "Alexandria" },
  { name: "Laila Abdelrahman", email: "laila.a@example.com", phone: "+20 128 442 9017", city: "Zamalek", gov: "Cairo" },
  { name: "Youssef Adel", email: "youssef.adel@example.com", phone: "+20 101 663 2255", city: "6th of October", gov: "Giza" },
  { name: "Mariam Sobhy", email: "m.sobhy@example.com", phone: "+20 115 887 4413", city: "Heliopolis", gov: "Cairo" },
  { name: "Karim Nabil", email: "karim.nabil@example.com", phone: "+20 109 220 7734", city: "Nasr City", gov: "Cairo" },
];

const STREETS = [
  "12 Street 210, Degla",
  "44 El-Nasr Road",
  "7 Road 9, Villa 22",
  "31 Mostafa Kamel Street",
  "9 Brazil Street",
  "Compound Beverly Hills, Villa 118",
  "5 Baghdad Street, Korba",
  "18 Makram Ebeid Street",
];

const STATUSES = [
  "delivered", "delivered", "shipped", "in_production",
  "in_production", "confirmed", "pending", "pending",
];

const SHIPPING = 0;

const INQUIRIES = [
  { name: "Dina Roshdy", email: "dina.roshdy@example.com", phone: "+20 100 448 2216", subject: "Custom width for a narrow bathroom", message: "Our guest bathroom is 96cm wide wall to wall. Can the Linea be produced at 90cm with the same drawer, or would that change the basin?" },
  { name: "Ahmed Selim", email: "a.selim@example.com", phone: "+20 122 771 3390", subject: "Bulk order — 14 units for a hotel project", message: "We are fitting out a boutique hotel in Sahl Hasheesh and need 14 matching vanities in matte white. What is the lead time and is there a project price?" },
  { name: "Sara Hegazy", email: "sara.hegazy@example.com", phone: "", subject: "Wall type and mounting", message: "Do the floating units mount on hollow block walls, or do we need a reinforced backing? Our contractor asked before we close the wall." },
  { name: "Mohamed Farid", email: "m.farid@example.com", phone: "+20 106 330 8842", subject: "Warranty on the gloss finish", message: "How does the gloss finish hold up with daily use and cleaning products? What does the warranty actually cover?" },
  { name: "Rana Ismail", email: "rana.ismail@example.com", phone: "+20 128 116 5503", subject: "Delivery to Alexandria", message: "Do you deliver and install in Alexandria, and is installation included in the price or charged separately?" },
];

const SUBSCRIBERS = [
  ["ingy.samir@example.com", "en"], ["h.elmasry@example.com", "ar"],
  ["studio@northline-interiors.example", "en"], ["nour.abdelaziz@example.com", "ar"],
  ["projects@casaviva.example", "en"], ["m.gaber@example.com", "ar"],
  ["salma.wagdy@example.com", "en"], ["contact@atelier-nine.example", "en"],
  ["yasmin.k@example.com", "ar"], ["ramy.helmy@example.com", "en"],
  ["design@studiomara.example", "en"], ["a.zaki@example.com", "ar"],
];

/** GLA-XXXXXX — same shape the live order route produces. */
function orderNumber(seed: number) {
  return "GLA-" + String(100000 + seed * 7919 + 3170).slice(-6);
}

function daysAgo(n: number, hour: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, (n * 17) % 60, 0, 0);
  return d;
}

async function main() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      finishes: { orderBy: { sortOrder: "asc" } },
      sizes: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  });
  if (products.length === 0) throw new Error("no products — run `npm run db:seed` first");

  const existing = await prisma.order.count();
  if (existing > 0) {
    console.log(`${existing} orders already present — skipping order creation`);
  } else {
    for (let i = 0; i < CUSTOMERS.length; i++) {
      const customer = CUSTOMERS[i];
      const lineCount = i % 3 === 0 ? 2 : 1;
      const lines = [];

      for (let l = 0; l < lineCount; l++) {
        const product = products[(i * 3 + l * 5) % products.length];
        const finish = product.finishes[(i + l) % product.finishes.length];
        const size = product.sizes[(i + l) % product.sizes.length];
        const quantity = l === 0 && i === 1 ? 2 : 1;
        const unitPrice = product.basePrice + finish.priceDelta + size.priceDelta;

        lines.push({
          productId: product.id,
          name: product.name,
          nameAr: product.nameAr,
          slug: product.slug,
          imageUrl: finish.imageUrl || product.images[0]?.url || "",
          finishKey: finish.key,
          sizeLabel: size.label,
          quantity,
          unitPrice,
          lineTotal: unitPrice * quantity,
          configId: null,
        });
      }

      const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
      const placed = daysAgo(2 + i * 4, 10 + (i % 8));

      await prisma.order.create({
        data: {
          number: orderNumber(i),
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          addressLine: STREETS[i],
          city: customer.city,
          governorate: customer.gov,
          postalCode: null,
          notes: i === 3 ? "Please call before delivery — building has no lift." : null,
          subtotal,
          shipping: SHIPPING,
          total: subtotal + SHIPPING,
          paymentMethod: i % 3 === 0 ? "bank" : "cod",
          status: STATUSES[i],
          createdAt: placed,
          updatedAt: placed,
          items: { create: lines },
        },
      });
      console.log(`  order ${orderNumber(i)} · ${customer.name} · ${STATUSES[i]}`);
    }
  }

  if ((await prisma.inquiry.count()) === 0) {
    for (let i = 0; i < INQUIRIES.length; i++) {
      const at = daysAgo(1 + i * 3, 12 + (i % 6));
      await prisma.inquiry.create({
        data: {
          ...INQUIRIES[i],
          phone: INQUIRIES[i].phone || null,
          status: i < 2 ? "read" : "new",
          createdAt: at,
        },
      });
    }
    console.log(`  ${INQUIRIES.length} enquiries`);
  }

  for (let i = 0; i < SUBSCRIBERS.length; i++) {
    const [email, locale] = SUBSCRIBERS[i];
    await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email, locale, createdAt: daysAgo(i * 2 + 1, 9) },
    });
  }
  console.log(`  ${SUBSCRIBERS.length} subscribers`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
