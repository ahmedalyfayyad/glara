"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartView } from "@/lib/cart";

export type AddToCartPayload = {
  productId: string;
  finishKey: string;
  sizeLabel: string;
  quantity?: number;
  configId?: string | null;
};

type Toast = { id: number; message: string; tone: "ok" | "error" };

type CartContextValue = {
  cart: CartView;
  pending: boolean;
  addItem: (payload: AddToCartPayload) => Promise<boolean>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refresh: () => Promise<void>;
  notify: (message: string, tone?: "ok" | "error") => void;
};

const emptyCart: CartView = {
  id: null,
  lines: [],
  count: 0,
  subtotal: 0,
  shipping: 0,
  total: 0,
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside <CartProvider>");
  return value;
}

export function CartProvider({
  initialCart,
  children,
}: {
  initialCart: CartView;
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartView>(initialCart ?? emptyCart);
  const [pending, setPending] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const notify = useCallback((message: string, tone: "ok" | "error" = "ok") => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3600);
  }, []);

  const request = useCallback(async (init: RequestInit): Promise<CartView | null> => {
    setPending(true);
    try {
      const response = await fetch("/api/cart", {
        headers: { "Content-Type": "application/json" },
        ...init,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "request failed");
      setCart(data.cart as CartView);
      return data.cart as CartView;
    } catch {
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await request({ method: "GET" });
  }, [request]);

  const addItem = useCallback(
    async (payload: AddToCartPayload) => {
      const result = await request({ method: "POST", body: JSON.stringify(payload) });
      return result !== null;
    },
    [request],
  );

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      await request({ method: "PATCH", body: JSON.stringify({ itemId, quantity }) });
    },
    [request],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      await request({ method: "DELETE", body: JSON.stringify({ itemId }) });
    },
    [request],
  );

  // The cart cookie can change in another tab (or after checkout in this one).
  useEffect(() => {
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  const value = useMemo(
    () => ({ cart, pending, addItem, updateItem, removeItem, refresh, notify }),
    [cart, pending, addItem, updateItem, removeItem, refresh, notify],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[120] flex flex-col items-center gap-2 px-4"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={
              "pointer-events-auto max-w-sm px-5 py-3 text-sm tracking-[0.06em] text-white shadow-lg " +
              (toast.tone === "error" ? "bg-[#8a2f2f]" : "bg-ink")
            }
            style={{ animation: "glara-fade-up 0.4s var(--ease-luxe) both" }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </CartContext.Provider>
  );
}
