"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useI18n } from "@/components/providers/I18nProvider";
import { otherLocale } from "@/i18n/config";
import { cx } from "@/lib/utils";
import {
  CartIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons";

type SessionUser = { id: string; name: string; role: "USER" | "ADMIN" } | null;

export function Header({ user }: { user: SessionUser }) {
  const { locale, t } = useI18n();
  const { cart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const href = (path: string) => `/${locale}${path === "/" ? "" : path}`;
  const strippedPath = pathname.replace(/^\/(en|ar)/, "") || "/";
  const isActive = (path: string) =>
    path === "/" ? strippedPath === "/" : strippedPath.startsWith(path);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function switchLocale() {
    const next = otherLocale(locale);
    document.cookie = `glara_locale=${next};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    router.push(`/${next}${strippedPath === "/" ? "" : strippedPath}`);
    router.refresh();
  }

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const term = query.trim();
    setSearchOpen(false);
    router.push(term ? `${href("/units")}?q=${encodeURIComponent(term)}` : href("/units"));
  }

  const navLinks = [
    { path: "/units", label: t.nav.units, accent: false },
    { path: "/customize", label: t.nav.customize, accent: true },
  ];

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        {t.nav.skipToContent}
      </a>

      <header
        className={cx(
          "sticky top-0 z-[100] w-full bg-white/95 backdrop-blur-sm transition-[box-shadow,border-color] duration-500",
          scrolled ? "border-b border-line" : "border-b border-transparent",
        )}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-4 md:h-[86px]">
          {/* Left — mobile menu button, desktop logo */}
          <div className="flex items-center gap-2 md:w-[220px]">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="-ms-2 p-2 md:hidden"
              aria-label={t.nav.openMenu}
              aria-expanded={menuOpen}
            >
              <MenuIcon size={22} />
            </button>
            <Link
              href={href("/")}
              className="font-wordmark text-[26px] leading-none tracking-[0.1em] md:text-[32px]"
              aria-label={t.meta.siteName}
            >
              GLARA
            </Link>
          </div>

          {/* Centre — primary navigation */}
          <nav
            className="hidden flex-1 items-center justify-center gap-10 md:flex lg:gap-[70px]"
            aria-label="Primary"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={href(link.path)}
                data-active={isActive(link.path)}
                className={cx(
                  "link-underline text-[18px] font-light tracking-[0.035em] transition-colors lg:text-[22px]",
                  link.accent ? "text-gold hover:text-gold-dark" : "text-ink hover:text-gold",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right — utilities */}
          <div className="flex items-center justify-end gap-4 md:w-[220px] md:gap-6">
            <button
              type="button"
              onClick={switchLocale}
              className="label-caps text-[13px] tracking-[0.1em] transition-colors hover:text-gold"
              aria-label={t.nav.switchLanguage}
            >
              {otherLocale(locale).toUpperCase()}
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label={t.nav.search}
              aria-expanded={searchOpen}
              className="transition-colors hover:text-gold"
            >
              <SearchIcon />
            </button>

            <Link
              href={href(user ? "/account" : "/account/login")}
              aria-label={t.nav.account}
              className="hidden transition-colors hover:text-gold sm:block"
            >
              <UserIcon />
            </Link>

            <Link
              href={href("/cart")}
              aria-label={`${t.nav.cart} (${cart.count})`}
              className="relative transition-colors hover:text-gold"
            >
              <CartIcon />
              {cart.count > 0 && (
                <span className="absolute -end-2 -top-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10px] font-medium leading-none text-white">
                  {cart.count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search drawer */}
        <div
          className={cx(
            "overflow-hidden border-line transition-[max-height,opacity] duration-500 ease-[var(--ease-luxe)]",
            searchOpen ? "max-h-32 border-t opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <form onSubmit={submitSearch} className="shell flex items-center gap-4 py-5">
            <SearchIcon size={18} className="shrink-0 text-ink-40" />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.units.searchPlaceholder}
              className="w-full bg-transparent text-lg font-light outline-none"
              aria-label={t.nav.search}
            />
            <button type="submit" className="label-caps shrink-0 text-gold hover:text-gold-dark">
              {t.common.search}
            </button>
          </form>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cx(
          "fixed inset-0 z-[110] md:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!menuOpen}
      >
        <div
          className={cx(
            "absolute inset-0 bg-ink/30 transition-opacity duration-500",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          className={cx(
            "absolute inset-y-0 start-0 flex w-[86%] max-w-[360px] flex-col bg-white transition-transform duration-500 ease-[var(--ease-luxe)]",
            menuOpen ? "drawer-open" : "drawer-closed",
          )}
          aria-label="Mobile"
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <span className="font-wordmark text-[26px] tracking-[0.1em]">GLARA</span>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label={t.nav.closeMenu}>
              <CloseIcon size={22} />
            </button>
          </div>

          <div className="flex flex-col gap-1 px-6 py-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={href(link.path)}
                className={cx(
                  "py-3 text-2xl font-light tracking-[0.03em]",
                  link.accent ? "text-gold" : "text-ink",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href={href("/cart")} className="py-3 text-2xl font-light tracking-[0.03em]">
              {t.nav.cart}
              {cart.count > 0 && <span className="ms-2 text-gold">({cart.count})</span>}
            </Link>
            <Link
              href={href(user ? "/account" : "/account/login")}
              className="py-3 text-2xl font-light tracking-[0.03em]"
            >
              {user ? t.account.title : t.common.signIn}
            </Link>
            {user?.role === "ADMIN" && (
              <Link href={href("/admin")} className="py-3 text-2xl font-light tracking-[0.03em]">
                {t.admin.title}
              </Link>
            )}
          </div>

          <div className="mt-auto border-t border-line px-6 py-6">
            <button
              type="button"
              onClick={switchLocale}
              className="label-caps text-gold"
              aria-label={t.nav.switchLanguage}
            >
              {otherLocale(locale).toUpperCase()}
            </button>
            <p className="mt-4 text-sm text-ink-60">{t.footer.email}</p>
            <p className="text-sm text-ink-60" dir="ltr">
              {t.footer.phone}
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
