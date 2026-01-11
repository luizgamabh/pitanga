'use client';

import { motion } from 'motion/react';
import {
  ClockIcon,
  BoltIcon,
  WifiIcon,
  BuildingStorefrontIcon,
  SparklesIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const benefits = [
  {
    title: 'Atualização instantânea',
    description: 'Mudou o preço? Em segundos a TV já mostra.',
    icon: BoltIcon,
  },
  {
    title: 'Funciona offline',
    description: 'Se a internet cair, a TV continua exibindo.',
    icon: WifiIcon,
  },
  {
    title: 'Controle em tempo real',
    description: 'Gerencie promoções do celular, de qualquer lugar.',
    icon: ClockIcon,
  },
  {
    title: 'Várias telas, um painel',
    description: 'Padronize o conteúdo em todas as lojas.',
    icon: BuildingStorefrontIcon,
  },
  {
    title: 'Visual profissional',
    description: 'Templates prontos, sem precisar de designer.',
    icon: SparklesIcon,
  },
  {
    title: 'Retorno mensurável',
    description: 'Saiba o que está gerando mais atenção.',
    icon: CurrencyDollarIcon,
  },
];

export function Benefits() {
  return (
    <section id="beneficios" className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-800/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base/7 font-semibold text-pitanga-600 dark:text-pitanga-400">
            Por que usar
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl dark:text-white">
            Tudo o que você precisa para vender mais
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-pitanga-50 dark:bg-pitanga-900/30">
                    <benefit.icon className="h-6 w-6 text-pitanga-600 dark:text-pitanga-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {benefit.description}
                    </p>
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
