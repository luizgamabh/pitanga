'use client';

import { motion } from 'motion/react';
import { ShieldCheckIcon, SignalIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'A TV nunca fica preta',
    description: 'Mesmo em quedas de energia ou falhas, a TV volta sozinha exibindo o conteúdo.',
  },
  {
    icon: SignalIcon,
    title: 'Funciona sem internet',
    description: 'Se a conexão cair, a TV continua exibindo. Sincroniza automaticamente quando voltar.',
  },
  {
    icon: ArrowPathIcon,
    title: 'Atualizações automáticas',
    description: 'O sistema se mantém atualizado sem você precisar fazer nada.',
  },
];

export function Reliability() {
  return (
    <section className="py-24 sm:py-32 bg-gray-900 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base/7 font-semibold text-pitanga-400">
              Confiabilidade
            </h2>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-pretty text-white sm:text-4xl">
              Feito para funcionar sempre
            </p>
            <p className="mt-4 text-lg text-gray-300">
              Seu negócio não para. Sua TV também não.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pitanga-500/10 ring-1 ring-pitanga-500/30">
                  <feature.icon className="h-8 w-8 text-pitanga-400" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 rounded-2xl bg-gradient-to-r from-pitanga-500/20 to-pink-500/20 p-px"
        >
          <div className="rounded-2xl bg-gray-900 dark:bg-gray-950 px-8 py-6 text-center">
            <p className="text-lg font-medium text-white">
              "Desde que instalamos, a TV nunca ficou fora do ar.
              <span className="text-pitanga-400"> Confiança total.</span>"
            </p>
            <p className="mt-2 text-sm text-gray-400">
              — Proprietário de restaurante, São Paulo
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
