import { motion } from 'framer-motion';

export default function About() {
  return (
    <section
      id="story"
      className="bg-brand-dark text-white py-24 px-4 relative overflow-hidden"
    >
      {/* Subtle decorative gradient overlay and ambient glows */}
      <div className="absolute inset-0 bg-radial from-brand-blue/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#C8A96E_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      {/* Top subtle border highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/25 to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto lg:grid lg:grid-cols-2 gap-16 items-center relative z-10"
      >
        {/* Left Column: Story Content */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-brand-gold/60" />
            <span className="tracking-[0.3em] text-brand-gold text-sm font-semibold uppercase">
              OUR STORY
            </span>
          </div>

          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white leading-tight mt-4">
            Crafted with Passion,
            <br />
            Baked with Love
          </h2>

          <div className="text-white/70 leading-relaxed mt-6 space-y-4 text-base sm:text-lg">
            <p>
              Born from a love for the oversized, gooey cookies of New York City,
              Sukié brings the authentic NYC cookie experience to Mumbai — with an
              Indian twist. Every cookie is 100% eggless, crafted with Belgian
              Callebaut chocolate and European butter, and baked fresh daily in
              limited batches.
            </p>
            <p>
              We believe in quality over quantity. Our menu changes with the
              seasons, and once a flavour sells out, it&apos;s gone. That&apos;s the Sukié
              way.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="font-script text-brand-gold-light text-xl italic mt-6">
              &ldquo;Every cookie tells a story of craft, care, and a little bit of magic.&rdquo;
            </p>
          </div>
        </div>

        {/* Right Column: Visual Brand Card & Stats */}
        <div className="mt-12 lg:mt-0 flex flex-col justify-center">
          {/* Logo Card with subtle glow/shadow */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue-light/40 via-brand-gold/20 to-brand-blue/40 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500 pointer-events-none" />

            <div className="relative rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blue-dark p-8 sm:p-12 shadow-2xl border border-white/10 overflow-hidden flex items-center justify-center">
              {/* Subtle inner lighting */}
              <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent pointer-events-none" />

              <img
                src="/images/logo.png"
                alt="Sukié Cookies"
                className="max-w-xs w-full h-auto object-contain mx-auto drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* 3 Stats in a Row */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-4 border border-white/10 hover:border-brand-gold/30 hover:bg-white/[0.08] transition-all duration-300">
              <span className="block font-heading text-2xl sm:text-3xl font-bold text-brand-gold">
                170g
              </span>
              <span className="block text-xs sm:text-sm text-white/60 mt-1 uppercase tracking-wider">
                Per Cookie
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-4 border border-white/10 hover:border-brand-gold/30 hover:bg-white/[0.08] transition-all duration-300">
              <span className="block font-heading text-2xl sm:text-3xl font-bold text-brand-gold">
                Daily
              </span>
              <span className="block text-xs sm:text-sm text-white/60 mt-1 uppercase tracking-wider">
                Fresh Baked
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-4 border border-white/10 hover:border-brand-gold/30 hover:bg-white/[0.08] transition-all duration-300">
              <span className="block font-heading text-2xl sm:text-3xl font-bold text-brand-gold">
                Limited
              </span>
              <span className="block text-xs sm:text-sm text-white/60 mt-1 uppercase tracking-wider">
                Menu Drops
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
