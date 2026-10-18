"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type FormData = {
  name: string;
  email: string;
  phone: string;
  partnerName: string;
  arrivalDate: string;
  departureDate: string;
  guests: string;
  interests: string;
  budget: string;
  message: string;
};

/* ── Animated waving flag component ── */
function WavingFlag({ size = "w-40 md:w-52" }: { size?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 240;
    const H = 160;
    canvas.width = W;
    canvas.height = H;

    let frame = 0;
    let animId: number;

    function draw() {
      if (!ctx) return;
      frame += 0.04;
      ctx.clearRect(0, 0, W, H);

      /* flagpole */
      ctx.fillStyle = "#C9A84C";
      ctx.fillRect(4, 0, 5, H);
      ctx.beginPath();
      ctx.arc(6.5, 3, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#D4AF37";
      ctx.fill();

      /* draw flag in slices for wave effect */
      const slices = 120;
      const sliceW = (W - 20) / slices;

      for (let i = 0; i < slices; i++) {
        const x = 16 + i * sliceW;
        const progress = i / slices;
        const wave = Math.sin(frame + progress * 4) * (6 + progress * 10);
        const wave2 = Math.sin(frame * 1.3 + progress * 5) * (3 + progress * 5);
        const totalWave = wave + wave2;

        ctx.save();
        ctx.beginPath();
        ctx.rect(x, 0, sliceW + 1, H);
        ctx.clip();

        ctx.save();
        ctx.translate(0, totalWave * 0.3);

        /* slight vertical compression/stretch for realism */
        const scaleY = 1 + Math.sin(frame + progress * 4) * 0.02;
        ctx.translate(0, H / 2);
        ctx.scale(1, scaleY);
        ctx.translate(0, -H / 2);

        /* red background */
        ctx.fillStyle = "#E30A17";
        ctx.fillRect(0, 8, W, H - 16);

        /* white crescent */
        ctx.beginPath();
        ctx.arc(105, H / 2, 28, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        /* red inner crescent */
        ctx.beginPath();
        ctx.arc(112, H / 2, 22, 0, Math.PI * 2);
        ctx.fillStyle = "#E30A17";
        ctx.fill();

        /* white star */
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        const sx = 142, sy = H / 2, sr = 9;
        for (let j = 0; j < 5; j++) {
          const angle = -Math.PI / 2 + (j * 2 * Math.PI) / 5;
          const innerAngle = angle + Math.PI / 5;
          const ox = sx + Math.cos(angle) * sr;
          const oy = sy + Math.sin(angle) * sr;
          const ix = sx + Math.cos(innerAngle) * (sr * 0.4);
          const iy = sy + Math.sin(innerAngle) * (sr * 0.4);
          if (j === 0) ctx.moveTo(ox, oy);
          else ctx.lineTo(ox, oy);
          ctx.lineTo(ix, iy);
        }
        ctx.closePath();
        ctx.fill();

        /* shading overlay for depth */
        const shade = 0.04 + Math.sin(frame + progress * 4) * 0.04;
        ctx.fillStyle = `rgba(0,0,0,${shade})`;
        ctx.fillRect(0, 0, W, H);

        /* highlight on wave peaks */
        const highlight = Math.max(0, Math.sin(frame + progress * 4)) * 0.06;
        ctx.fillStyle = `rgba(255,255,255,${highlight})`;
        ctx.fillRect(0, 0, W, H);

        ctx.restore();
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`${size} drop-shadow-2xl`}
      style={{ aspectRatio: "240/160" }}
      aria-label="Türk Bayrağı"
    />
  );
}

export default function HoneymoonPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    partnerName: "",
    arrivalDate: "",
    departureDate: "",
    guests: "2",
    interests: "",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/honeymoon-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      alert("Bir sorun oluştu. Lütfen bizi 808.203.4103 numarasından arayın.");
    }
    setSending(false);
  }

  return (
    <main className="min-h-screen bg-sand-50">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-palm-950 via-palm-900 to-lava-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-lava-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-6 py-24">
          {/* Animated Turkish flag */}
          <div className="flex justify-center mb-6">
            <WavingFlag size="w-36 md:w-48" />
          </div>
          <span className="inline-block bg-gold-500/20 text-gold-300 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            &Ouml;zel Deneyim
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-sand-50 mb-4">
            Hawai&apos;i&apos;de
            <br />
            <span className="text-gold-400">T&uuml;rk&ccedil;e Deneyimler</span>
          </h1>
          <p className="text-sand-200/80 text-lg md:text-xl max-w-2xl mx-auto mt-4 leading-relaxed">
            O&apos;ahu adasında T&uuml;rk&ccedil;e rehberli tek ada turu &mdash;
            ve havalimanından havalimanına eksiksiz balayı paketimiz. Adayı
            kendi dilinizde keşfedin. Hoş geldiniz!
          </p>
        </div>
      </section>

      {/* Choose: guided tour or the full honeymoon package */}
      <section className="section-padding bg-sand-50 !py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="heading-md text-palm-900">
              İki Şekilde Yanınızdayız
            </h2>
            <p className="text-lava-600 mt-3">
              Sadece bir g&uuml;nl&uuml;k ada turu mu, yoksa baştan sona
              planlanmış bir balayı mı?
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Turkish-guided circle island tour */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-sand-200/60 flex flex-col">
              <div className="text-3xl mb-4">&#128663;</div>
              <h3 className="font-display text-xl font-bold text-palm-900 mb-2">
                T&uuml;rk&ccedil;e Rehberli Ada Turu
              </h3>
              <p className="text-sm text-lava-600 leading-relaxed flex-1">
                Bir g&uuml;nde t&uuml;m adayı, T&uuml;rk&ccedil;e rehberlik
                eşliğinde keşfedin. &Ouml;zel tur olarak sunulur &mdash; sadece
                sizin grubunuz, esnek saatler.
              </p>
              <Link
                href="/book?tour=private&lang=tr"
                className="btn-gold mt-6 w-full text-center"
              >
                Tur Rezervasyonu
              </Link>
            </div>

            {/* Full honeymoon package */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gold-500/40 flex flex-col relative">
              <span className="absolute -top-3 right-6 bg-gold-500 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                Eksiksiz Paket
              </span>
              <div className="text-3xl mb-4">&#128141;</div>
              <h3 className="font-display text-xl font-bold text-palm-900 mb-2">
                T&uuml;rk Balayı Paketi
              </h3>
              <p className="text-sm text-lava-600 leading-relaxed flex-1">
                7&ndash;10 g&uuml;n tropikal cennet. Otel, yemek, ulaşım,
                turlar &mdash; havalimanından havalimanına her şeyi biz
                hallediyoruz.
              </p>
              <a
                href="#balayi"
                className="btn-primary mt-6 w-full text-center"
              >
                Detaylar &amp; Talep Formu
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section id="balayi" className="section-padding bg-white scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="label-sm">Eksiksiz Deneyim</span>
            <h2 className="heading-lg text-palm-900 mt-3">
              7&ndash;10 G&uuml;n Tropikal Cennet
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                title: "Premium Konaklama",
                desc: "&Ouml;zenle se&ccedil;ilmiş oteller ve tatil k&ouml;yleri. Waikiki sahilindeki butik otellerden etkileyici North Shore kıyısına kadar.",
              },
              {
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Se&ccedil;kin Restoran Rezervasyonları",
                desc: "Adanın en iyi masalarını sizin i&ccedil;in ayırtıyoruz. Okyanus manzaralı g&uuml;nbatımı yemeklerinden gizli yerel mek&acirc;nlara kadar.",
              },
              {
                icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
                title: "Tam Ada Turu",
                desc: "T&uuml;rk&ccedil;e rehberlik eşliğinde &ouml;zel O&apos;ahu ada turu. Adanın g&uuml;zelliklerini kendi dilinizde keşfedin.",
              },
              {
                icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
                title: "Havalimanı Transferleri ve Ulaşım",
                desc: "Varışta HNL havalimanından Mercedes ile karşılama, kalış s&uuml;resince &ouml;zel ulaşım ve havalimanına d&ouml;n&uuml;ş.",
              },
              {
                icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
                title: "Romantik Dokunuşlar",
                desc: "S&uuml;rpriz &ccedil;i&ccedil;ek d&uuml;zenlemeleri, g&uuml;nbatımı tekne turları, &ccedil;ift spa bakımları ve daha fazlası &mdash; hepsi sizin i&ccedil;in ayarlanır.",
              },
              {
                icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129",
                title: "T&uuml;rk&ccedil;e Konuşan Rehber",
                desc: "O&apos;ahu&apos;daki tek T&uuml;rk&ccedil;e rehberli tur deneyimi. Tropikal cenneti keşfederken kendinizi evinizde hissedin.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-6 rounded-xl bg-sand-50/50 hover:bg-sand-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-palm-100 flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-palm-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={item.icon}
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-palm-900 mb-1">
                    <span dangerouslySetInnerHTML={{ __html: item.title }} />
                  </h3>
                  <p className="text-sm text-lava-600 leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: item.desc }} />
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Inquiry Form */}
      <section className="section-padding bg-palm-950">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-sand-50 mb-3">
              Balayınızı Planlamaya Başlayın
            </h2>
            <p className="text-sand-300/80">
              Hayalinizdeki tatili bize anlatın, size &ouml;zel bir program
              oluşturalım. Taahh&uuml;t yok &mdash; sadece bir sohbet.
            </p>
          </div>

          {submitted ? (
            <div className="bg-palm-800/50 rounded-2xl p-10 text-center">
              <div className="text-4xl mb-4">&#127812;</div>
              <h3 className="font-display text-2xl font-semibold text-sand-50 mb-3">
                Teşekk&uuml;rler!
              </h3>
              <p className="text-sand-300/80 mb-6">
                Talebinizi aldık. 24 saat i&ccedil;inde sizinle iletişime
                ge&ccedil;eceğiz. Balayınızı planlamak i&ccedil;in sabırsızlanıyoruz!
              </p>
              <Link href="/" className="btn-gold">
                Ana Sayfaya D&ouml;n
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-sand-300 mb-1">
                    Adınız *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full px-4 py-3 bg-palm-800/50 border border-palm-700 rounded-xl text-sand-100 placeholder:text-sand-500 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    placeholder="Adınız"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sand-300 mb-1">
                    Eşinizin Adı
                  </label>
                  <input
                    value={form.partnerName}
                    onChange={(e) => update("partnerName", e.target.value)}
                    className="w-full px-4 py-3 bg-palm-800/50 border border-palm-700 rounded-xl text-sand-100 placeholder:text-sand-500 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    placeholder="Eşinizin adı"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-sand-300 mb-1">
                    E-posta *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full px-4 py-3 bg-palm-800/50 border border-palm-700 rounded-xl text-sand-100 placeholder:text-sand-500 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    placeholder="siz@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sand-300 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full px-4 py-3 bg-palm-800/50 border border-palm-700 rounded-xl text-sand-100 placeholder:text-sand-500 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    placeholder="+90 555 123 4567"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-sand-300 mb-1">
                    Tahmini Varış Tarihi
                  </label>
                  <input
                    type="date"
                    value={form.arrivalDate}
                    onChange={(e) => update("arrivalDate", e.target.value)}
                    className="w-full px-4 py-3 bg-palm-800/50 border border-palm-700 rounded-xl text-sand-100 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sand-300 mb-1">
                    Tahmini Ayrılış Tarihi
                  </label>
                  <input
                    type="date"
                    value={form.departureDate}
                    onChange={(e) => update("departureDate", e.target.value)}
                    className="w-full px-4 py-3 bg-palm-800/50 border border-palm-700 rounded-xl text-sand-100 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sand-300 mb-1">
                  İlgi Alanları ve Tercihler
                </label>
                <input
                  value={form.interests}
                  onChange={(e) => update("interests", e.target.value)}
                  className="w-full px-4 py-3 bg-palm-800/50 border border-palm-700 rounded-xl text-sand-100 placeholder:text-sand-500 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="Plaj, doğa yürüyüşü, şnorkelle dalış, gurme yemek, spa..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-sand-300 mb-1">
                  Bilmemizi istediğiniz başka bir şey var mı?
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="w-full px-4 py-3 bg-palm-800/50 border border-palm-700 rounded-xl text-sand-100 placeholder:text-sand-500 focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                  placeholder="Özel günler, diyet gereksinimleri, erişilebilirlik ihtiyaçları..."
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-gold w-full !py-4 disabled:opacity-50"
              >
                {sending ? "Gönderiliyor..." : "Talep Gönder"}
              </button>

              <p className="text-center text-xs text-sand-500">
                Taahh&uuml;t yok. 24 saat i&ccedil;inde size &ouml;zel bir
                teklifle d&ouml;neceğiz.
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
