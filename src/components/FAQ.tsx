import { FAQS } from "@/lib/faq";

/**
 * Plain HTML <details> — no JavaScript, so every question and answer is in
 * the page source for search engines and AI crawlers, open or closed.
 */
export default function FAQ() {
  return (
    <section id="faq" className="section-padding bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="label-sm">Good to Know</span>
          <h2 className="heading-lg text-palm-900 mt-3">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="divide-y divide-sand-200 border-y border-sand-200">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-lg font-semibold text-palm-900 [&::-webkit-details-marker]:hidden">
                <h3 className="text-left">{f.q}</h3>
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-gold-600 transition-transform duration-300 group-open:rotate-45 text-2xl leading-none"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-lava-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
