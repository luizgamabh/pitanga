'use client';

import { motion } from 'motion/react';

const segments = [
  {
    title: 'Restaurantes e fast-food',
    pain: 'Cardápio impresso desatualizado e custo de reimpressão',
    solution: 'Menu digital com preços atualizados em tempo real',
    image: '/segments/restaurant.jpg',
  },
  {
    title: 'Clínicas e serviços',
    pain: 'Pacientes esperando sem informação útil',
    solution: 'Comunicação de serviços e redução da percepção de espera',
    image: '/segments/clinic.jpg',
  },
  {
    title: 'Varejo e supermercados',
    pain: 'Promoções que ninguém vê ou chegam tarde',
    solution: 'Ofertas em destaque que mudam com um clique',
    image: '/segments/retail.jpg',
  },
];

export function Segments() {
  return (
    <section id="segmentos" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base/7 font-semibold text-pitanga-600 dark:text-pitanga-400">
            Para quem é
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl dark:text-white">
            Ideal para quem precisa comunicar rápido
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {segments.map((segment, index) => (
              <motion.div
                key={segment.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10"
              >
                {/* Image placeholder */}
                <div className="aspect-4/3 bg-gradient-to-br from-pitanga-100 to-pitanga-50 dark:from-pitanga-900/30 dark:to-gray-800">
                  <div className="flex h-full items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center">
                      <span className="text-2xl">
                        {index === 0 ? '🍽️' : index === 1 ? '🏥' : '🛒'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {segment.title}
                  </h3>

                  <div className="mt-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="shrink-0 mt-1">
                        <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <span className="text-xs text-red-600 dark:text-red-400">✕</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {segment.pain}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <div className="shrink-0 mt-1">
                        <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <span className="text-xs text-green-600 dark:text-green-400">✓</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {segment.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
