'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const faqs = [
  {
    question: 'Que tipo de dispositivo eu preciso?',
    answer:
      'Nós oferecemos painéis de led, para diferentes tipos de ambientes e com tamanhos variados. Mas também conseguimos integrar nossa funcionalidade em seu próprio equipamento de TV, qualquer que seja a marca, através de nosso Dongle.',
  },
  {
    question: 'Vale mais a pena comprar ou alugar?',
    answer:
      'Depende da sua necessidade. A compra oferece independência e maior controle a longo prazo, mas requer investimento inicial maior e manutenção. Já o aluguel inclui suporte técnico contínuo e pode ser mais vantajoso para eventos ou campanhas sazonais.',
  },
  {
    question: 'E se a internet cair?',
    answer:
      'A TV ou o painel continuam exibindo normalmente. Todo o conteúdo fica armazenado no dispositivo. Quando a internet voltar, sincroniza automaticamente.',
  },
  {
    question: 'Os painéis podem ser usados em ambientes internos e externos?',
    answer:
      'Sim, os painéis são versáteis e podem ser instalados tanto em ambientes internos quanto externos. Eles oferecem excelente qualidade de imagem em ambos os casos, sendo resistentes às condições climáticas no exterior, como sol e chuva.',
  },
  {
    question: 'Os painéis consomem muita energia?',
    answer:
      'Não, uma das grandes vantagens dos painéis de LED é a eficiência energética. Eles consomem muito menos energia que outros tipos de displays ou iluminação tradicional, o que reduz significativamente os custos operacionais.',
  },
  {
    question: 'Preciso de técnico para instalar?',
    answer:
      'Não. Os painéis já vêm pré-configurados, basta ligar na tomada e gerenciar pelo app. No caso do dongle, é só conectar o dispositivo na entrada HDMI da TV e ligar na tomada, ao acessar a entrada, o passo a passo para conexão é super intuitivo. A configuração é feita pelo celular ou computador em minutos. Mas, se preferir, fazemos a instalação sem nenhum custo adicional.',
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
    question: 'Os equipamentos precisam de muita manutenção?',
    answer:
      'Não, painéis de LED são duráveis e exigem pouca manutenção. No entanto, é importante realizar manutenções preventivas para garantir o máximo desempenho, como a limpeza regular e verificação do sistema elétrico.',
  },
  {
    question: 'Qual é a durabilidade dos painéis?',
    answer:
      'Painéis de LED têm uma longa vida útil, podendo durar até 50.000 horas de uso contínuo. Isso os torna uma solução altamente durável e confiável, com desgaste mínimo ao longo do tempo.',
  },
  {
    question: 'Os painéis de LED são adequados para eventos ao ar livre?',
    answer:
      'Sim, painéis de LED são ideais para eventos externos, devido ao brilho e à visibilidade, mesmo sob luz solar intensa. Eles são construídos para resistir a condições climáticas adversas, como chuva e vento.',
  },
  {
    question: 'O painel de LED esquenta muito?',
    answer:
      'Embora toda tecnologia gere calor, os painéis de LED emitem muito menos calor do que outros tipos de iluminação. O calor gerado é mínimo e não prejudica o ambiente ou outros equipamentos.',
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
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="flex w-full items-start justify-between text-left"
                >
                  <span className="text-base font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <span className="ml-6 flex h-7 items-center">
                    <ChevronDownIcon
                      className={clsx(
                        'h-5 w-5 text-gray-500 transition-transform duration-200',
                        openIndex === index && 'rotate-180',
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
