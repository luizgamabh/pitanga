'use client';

import { motion } from 'motion/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const plans = [
  {
    name: 'Inicial',
    description: 'Ideal para começar com 1 tela',
    price: '97',
    period: '/mês por tela',
    features: [
      'Painel de gestão completo',
      'Templates profissionais',
      'Suporte por chat',
      'Atualizações ilimitadas',
    ],
    cta: 'Começar agora',
    highlighted: false,
  },
  {
    name: 'Profissional',
    description: 'Para lojas com múltiplas telas',
    price: '79',
    period: '/mês por tela',
    features: [
      'Tudo do plano Inicial',
      'A partir de 3 telas',
      'Gestão multi-loja',
      'Relatórios de exibição',
      'Suporte prioritário',
      'Treinamento incluso',
    ],
    cta: 'Falar com consultor',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    description: 'Redes e franquias',
    price: 'Sob consulta',
    period: '',
    features: [
      'Tudo do plano Profissional',
      'A partir de 10 telas',
      'API de integração',
      'Customização de templates',
      'Gerente de conta dedicado',
      'SLA garantido',
    ],
    cta: 'Solicitar proposta',
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="precos" className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-800/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base/7 font-semibold text-pitanga-600 dark:text-pitanga-400">
            Planos e preços
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl dark:text-white">
            Investimento que se paga
          </p>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Escolha o plano ideal para o tamanho do seu negócio. Sem surpresas, sem taxas escondidas.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Valores para contrato anual. Hardware vendido separadamente.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={clsx(
                  'relative rounded-2xl p-8',
                  plan.highlighted
                    ? 'bg-gray-900 dark:bg-gray-950 ring-2 ring-pitanga-500'
                    : 'bg-white dark:bg-gray-900 ring-1 ring-gray-900/5 dark:ring-white/10'
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-pitanga-500 px-4 py-1 text-xs font-semibold text-white">
                      Mais popular
                    </span>
                  </div>
                )}

                <h3
                  className={clsx(
                    'text-lg font-semibold',
                    plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'
                  )}
                >
                  {plan.name}
                </h3>
                <p
                  className={clsx(
                    'mt-1 text-sm',
                    plan.highlighted ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {plan.description}
                </p>

                <div className="mt-6">
                  <span
                    className={clsx(
                      'text-4xl font-bold',
                      plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'
                    )}
                  >
                    {plan.price.startsWith('Sob') ? '' : 'R$ '}
                    {plan.price}
                  </span>
                  <span
                    className={clsx(
                      'text-sm',
                      plan.highlighted ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                    )}
                  >
                    {plan.period}
                  </span>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckIcon
                        className={clsx(
                          'h-5 w-5 shrink-0',
                          plan.highlighted ? 'text-pitanga-400' : 'text-pitanga-600 dark:text-pitanga-400'
                        )}
                      />
                      <span
                        className={clsx(
                          'text-sm',
                          plan.highlighted ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                        )}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contato"
                  className={clsx(
                    'mt-8 block w-full rounded-md px-4 py-3 text-center text-sm font-semibold transition-colors',
                    plan.highlighted
                      ? 'bg-pitanga-500 text-white hover:bg-pitanga-400'
                      : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                  )}
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Todos os planos incluem: ativação sem custo adicional e suporte técnico.
            <br />
            Consulte condições para contrato mensal e opções de hardware.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
