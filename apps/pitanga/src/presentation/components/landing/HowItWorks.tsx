'use client';

import { motion } from 'motion/react';
import { TvIcon, DevicePhoneMobileIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    number: '01',
    title: 'Conecte o dispositivo',
    description: 'Plugue o pequeno dispositivo na entrada HDMI da sua TV. Pronto.',
    icon: TvIcon,
  },
  {
    number: '02',
    title: 'Configure pelo celular',
    description: 'Acesse o painel pelo celular ou computador e escolha o que exibir.',
    icon: DevicePhoneMobileIcon,
  },
  {
    number: '03',
    title: 'A TV atualiza sozinha',
    description: 'Mudou uma promoção? Em segundos a TV já está exibindo.',
    icon: ArrowPathIcon,
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base/7 font-semibold text-pitanga-600 dark:text-pitanga-400">
            Simples de instalar
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl dark:text-white">
            Funcionando em 3 passos
          </p>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Sem técnico especializado. Sem configuração complexa.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Single connector line spanning center to center */}
            <div
              className="hidden md:block absolute top-12 h-0.5 z-0 bg-pitanga-500"
              style={{ left: '16.667%', right: '16.667%' }}
            />

            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative z-10"
              >
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gray-900 ring-2 ring-pitanga-500">
                    <step.icon className="h-10 w-10 text-pitanga-400 dark:text-pitanga-400" />
                  </div>
                  <span className="mt-4 text-sm font-semibold text-pitanga-600 dark:text-pitanga-400">
                    {step.number}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 dark:bg-green-900/30 px-4 py-2 text-sm text-green-700 dark:text-green-300 ring-1 ring-green-100 dark:ring-green-800">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            Pode ser replicado em várias TVs da mesma loja ou em filiais
          </div>
        </motion.div>
      </div>
    </section>
  );
}
