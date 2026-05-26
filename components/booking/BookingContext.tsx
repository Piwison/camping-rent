"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { BookingItem } from "@/types/gear";
import { calcNights, calcBookingTotal, defaultWeekendDates } from "@/lib/pricing";

interface BookingState {
  items: BookingItem[];
  from: Date;
  to: Date;
  nights: number;
  total: number;
  addItem: (item: Omit<BookingItem, "quantity">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setDates: (from: Date, to: Date) => void;
}

const BookingContext = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const defaults = defaultWeekendDates();
  const [items, setItems] = useState<BookingItem[]>([]);
  const [from, setFrom] = useState<Date>(defaults.from);
  const [to, setTo] = useState<Date>(defaults.to);

  const nights = calcNights(from, to);

  const addItem = useCallback((item: Omit<BookingItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const setDates = useCallback((f: Date, t: Date) => {
    setFrom(f);
    setTo(t);
  }, []);

  const total = calcBookingTotal(items, nights);

  return (
    <BookingContext.Provider
      value={{
        items,
        from,
        to,
        nights,
        total,
        addItem,
        removeItem,
        clearCart,
        setDates,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingState {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
