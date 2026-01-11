'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const faqs = [
  {
    question: 'E se a internet cair?',
    answer:
      'A TV continua exibindo normalmente. Todo o conteúdo fica armazenado no dispositivo. Quando a internet voltar, sincroniza automaticamente.',
  },
  {
    question: 'Preciso de técnico para instalar?',
    answer:
      'Não. É só conectar o dispositivo na entrada HDMI da TV e ligar na tomada. A configuração é feita pelo celular ou computador em minutos.',
  },
  {
    question: 'Funciona em várias lojas?',
    answer:
      'Sim. Você pode gerenciar todas as telas de todas as lojas em um único painel. Pode padronizar o conteúdo ou personalizar por loja.',
  },
  {
    question: 'Posso trocar o conteúdo do celular?',
    answer:
      'Sim. O painel funciona em qualquer navegador. Você pode atualizar promoções, preços e destaques de onde estiver.',
  },
  {
    question: 'Como é a instalação?',
    answer:
      'Enviamos o dispositivo pronto. Você conecta na TV, acessa o painel, escolhe o conteúdo e pronto. Leva menos de 10 minutos.',
  },
  {
    question: 'E se eu quiser cancelar?',
    answer:
      'Sem fidelidade longa. Você pode cancelar quando quiser. O dispositivo pode ser devolvido ou mantido, dependendo do plano escolhido.',
  },
  {
    question: 'E se a TV estiver longe do roteador?',
    answer:
      'O dispositivo conecta via Wi-Fi. Se o sinal não alcançar, você pode usar um repetidor de sinal ou conexão via cabo de rede.',
  },
  {
    question: 'Preciso de uma TV especial?',
    answer:
      'Não. Funciona em qualquer TV com entrada HDMI. Pode ser a TV que você já tem na loja.',
  },
  {
    question: 'Como faço para criar o conteúdo?',
    answer:
      'O painel tem templates prontos. Você só troca textos, preços e imagens. Não precisa de designer.',
  },
  {
    question: 'Quanto tempo leva para ativar?',
    answer:
      'Após a contratação, enviamos o dispositivo. A ativação completa leva em média 48 horas.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base/7 font-semibold text-pitanga-600 dark:text-pitanga-400">
            Dúvidas frequentes
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl dark:text-white">
            Tudo o que você precisa saber
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {faqs.map((faq, index) => (
              <div key={index} className="py-4">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-start justify-between text-left"
                >
                  <span className="text-base font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <span className="ml-6 flex h-7 items-center">
                    <ChevronDownIcon
                      className={clsx(
                        'h-5 w-5 text-gray-500 transition-transform duration-200',
                        openIndex === index && 'rotate-180'
                      )}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
