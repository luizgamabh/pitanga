'use client';

import { motion } from 'motion/react';

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background pattern */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full stroke-gray-200 dark:stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="hero-pattern"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect
          fill="url(#hero-pattern)"
          width="100%"
          height="100%"
          strokeWidth={0}
        />
      </svg>

      {/* Gradient blur */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-pitanga-400 to-pink-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 lg:px-8 lg:pt-44">
        <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-base/7 font-semibold text-pitanga-600 dark:text-pitanga-400">
              Mídia Digital Indoor para comércios!
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-6xl dark:text-white">
              Sua TV vendendo por você,{' '}
              <span className="text-pitanga-600 dark:text-pitanga-400">
                24 horas por dia
              </span>
            </h1>
            <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-300 text-pretty">
              Atualize preços, promoções e destaques em segundos, direto do seu celular.
              Sem técnico. Sem complicação. E funciona mesmo sem internet.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6"
          >
            <a
              href="#contato"
              className="w-full sm:w-auto rounded-md bg-pitanga-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-pitanga-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitanga-500 transition-colors"
            >
              Solicitar proposta
            </a>
            <a
              href="#simulador"
              className="w-full sm:w-auto text-base font-semibold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Calcular potencial da minha loja <span aria-hidden="true">→</span>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-sm text-gray-500 dark:text-gray-400"
          >
            Ativação em até 48h. Sem fidelidade longa.
          </motion.p>
        </div>

        {/* Hero image placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 flow-root sm:mt-20"
        >
          <div className="relative rounded-xl bg-gray-900/5 dark:bg-white/5 p-2 ring-1 ring-gray-900/10 dark:ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="relative aspect-video rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10">
              {/* Placeholder for TV mockup / video */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-pitanga-100 dark:bg-pitanga-900/50 flex items-center justify-center">
                    <svg className="h-8 w-8 text-pitanga-600 dark:text-pitanga-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Veja uma TV vendendo por você
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
