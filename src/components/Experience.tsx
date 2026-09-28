export default function Experience() {
  const perks = [
    {
      icon: "\ud83c\udf05",
      title: "Back for Happy Hour",
      description:
        "Our small group tour picks up at 6:15am and gets you back to Waikiki in time for sunset drinks. Private tours offer flexible departure \u2014 you choose the time.",
    },
    {
      icon: "\ud83c\udf99\ufe0f",
      title: "Expert, Unscripted Commentary",
      description:
        "No robotic speeches. Your guide delivers dynamic, authentic commentary tailored to your interests \u2014 history, culture, nature, or all three.",
    },
    {
      icon: "\ud83c\udfb5",
      title: "Curated Music",
      description:
        "A thoughtfully crafted soundtrack sets the mood as you cruise \u2014 Hawaiian classics, island reggae, and the perfect beats for every stretch of coastline.",
    },
    {
      icon: "\ud83c\uddf9\ud83c\uddf7",
      title: "T\u00fcrk\u00e7e Tur Rehberi",
      description:
        "The only Turkish-speaking guided circle island tour on O\u2018ahu. Experience the island with expert commentary in Turkish \u2014 ho\u015f geldiniz!",
    },
    {
      icon: "\ud83d\udc9b",
      title: "Immersive Spirit of Hawai\u2018i",
      description:
        "This isn\u2019t just sightseeing. Through all your senses \u2014 the salt air, the trade winds, the stories of the land \u2014 you\u2019ll feel the m\u0101na of this island.",
    },
    {
      icon: "\ud83d\udccd",
      title: "Door-to-Door Service",
      description:
        "Picked up right from your Waikiki hotel lobby and returned at the end. Private tours also pickup from Ko\u2018Olina and Turtle Bay.",
    },
  ];

  return (
    <section id="experience" className="section-padding bg-sand-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-palm-100/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold-100/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="label-sm">Why Summit O&apos;ahu</span>
          <h2 className="heading-lg text-palm-900 mt-3 mb-5">
            More Than a Tour.
            <br />
            <span className="text-gold-600 italic">An Experience.</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            We don&apos;t just show you the island &mdash; we invite you into its
            spirit. Every detail is crafted to create something you&apos;ll
            carry with you long after you leave.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-sand-200/50 hover:border-gold-300/50"
            >
              <div className="w-14 h-14 rounded-xl bg-palm-50 flex items-center justify-center mb-5 group-hover:bg-gold-50 transition-colors text-2xl">
                {perk.icon}
              </div>
              <h3 className="font-display text-xl font-semibold text-palm-900 mb-3">
                {perk.title}
              </h3>
              <p className="text-lava-500 text-sm leading-relaxed">
                {perk.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
