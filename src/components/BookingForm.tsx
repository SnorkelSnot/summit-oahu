"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AvailabilityCalendar from "./AvailabilityCalendar";
import WaiverAgreement from "./WaiverAgreement";
import { WAIVER_VERSION } from "@/lib/waiver";
import {
  getAvailableHotels,
  isPrivateOnlyHotel,
  type TourType,
} from "@/lib/hotels";

type FormData = {
  tourType: TourType;
  vehicleType: "mercedes" | "van";
  partySize: number;
  date: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hotel: string;
  customHotel: string;
  comments: string;
  conciergeRef: string;
  promoCode: string;
};

export default function BookingForm() {
  const searchParams = useSearchParams();
  const preselectedTour = searchParams.get("tour") as TourType | null;
  const isTurkish = searchParams.get("lang") === "tr";

  // Bilingual label helper: Turkish first, English second on the Turkish
  // booking flow; plain English otherwise.
  const L = (tr: string, en: string) => (isTurkish ? `${tr} — ${en}` : en);

  const [form, setForm] = useState<FormData>({
    // Turkish-guided tours are offered as private tours only
    tourType: isTurkish ? "private" : preselectedTour || "small-group",
    vehicleType: "mercedes",
    partySize: 2,
    date: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    hotel: "",
    customHotel: "",
    comments: "",
    conciergeRef: "",
    promoCode: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vanConflict, setVanConflict] = useState(false);
  const [waiver, setWaiver] = useState<{
    agreed: boolean;
    acceptedAt: string | null;
  }>({ agreed: false, acceptedAt: null });

  // For private tours, default to mercedes.
  // Also clear any private-only pickup (Ko'Olina / North Shore) if the
  // guest switches to a small-group tour with one already selected.
  useEffect(() => {
    if (form.tourType === "small-group") {
      setForm((prev) => ({
        ...prev,
        vehicleType: "van",
        hotel:
          prev.hotel !== "__custom__" && isPrivateOnlyHotel(prev.hotel)
            ? ""
            : prev.hotel,
      }));
    } else {
      setForm((prev) => ({ ...prev, vehicleType: "mercedes" }));
    }
  }, [form.tourType]);

  const hotels = getAvailableHotels(form.tourType);
  const showCustomHotel = form.hotel === "__custom__";

  const maxPartySize =
    form.tourType === "small-group"
      ? 13
      : form.vehicleType === "van"
        ? 13
        : 4;

  function getPrice(): { amount: number; label: string } {
    if (form.tourType === "small-group") {
      const total = (149 * form.partySize).toLocaleString();
      return {
        amount: 149 * form.partySize,
        label: isTurkish
          ? `$149 \u00d7 ${form.partySize} misafir = $${total}`
          : `$149 \u00d7 ${form.partySize} guest${form.partySize > 1 ? "s" : ""} = $${total}`,
      };
    }
    // Private
    if (form.vehicleType === "van") {
      return {
        amount: 2199,
        label: isTurkish
          ? "$2,199 sabit fiyat \u2014 \u00d6zel Minib\u00fcs Turu (13 misafire kadar)"
          : "$2,199 flat rate \u2014 Private Van Tour (up to 13 guests)",
      };
    }
    return {
      amount: 1299,
      label: isTurkish
        ? "$1,299 sabit fiyat \u2014 \u00d6zel Mercedes Turu (4 misafire kadar)"
        : `$1,299 flat rate \u2014 Private Mercedes Tour (up to 4 guests)`,
    };
  }

  const price = getPrice();

  // Hawaiʻi GET, Oʻahu pass-on rate — added on top of the fare and
  // separately stated per Tariff No. 1. Stripe applies the same 4.712%
  // at checkout (after any promo discount), so this preview matches.
  const GET_RATE_PCT = 4.712;
  const getTax = Math.round(price.amount * GET_RATE_PCT) / 100;
  const totalWithGet = price.amount + getTax;
  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const hotel = showCustomHotel ? form.customHotel : form.hotel;

      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourType: form.tourType,
          vehicleType: form.vehicleType,
          partySize: form.partySize,
          turkishTour: isTurkish,
          date: form.date,
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
          hotel,
          comments: form.comments,
          conciergeRef: form.conciergeRef,
          promoCode: form.promoCode,
          waiverAccepted: waiver.agreed,
          waiverAcceptedAt: waiver.acceptedAt,
          waiverVersion: WAIVER_VERSION,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Turkish tour banner */}
      {isTurkish && (
        <div className="bg-palm-900 rounded-2xl p-5 flex items-center gap-4 border border-gold-500/30">
          <svg viewBox="0 0 30 20" className="w-9 h-6 rounded-sm shadow-md shrink-0" aria-label="Türk bayrağı">
            <rect width="30" height="20" fill="#E30A17" />
            <circle cx="11" cy="10" r="4" fill="#ffffff" />
            <circle cx="12.2" cy="10" r="3.2" fill="#E30A17" />
            <polygon fill="#ffffff" points="18.37,10 17.33,10.34 17.33,11.43 16.69,10.55 15.66,10.88 16.30,10 15.66,9.12 16.69,9.45 17.33,8.57 17.33,9.66" />
          </svg>
          <div>
            <p className="text-sand-50 text-sm font-semibold">
              T&uuml;rk&ccedil;e rehberli tur rezervasyonu yapıyorsunuz — hoş geldiniz!
            </p>
            <p className="text-sand-300/70 text-xs mt-0.5">
              You are booking the Turkish-guided tour. Your booking will be
              flagged for our Turkish-speaking guide.
            </p>
          </div>
        </div>
      )}

      {/* STEP 1: Tour Selection */}
      <div className="bg-white rounded-2xl shadow-lg border border-sand-200/50 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-palm-700 text-white flex items-center justify-center text-sm font-bold">
            1
          </div>
          <h3 className="font-display text-xl font-semibold text-palm-900">
            {L("Turunuzu Seçin", "Choose Your Tour")}
          </h3>
        </div>

        {/* Tour Type — the Turkish-guided tour is private only, so the
            small-group option is hidden on the Turkish flow */}
        <div className={`grid gap-4 mb-6 ${isTurkish ? "" : "sm:grid-cols-2"}`}>
          {!isTurkish && (
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({ ...prev, tourType: "small-group" as TourType, date: "", vehicleType: "van" }))
              }
              className={`p-5 rounded-xl border-2 text-left transition-all ${
                form.tourType === "small-group"
                  ? "border-palm-600 bg-palm-50 shadow-md"
                  : "border-sand-200 hover:border-sand-300"
              }`}
            >
              <div className="font-semibold text-palm-900">Circle Island Tour</div>
              <div className="text-sm text-lava-500 mt-1">$149/person · Small Group Van</div>
              <div className="text-xs text-gold-600 mt-2 font-medium">6:15am pickup · Back for happy hour!</div>
            </button>
          )}
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, tourType: "private" as TourType, date: "", vehicleType: "mercedes" }))
            }
            className={`p-5 rounded-xl border-2 text-left transition-all ${
              form.tourType === "private"
                ? "border-palm-600 bg-palm-50 shadow-md"
                : "border-sand-200 hover:border-sand-300"
            }`}
          >
            <div className="font-semibold text-palm-900">
              {L("Özel Tur", "Private Tour")}
            </div>
            <div className="text-sm text-lava-500 mt-1">
              {L("$1,299'dan başlayan · Sadece sizin grubunuz", "From $1,299 · Your group only")}
            </div>
            <div className="text-xs text-gold-600 mt-2 font-medium">
              {L("Esnek saatler · Mercedes veya Minibüs", "Flexible timing · Mercedes or Van")}
            </div>
          </button>
        </div>

        {isTurkish && (
          <p className="text-xs text-lava-500 -mt-2 mb-6">
            T&uuml;rk&ccedil;e rehberli turlar yalnızca &ouml;zel tur olarak
            sunulmaktadır. — Turkish-guided tours are offered as private tours
            only.
          </p>
        )}

        {/* Vehicle Selection (Private only) */}
        {form.tourType === "private" && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-palm-800 mb-2">
              {L("Araç", "Vehicle")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    vehicleType: "mercedes",
                    partySize: Math.min(prev.partySize, 4),
                    date: "",
                  }))
                }
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  form.vehicleType === "mercedes"
                    ? "border-palm-600 bg-palm-50 shadow-md"
                    : "border-sand-200 hover:border-sand-300"
                }`}
              >
                <div className="font-semibold text-palm-900 text-sm">
                  Mercedes GLC 300
                </div>
                <div className="text-xs text-lava-500 mt-1">
                  {L("1–4 misafir · $1,299", "1–4 guests · $1,299")}
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, vehicleType: "van", date: "" }))
                }
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  form.vehicleType === "van"
                    ? "border-palm-600 bg-palm-50 shadow-md"
                    : "border-sand-200 hover:border-sand-300"
                }`}
              >
                <div className="font-semibold text-palm-900 text-sm">
                  Passenger Van
                </div>
                <div className="text-xs text-lava-500 mt-1">
                  {L("13 misafire kadar · $2,199", "Up to 13 guests · $2,199")}
                </div>
              </button>
            </div>

            {/* Van conflict warning */}
            {form.vehicleType === "van" && vanConflict && (
              <div className="mt-4 p-4 bg-gold-50 border border-gold-300 rounded-xl">
                <div className="flex items-start gap-3">
                  <span className="text-xl">&#128222;</span>
                  <div>
                    <p className="text-sm font-semibold text-gold-800">
                      {L(
                        "Minibüs bu tarihte küçük grup turu için ayrılmış",
                        "The van is already reserved for a small group tour on this date."
                      )}
                    </p>
                    <p className="text-sm text-gold-700 mt-1">
                      {L(
                        "Bizi arayın veya mesaj gönderin — bir çözüm bulabiliriz!",
                        "Give us a call or send a message — we may be able to work something out!"
                      )}
                    </p>
                    <div className="mt-3 flex gap-3">
                      <a
                        href="tel:+18082034103"
                        className="text-sm font-semibold text-palm-700 underline"
                      >
                        Call Us
                      </a>
                      <a
                        href="mailto:summitoahu@gmail.com"
                        className="text-sm font-semibold text-palm-700 underline"
                      >
                        Email Us
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Party Size */}
        <div>
          <label className="block text-sm font-semibold text-palm-800 mb-2">
            {L("Misafir Sayısı", "Number of Guests")}
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  partySize: Math.max(1, prev.partySize - 1),
                }))
              }
              className="w-10 h-10 rounded-full border-2 border-sand-300 flex items-center justify-center text-lava-600 hover:border-palm-500 hover:text-palm-700 transition-colors"
            >
              -
            </button>
            <span className="text-2xl font-display font-bold text-palm-900 w-8 text-center">
              {form.partySize}
            </span>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  partySize: Math.min(maxPartySize, prev.partySize + 1),
                }))
              }
              className="w-10 h-10 rounded-full border-2 border-sand-300 flex items-center justify-center text-lava-600 hover:border-palm-500 hover:text-palm-700 transition-colors"
            >
              +
            </button>
            <span className="text-sm text-lava-400 ml-2">
              ({L(`en fazla ${maxPartySize}`, `max ${maxPartySize}`)})
            </span>
          </div>
        </div>
      </div>

      {/* STEP 2: Date Selection */}
      <div className="bg-white rounded-2xl shadow-lg border border-sand-200/50 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-palm-700 text-white flex items-center justify-center text-sm font-bold">
            2
          </div>
          <h3 className="font-display text-xl font-semibold text-palm-900">
            {L("Tarihinizi Seçin", "Pick Your Date")}
          </h3>
        </div>

        <AvailabilityCalendar
          tourType={form.tourType}
          vehicleType={form.vehicleType}
          partySize={form.partySize}
          selectedDate={form.date || null}
          onSelectDate={(date) => setForm((prev) => ({ ...prev, date }))}
        />

        {form.date && (
          <div className="mt-4 p-3 bg-palm-50 rounded-lg text-sm text-palm-700 font-medium">
            {L("Seçilen tarih", "Selected")}:{" "}
            {new Date(form.date + "T12:00:00").toLocaleDateString(
              isTurkish ? "tr-TR" : "en-US",
              {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            )}
          </div>
        )}
      </div>

      {/* STEP 3: Guest Details */}
      <div className="bg-white rounded-2xl shadow-lg border border-sand-200/50 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-palm-700 text-white flex items-center justify-center text-sm font-bold">
            3
          </div>
          <h3 className="font-display text-xl font-semibold text-palm-900">
            {L("Bilgileriniz", "Your Details")}
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-palm-800 mb-1.5">{L("Adınız", "First Name")} *</label>
            <input type="text" required value={form.firstName}
              onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none transition-all text-sm"
              placeholder="John" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-palm-800 mb-1.5">{L("Soyadınız", "Last Name")} *</label>
            <input type="text" required value={form.lastName}
              onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none transition-all text-sm"
              placeholder="Smith" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-palm-800 mb-1.5">{L("E-posta", "Email")} *</label>
            <input type="email" required value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none transition-all text-sm"
              placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-palm-800 mb-1.5">{L("Telefon", "Phone")} *</label>
            <input type="tel" required value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none transition-all text-sm"
              placeholder="(555) 123-4567" />
          </div>

          {/* Hotel */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-palm-800 mb-1.5">{L("Otel / Alınma Noktası", "Hotel / Pickup Location")} *</label>
            <select required value={form.hotel}
              onChange={(e) => setForm((prev) => ({ ...prev, hotel: e.target.value, customHotel: "" }))}
              className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none transition-all text-sm bg-white">
              <option value="">{L("Otelinizi seçin...", "Select your hotel...")}</option>
              <optgroup label="Waikiki Hotels">
                {hotels.filter((h) => !h.includes("Aulani") && !h.includes("Ko Olina") && !h.includes("Four Seasons") && !h.includes("Marriott's Ko") && !h.includes("Turtle Bay")).map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </optgroup>
              {form.tourType === "private" && (
                <>
                  <optgroup label="Ko'Olina Hotels (Private only)">
                    {hotels.filter((h) => h.includes("Aulani") || h.includes("Ko Olina") || h.includes("Four Seasons") || h.includes("Marriott's Ko")).map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </optgroup>
                  <optgroup label="North Shore (Private only)">
                    {hotels.filter((h) => h.includes("Turtle Bay")).map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </optgroup>
                </>
              )}
              <optgroup label="Other">
                <option value="__custom__">{L("Diğer (konumunuzu yazın)", "Other (type in your location)")}</option>
              </optgroup>
            </select>
            {showCustomHotel && (
              <input type="text" required value={form.customHotel}
                onChange={(e) => setForm((prev) => ({ ...prev, customHotel: e.target.value }))}
                className="mt-3 w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none transition-all text-sm"
                placeholder={L("Otel veya konaklama adınız", "Enter your hotel or accommodation name")} />
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-palm-800 mb-1.5">
              {L("Özel İstekler", "Comments / Special Requests")}
            </label>
            <textarea value={form.comments}
              onChange={(e) => setForm((prev) => ({ ...prev, comments: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none transition-all text-sm resize-none"
              placeholder={L(
                "Bilmemiz gereken bir şey var mı? Özel günler, erişilebilirlik, beslenme tercihleri...",
                "Anything we should know? Special occasions, accessibility needs, dietary preferences..."
              )} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-palm-800 mb-1.5">
              {L("Concierge / Referans Kodu", "Concierge / Referral Code")} <span className="font-normal text-lava-400 ml-1">({L("isteğe bağlı", "optional")})</span>
            </label>
            <input type="text" value={form.conciergeRef}
              onChange={(e) => setForm((prev) => ({ ...prev, conciergeRef: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none transition-all text-sm"
              placeholder="Concierge name or referral code" />
          </div>
        </div>
      </div>

      {/* STEP 4: Review & Pay */}
      <div className="bg-white rounded-2xl shadow-lg border border-sand-200/50 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-palm-700 text-white flex items-center justify-center text-sm font-bold">
            4
          </div>
          <h3 className="font-display text-xl font-semibold text-palm-900">
            {L("Onayla ve Öde", "Review & Pay")}
          </h3>
        </div>

        <div className="bg-sand-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lava-600 text-sm">{price.label}</span>
            <span className="text-lava-600 text-sm">${price.amount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lava-600 text-sm">{L("Hawaiʻi GET (%4,712)", "Hawaiʻi GET (4.712%)")}</span>
            <span className="text-lava-600 text-sm">${fmt(getTax)}</span>
          </div>
          <div className="border-t border-sand-300 mt-4 pt-4 flex items-center justify-between">
            <span className="font-display text-lg font-bold text-palm-900">{L("Toplam", "Total")}</span>
            <span className="font-display text-2xl font-bold text-palm-900">
              ${fmt(totalWithGet)}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-sand-300">
            <label className="block text-sm font-semibold text-palm-800 mb-1.5">
              {L("Promosyon Kodu", "Promo Code")}{" "}
              <span className="font-normal text-lava-400 ml-1">({L("isteğe bağlı", "optional")})</span>
            </label>
            <input
              type="text"
              value={form.promoCode}
              onChange={(e) => setForm((prev) => ({ ...prev, promoCode: e.target.value.toUpperCase() }))}
              className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none transition-all text-sm uppercase placeholder:normal-case"
              placeholder={L("Kodunuz varsa girin", "Enter code if you have one")}
            />
            <p className="text-xs text-lava-400 mt-1.5">
              {L(
                "Geçerliyse indirim Stripe ödeme sayfasında uygulanır.",
                "If valid, the discount is applied on the Stripe payment page."
              )}
            </p>
          </div>

          <p className="text-xs text-lava-400 mt-4">
            {L(
              "Ödemeyi tamamlamak için güvenli şekilde Stripe'a yönlendirileceksiniz.",
              "You'll be securely redirected to Stripe to complete payment."
            )}
          </p>
        </div>

        {/* Private tour note */}
        {form.tourType === "private" && (
          <div className="mb-4 p-4 bg-palm-50 rounded-lg text-sm text-palm-700">
            {isTurkish ? (
              <>
                <p>
                  <strong>Not:</strong> Özel turunuz varsayılan olarak standart
                  ada rotasını izler. Rezervasyonunuzdan sonra alınma saati,
                  özel istekler veya ek duraklar için sizinle iletişime
                  geçeceğiz.
                </p>
                <p className="mt-2 text-palm-600/80 text-xs">
                  <strong>Note:</strong> Your private tour follows the standard
                  circle island route by default. After booking, we&apos;ll
                  reach out to discuss pickup time, any special requests, or
                  custom stops.
                </p>
              </>
            ) : (
              <>
                <strong>Note:</strong> Your private tour follows the standard
                circle island route by default. After booking, we&apos;ll reach
                out to discuss pickup time, any special requests, or custom
                stops to make your tour perfect.
              </>
            )}
          </div>
        )}

        <WaiverAgreement
          agreed={waiver.agreed}
          onChange={(agreed, acceptedAt) => setWaiver({ agreed, acceptedAt })}
          L={isTurkish ? L : undefined}
        />

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!form.date || !form.firstName || !form.email || !waiver.agreed || submitting || (form.tourType === "private" && form.vehicleType === "van" && vanConflict)}
          className="w-full btn-gold !py-5 !text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {L("İşleniyor...", "Processing...")}
            </span>
          ) : isTurkish ? (
            `$${fmt(totalWithGet)} Öde ve Turu Ayırtın — Pay & Book`
          ) : (
            `Pay $${fmt(totalWithGet)} & Book Tour`
          )}
        </button>

        <p className="text-center text-xs text-lava-400 mt-4">
          {isTurkish
            ? "Rezervasyon yaparak Sorumluluk Feragatnamesini, "
            : "By booking, you agree to our Liability Waiver, "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-palm-700">
            {isTurkish ? "Hizmet Şartlarını" : "Terms of Service"}
          </a>
          {isTurkish ? " ve " : " and "}
          <a href="/cancellation" target="_blank" rel="noopener noreferrer" className="underline hover:text-palm-700">
            {isTurkish ? "İptal Politikasını" : "Cancellation Policy"}
          </a>
          {isTurkish
            ? " kabul etmiş olursunuz. Stripe ile güvenli ödeme."
            : ". Secure payment by Stripe."}
        </p>
      </div>
    </form>
  );
}
