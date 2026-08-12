import Image from "next/image";
import Link from "next/link";
import { ProductToggles } from "@/components/admin/ProductToggles";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";
import { getDictionary, type Locale, toLocale } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);

  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } },
      _count: { select: { orderItems: true } },
    },
  });

  return (
    <div className="no-scrollbar overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-base">
        <thead>
          <tr className="border-y border-line bg-bone text-sm">
            <th scope="col" className="px-4 py-3 text-start font-normal">
              {t.admin.products}
            </th>
            <th scope="col" className="px-4 py-3 text-start font-normal">
              {t.units.type}
            </th>
            <th scope="col" className="px-4 py-3 text-start font-normal">
              {t.units.price}
            </th>
            <th scope="col" className="px-4 py-3 text-start font-normal">
              {t.admin.ordersCount}
            </th>
            <th scope="col" className="px-4 py-3 text-end font-normal">
              {t.admin.status}
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-line">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-16 shrink-0">
                    <Image
                      src={product.images[0]?.url ?? "/products/linea-oak-01.png"}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </div>
                  <Link
                    href={`/${locale}/units/${product.slug}`}
                    className="link-underline hover:text-gold"
                  >
                    {locale === "ar" ? product.nameAr : product.name}
                  </Link>
                </div>
              </td>
              <td className="px-4 py-4 text-ink-60">
                {t.units.types[product.type as keyof typeof t.units.types] ?? product.type}
              </td>
              <td className="px-4 py-4">{formatPrice(product.basePrice, locale)}</td>
              <td className="px-4 py-4 text-ink-60">{product._count.orderItems}</td>
              <td className="px-4 py-4">
                <div className="flex justify-end">
                  <ProductToggles
                    productId={product.id}
                    initial={{ active: product.active, featured: product.featured }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
