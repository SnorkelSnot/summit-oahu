"use client";

import { useState, useEffect, useCallback } from "react";

type DayData = {
  date: string;
  privateBooked: boolean;
  vanSeatsTaken: number;
  vanSeatsTotal: number;
  blocked: boolean;
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

  const monthName = new Date(
    currentMonth.year,
    currentMonth.month
  ).toLocaleString("default", { month: "long", year: "numeric" });

  const fetchDays = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/availability?year=${currentMonth.year}&month=${currentMonth.month}`
      );
      const data = await res.json();
      setDays(data.days || []);
    } catch {
      setDays([]);
    }
  }, [currentMonth]);

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
            onSubmit={(e) => {
              e.preventDefault();
              // Replace with proper auth — this is a placeholder
              if (password === "summit2024") {
                setAuthenticated(true);
              } else {
                alert("Incorrect password");
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
                    (data.privateBooked || data.vanSeatsTaken > 0);
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
                      <span className="text-lava-500">Status</span>
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

                  {/* Block/Unblock */}
                  <button
                    onClick={async () => {
                      const newBlocked = !selectedDay.blocked;
                      // TODO: Call an admin API endpoint to toggle block
                      alert(
                        `${newBlocked ? "Blocked" : "Unblocked"} ${selectedDay.date}. (Wire up admin API endpoint for production)`
                      );
                    }}
                    className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
                      selectedDay.blocked
                        ? "bg-palm-100 text-palm-700 hover:bg-palm-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {selectedDay.blocked
                      ? "Unblock This Day"
                      : "Block This Day"}
                  </button>

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
