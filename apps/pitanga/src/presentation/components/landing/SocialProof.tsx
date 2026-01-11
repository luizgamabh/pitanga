'use client';

import { motion } from 'motion/react';

const stats = [
  { value: '48h', label: 'Tempo médio de ativação' },
  { value: '99.9%', label: 'Uptime garantido' },
  { value: '< 5min', label: 'Para atualizar conteúdo' },
  { value: '0', label: 'Conhecimento técnico necessário' },
];

const testimonials = [
  {
    quote: 'Antes eu gastava horas imprimindo cartazes. Agora atualizo tudo em minutos.',
    author: 'Maria Silva',
    role: 'Proprietária de lanchonete',
    image: null,
  },
  {
    quote: 'Meus clientes comentam das promoções que veem na TV. Isso não acontecia com os cartazes.',
    author: 'João Santos',
    role: 'Gerente de supermercado',
    image: null,
  },
];

export function SocialProof() {
  return (
    <section className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-800/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Stats */}
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-2xl bg-white dark:bg-gray-900 p-6 text-center shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10"
              >
                <p className="text-3xl font-semibold text-pitanga-600 dark:text-pitanga-400">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mx-auto mt-16 max-w-4xl">
          <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white">
            O que nossos clientes dizem
          </h3>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10"
              >
                <blockquote className="text-base text-gray-700 dark:text-gray-300">
                  "{testimonial.quote}"
                </blockquote>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-pitanga-100 dark:bg-pitanga-900/30 flex items-center justify-center">
                    <span className="text-sm font-semibold text-pitanga-600 dark:text-pitanga-400">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
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
