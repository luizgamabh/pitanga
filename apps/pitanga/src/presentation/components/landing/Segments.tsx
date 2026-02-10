'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const segments = [
  {
    title: 'Restaurantes e fast-food',
    icon: '🍽️',
    pain: 'Cardápio impresso desatualizado e custo de reimpressão',
    solution: 'Menu digital com preços atualizados em tempo real',
  },
  {
    title: 'Clínicas e serviços',
    icon: '🏥',
    pain: 'Pacientes esperando sem informação útil',
    solution: 'Comunicação de serviços e redução da percepção de espera',
  },
  {
    title: 'Varejo e supermercados',
    icon: '🛒',
    pain: 'Promoções que ninguém vê ou chegam tarde',
    solution: 'Ofertas em destaque que mudam com um clique',
  },
  {
    title: 'Condomínios',
    icon: '🏢',
    pain: 'Avisos em papel que ninguém lê no elevador',
    solution: 'Comunicados digitais nos espaços comuns em tempo real',
  },
  {
    title: 'Residências',
    icon: '🏠',
    pain: 'Informações espalhadas em apps, papéis e recados',
    solution: 'Painel centralizado com agenda, recados e lembretes da família',
  },
  {
    title: 'Academias',
    icon: '💪',
    pain: 'Horários de aulas e avisos que ninguém acompanha',
    solution: 'Grade de horários e promoções sempre visíveis',
  },
  {
    title: 'Hotéis e pousadas',
    icon: '🏨',
    pain: 'Hóspedes sem informação sobre serviços e eventos',
    solution: 'Painéis com eventos, horários e atrações locais',
  },
  {
    title: 'Eventos outdoor',
    icon: '🎪',
    pain: 'Público perdido sem saber a programação do evento',
    solution: 'Telões com programação, mapas e patrocinadores em tempo real',
  },
  {
    title: 'Educação',
    icon: '🎓',
    pain: 'Murais de aviso que ninguém atualiza',
    solution: 'Calendário, avisos e eventos atualizados automaticamente',
  },
  {
    title: 'Imobiliárias',
    icon: '🏗️',
    pain: 'Vitrine estática com imóveis já vendidos',
    solution: 'Portfólio dinâmico atualizado direto do sistema',
  },
  {
    title: 'Escritórios corporativos',
    icon: '🏛️',
    pain: 'Comunicação interna dispersa e ignorada',
    solution: 'KPIs, avisos e metas em painéis nas áreas comuns',
  },
  {
    title: 'Salões de beleza',
    icon: '💇',
    pain: 'Clientes sem conhecer todos os serviços disponíveis',
    solution: 'Portfólio de serviços e promoções na tela de espera',
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
};

function SegmentCard({ segment }: { segment: (typeof segments)[number] }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/10">
      <div className="aspect-4/3 bg-gradient-to-br from-pitanga-100 to-pitanga-50 dark:from-pitanga-900/30 dark:to-gray-800">
        <div className="flex h-full items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80">
            <span className="text-2xl">{segment.icon}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {segment.title}
        </h3>

        <div className="mt-4 space-y-3">
          <div className="flex gap-3">
            <div className="mt-1 shrink-0">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <span className="text-xs text-red-600 dark:text-red-400">
                  ✕
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {segment.pain}
            </p>
          </div>

          <div className="flex gap-3">
            <div className="mt-1 shrink-0">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <span className="text-xs text-green-600 dark:text-green-400">
                  ✓
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {segment.solution}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 3;
const totalPages = Math.ceil(segments.length / ITEMS_PER_PAGE);

export function Segments() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setPage((prev) => (prev + 1) % totalPages);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, []);

  const goTo = useCallback(
    (target: number) => {
      setDirection(target > page ? 1 : -1);
      setPage(target);
    },
    [page],
  );

  const start = page * ITEMS_PER_PAGE;
  const visibleSegments = segments.slice(start, start + ITEMS_PER_PAGE);

  return (
    <section id="segmentos" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base/7 font-semibold text-pitanga-600 dark:text-pitanga-400">
            Para quem é
          </h2>
          <p className="mt-2 text-pretty text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Ideal para quem precisa comunicar rápido
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative">
            {/* Previous button */}
            <button
              onClick={prev}
              aria-label="Previous segments"
              className="absolute -left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-900/10 transition-colors hover:bg-pitanga-50 lg:-left-14 dark:bg-gray-800 dark:ring-white/10 dark:hover:bg-gray-700"
            >
              <svg
                className="h-5 w-5 text-gray-700 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            {/* Next button */}
            <button
              onClick={next}
              aria-label="Next segments"
              className="absolute -right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-900/10 transition-colors hover:bg-pitanga-50 lg:-right-14 dark:bg-gray-800 dark:ring-white/10 dark:hover:bg-gray-700"
            >
              <svg
                className="h-5 w-5 text-gray-700 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>

            {/* Carousel */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={page}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="grid grid-cols-1 gap-8 md:grid-cols-3"
                >
                  {visibleSegments.map((segment) => (
                    <SegmentCard key={segment.title} segment={segment} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Page ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i === page
                    ? 'bg-pitanga-600 dark:bg-pitanga-400'
                    : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
