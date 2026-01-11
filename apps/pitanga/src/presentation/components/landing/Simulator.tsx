'use client';

import { useState } from 'react';
import { motion } from 'motion/react';

export function Simulator() {
  const [visitors, setVisitors] = useState(100);
  const [ticketAverage, setTicketAverage] = useState(50);
  const [impulseRate, setImpulseRate] = useState(20);
  const [daysPerWeek, setDaysPerWeek] = useState(6);
  const [showResult, setShowResult] = useState(false);

  const calculatePotential = () => {
    // Conservative estimate: 1-3% improvement in impulse decisions
    const monthlyVisitors = visitors * daysPerWeek * 4;
    const impulseVisitors = monthlyVisitors * (impulseRate / 100);
    const conservativeImprovement = 0.02; // 2% improvement
    const additionalSales = impulseVisitors * conservativeImprovement * ticketAverage;

    return {
      low: Math.round(additionalSales * 0.5),
      high: Math.round(additionalSales * 1.5),
    };
  };

  const potential = calculatePotential();

  return (
    <section id="simulador" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base/7 font-semibold text-pitanga-600 dark:text-pitanga-400">
            Simulador
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl dark:text-white">
            Quanto você pode estar deixando na mesa?
          </p>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Descubra o potencial de vendas que uma comunicação visual eficiente pode gerar.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-12 max-w-xl"
        >
          <div className="rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
            <div className="space-y-6">
              {/* Visitors per day */}
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-900 dark:text-white">
                  <span>Pessoas por dia na loja</span>
                  <span className="text-pitanga-600 dark:text-pitanga-400">{visitors}</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={visitors}
                  onChange={(e) => setVisitors(Number(e.target.value))}
                  className="mt-2 w-full accent-pitanga-500"
                />
              </div>

              {/* Average ticket */}
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-900 dark:text-white">
                  <span>Ticket médio (R$)</span>
                  <span className="text-pitanga-600 dark:text-pitanga-400">R$ {ticketAverage}</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={ticketAverage}
                  onChange={(e) => setTicketAverage(Number(e.target.value))}
                  className="mt-2 w-full accent-pitanga-500"
                />
              </div>

              {/* Impulse rate */}
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-900 dark:text-white">
                  <span>% que decide na hora</span>
                  <span className="text-pitanga-600 dark:text-pitanga-400">{impulseRate}%</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="5"
                  value={impulseRate}
                  onChange={(e) => setImpulseRate(Number(e.target.value))}
                  className="mt-2 w-full accent-pitanga-500"
                />
              </div>

              {/* Days per week */}
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-900 dark:text-white">
                  <span>Dias de funcionamento/semana</span>
                  <span className="text-pitanga-600 dark:text-pitanga-400">{daysPerWeek}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                  className="mt-2 w-full accent-pitanga-500"
                />
              </div>

              {/* Calculate button */}
              <button
                onClick={() => setShowResult(true)}
                className="w-full rounded-md bg-pitanga-500 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-pitanga-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitanga-500 transition-colors"
              >
                Calcular potencial
              </button>

              {/* Result */}
              <motion.div
                initial={false}
                animate={{
                  height: showResult ? 'auto' : 0,
                  opacity: showResult ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl bg-pitanga-50 dark:bg-pitanga-900/20 p-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Potencial mensal de vendas adicionais:
                  </p>
                  <p className="mt-2 text-3xl font-bold text-pitanga-600 dark:text-pitanga-400">
                    R$ {potential.low.toLocaleString('pt-BR')} - R$ {potential.high.toLocaleString('pt-BR')}
                  </p>
                  <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                    * Estimativa conservadora baseada em melhoria de 1-3% nas decisões de compra por impulso.
                    Resultados podem variar conforme o segmento e execução.
                  </p>
                  <a
                    href="#contato"
                    className="mt-4 inline-block text-sm font-semibold text-pitanga-600 dark:text-pitanga-400 hover:text-pitanga-500"
                  >
                    Quero capturar esse potencial →
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
