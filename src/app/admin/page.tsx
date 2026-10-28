"use client";

import { useState, useEffect, useCallback } from "react";

type DayData = {
  date: string;
  privateBooked: boolean;
  vanSeatsTaken: number;
  vanSeatsTotal: number;
  halfDaySeatsTaken?: number;
  halfDaySeatsTotal?: number;
  mercedesBooked?: boolean;
  blocked: boolean;
  blocks?: ("ALL" | "van" | "mercedes")[];
  bookings: any[];
};

export default function AdminPage() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [days, setDays] = useState<DayData[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [blockBusy, setBlockBusy] = useState(false);
  const [blockMsg, setBlockMsg] = useState("");

  const monthName = new Date(
    currentMonth.year,
    currentMonth.month
  ).toLocaleString("default", { month: "long", year: "numeric" });

  const fetchDays = useCallback(async () => {
    try {
      // Counts come from the password-protected admin endpoint; the public
      // /api/availability only says available/unavailable (Oct 28, 2026).
      const res = await fetch(
        `/api/admin/availability?year=${currentMonth.year}&month=${currentMonth.month}`,
        { headers: { "x-admin-password": password }, cache: "no-store" }
      );
      if (res.status === 401) {
        setAuthenticated(false);
        setAuthError("Incorrect password");
        return;
      }
      const data = await res.json();
      setDays(data.days || []);
      // Keep the open day panel in step with fresh data (e.g. after a block).
      setSelectedDay((prev) =>
        prev ? (data.days || []).find((d: DayData) => d.date === prev.date) || prev : prev
      );
    } catch {
      setDays([]);
    }
  }, [currentMonth, password]);

  // Block / unblock for real (Oct 28, 2026). Writes a MANUAL_BLOCK row to the
  // Bookings sheet, or marks matching rows UNBLOCKED — exactly what used to be
  // done by hand — so the website and Channel Sync honour it immediately.
  async function changeBlock(date: string, vehicle: "ALL" | "van" | "mercedes", block: boolean) {
    setBlockBusy(true);
    setBlockMsg("");
    try {
      const res = await fetch("/api/admin/block", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ date, vehicle, block }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      const what = vehicle === "ALL" ? "Whole day" : vehicle === "van" ? "Van" : "Mercedes";
      setBlockMsg(`${what} ${block ? "blocked" : "unblocked"} ✓`);
      await fetchDays();
    } catch (e: any) {
      setBlockMsg(`Didn't save: ${e.message}`);
    } finally {
      setBlockBusy(false);
    }
  }

  useEffect(() => {
    if (authenticated) fetchDays();
  }, [fetchDays, authenticated]);

  // Simple password gate (replace with proper auth in production)
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-sand-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">
          <h1 className="font-display text-2xl font-bold text-palm-900 mb-2">
            Admin Access
          </h1>
          <p className="text-lava-500 text-sm mb-6">
            Enter your admin password to manage bookings.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              // Checked on the SERVER now (Oct 28, 2026); the old check lived
              // in this file, readable by anyone who opened the page source.
              const now = new Date();
              const res = await fetch(
                `/api/admin/availability?year=${now.getFullYear()}&month=${now.getMonth()}`,
                { headers: { "x-admin-password": password }, cache: "no-store" }
              );
              if (res.ok) {
                setAuthError("");
                setAuthenticated(true);
              } else {
                setAuthError("Incorrect password");
              }
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none text-sm mb-4"
              placeholder="Enter password"
            />
            {authError && (
              <p className="text-sm text-red-600 mb-3">{authError}</p>
            )}
            <button type="submit" className="w-full btn-primary">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const daysInMonth = new Date(
    currentMonth.year,
    currentMonth.month + 1,
    0
  ).getDate();
  const firstDayOfWeek = new Date(
    currentMonth.year,
    currentMonth.month,
    1
  ).getDay();

  function getDayData(day: number): DayData | undefined {
    const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return days.find((d) => d.date === dateStr);
  }

  return (
    <div className="min-h-screen bg-sand-100">
      {/* Header */}
      <header className="bg-palm-950 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-sand-50">
              Summit O&apos;ahu <span className="text-gold-400">Admin</span>
            </h1>
          </div>
          <button
            onClick={() => setAuthenticated(false)}
            className="text-sand-400 text-sm hover:text-sand-200"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() =>
                    setCurrentMonth((prev) =>
                      prev.month === 0
                        ? { year: prev.year - 1, month: 11 }
                        : { ...prev, month: prev.month - 1 }
                    )
                  }
                  className="p-2 hover:bg-sand-100 rounded-lg"
                >
                  ←
                </button>
                <h2 className="font-display text-xl font-semibold text-palm-900">
                  {monthName}
                </h2>
                <button
                  onClick={() =>
                    setCurrentMonth((prev) =>
                      prev.month === 11
                        ? { year: prev.year + 1, month: 0 }
                        : { ...prev, month: prev.month + 1 }
                    )
                  }
                  className="p-2 hover:bg-sand-100 rounded-lg"
                >
                  →
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (d) => (
                    <div
                      key={d}
                      className="text-center text-xs font-bold text-lava-400 py-2"
                    >
                      {d}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const data = getDayData(day);
                  const hasBookings =
                    data &&
                    (data.privateBooked ||
                      data.vanSeatsTaken > 0 ||
                      (!data.blocked && !data.privateBooked && (data.halfDaySeatsTaken || 0) > 0));
                  const isBlocked = data?.blocked;

                  return (
                    <button
                      key={day}
                      onClick={() => {
                        const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const d = data || {
                          date: dateStr,
                          privateBooked: false,
                          vanSeatsTaken: 0,
                          vanSeatsTotal: 13,
                          blocked: false,
                          bookings: [],
                        };
                        setSelectedDay(d);
                      }}
                      className={`p-2 rounded-lg text-sm text-center transition-all hover:shadow-md ${
                        isBlocked
                          ? "bg-red-100 text-red-700"
                          : hasBookings
                            ? "bg-palm-100 text-palm-800 font-semibold"
                            : "bg-sand-50 hover:bg-sand-100"
                      }`}
                    >
                      <div className="font-medium">{day}</div>
                      {data?.privateBooked && (
                        <div className="text-[10px] text-palm-600 mt-0.5">
                          PVT
                        </div>
                      )}
                      {data && data.vanSeatsTaken > 0 && (
                        <div className="text-[10px] text-ocean-600 mt-0.5">
                          {data.vanSeatsTotal - data.vanSeatsTaken} seats
                        </div>
                      )}
                      {data && !data.blocked && !data.privateBooked && (data.halfDaySeatsTaken || 0) > 0 && (
                        <div className="text-[10px] text-gold-700 mt-0.5">
                          ½ {(data.halfDaySeatsTotal || 3) - (data.halfDaySeatsTaken || 0)} left
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Day Detail Panel */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {selectedDay ? (
                <>
                  <h3 className="font-display text-lg font-semibold text-palm-900 mb-4">
                    {new Date(selectedDay.date + "T12:00:00").toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </h3>

                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-lava-500">Private Tour</span>
                      <span
                        className={
                          selectedDay.privateBooked
                            ? "text-palm-600 font-semibold"
                            : "text-lava-400"
                        }
                      >
                        {selectedDay.privateBooked ? "BOOKED" : "Available"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lava-500">Van Seats</span>
                      <span className="font-semibold">
                        {selectedDay.vanSeatsTotal -
                          selectedDay.vanSeatsTaken}{" "}
                        / {selectedDay.vanSeatsTotal} available
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lava-500">Half-Day Seats (Mercedes)</span>
                      <span className="font-semibold">
                        {(selectedDay.halfDaySeatsTotal ?? 3) -
                          (selectedDay.halfDaySeatsTaken ?? 0)}{" "}
                        / {selectedDay.halfDaySeatsTotal ?? 3} available
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lava-500">Whole day</span>
                      <span
                        className={
                          selectedDay.blocked
                            ? "text-red-600 font-semibold"
                            : "text-palm-600 font-semibold"
                        }
                      >
                        {selectedDay.blocked ? "BLOCKED" : "Open"}
                      </span>
                    </div>
                  </div>

                  {/* Block / Unblock — writes to the Bookings sheet (Oct 28, 2026) */}
                  {(() => {
                    const blocks = selectedDay.blocks || [];
                    const rows: { v: "ALL" | "van" | "mercedes"; label: string }[] = [
                      { v: "ALL", label: "Whole day" },
                      { v: "van", label: "Van only" },
                      { v: "mercedes", label: "Mercedes only" },
                    ];
                    return (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-palm-800 uppercase tracking-wide">
                          Block this date
                        </div>
                        {rows.map(({ v, label }) => {
                          const on = blocks.includes(v);
                          return (
                            <button
                              key={v}
                              type="button"
                              disabled={blockBusy}
                              onClick={() => changeBlock(selectedDay.date, v, !on)}
                              className={`w-full py-2 px-3 rounded-lg text-sm font-semibold flex justify-between items-center transition-colors disabled:opacity-50 ${
                                on
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : "bg-sand-100 text-palm-800 hover:bg-sand-200"
                              }`}
                            >
                              <span>{label}</span>
                              <span className="text-xs font-medium">
                                {on ? "Blocked · tap to unblock" : "Open · tap to block"}
                              </span>
                            </button>
                          );
                        })}
                        {blockMsg && (
                          <p className="text-xs text-lava-600 pt-1">{blockMsg}</p>
                        )}
                        {blockBusy && <p className="text-xs text-lava-400">Saving…</p>}
                      </div>
                    );
                  })()}

                  {/* Bookings List */}
                  {selectedDay.bookings &&
                    selectedDay.bookings.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-sm text-palm-800 mb-3">
                          Bookings
                        </h4>
                        <div className="space-y-3">
                          {selectedDay.bookings.map(
                            (booking: any, i: number) => (
                              <div
                                key={i}
                                className="bg-sand-50 rounded-lg p-3 text-xs"
                              >
                                <div className="font-semibold text-palm-800">
                                  {booking.name}
                                </div>
                                <div className="text-lava-500 mt-1">
                                  {booking.tourType} · {booking.partySize}{" "}
                                  guest(s)
                                </div>
                                <div className="text-lava-500">
                                  {booking.hotel}
                                </div>
                                <div className="text-lava-400">
                                  {booking.email} · {booking.phone}
                                </div>
                                {booking.conciergeRef && (
                                  <div className="text-gold-600 mt-1">
                                    Concierge: {booking.conciergeRef}
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </>
              ) : (
                <div className="text-center text-lava-400 py-8">
                  <p className="text-sm">
                    Select a day on the calendar to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
