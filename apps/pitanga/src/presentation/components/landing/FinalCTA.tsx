'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../catalyst/button';
import { Input } from '../catalyst/input';
import { Select } from '../catalyst/select';
import { Field, Label } from '../catalyst/fieldset';

export function FinalCTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    screens: '1-2',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with API
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <section id="contato" className="py-24 sm:py-32 bg-gray-900 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Pronto para suas TVs venderem por você?
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Solicite uma proposta e receba um diagnóstico gratuito para sua loja.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-12 max-w-lg"
        >
          {submitted ? (
            <div className="rounded-2xl bg-green-500/10 p-8 text-center ring-1 ring-green-500/30">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">Recebemos sua solicitação!</h3>
              <p className="mt-2 text-gray-300">
                Nossa equipe entrará em contato em até 24 horas úteis.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field>
                  <Label className="text-gray-300">Nome *</Label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                  />
                </Field>
                <Field>
                  <Label className="text-gray-300">Empresa</Label>
                  <Input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Nome da empresa"
                  />
                </Field>
              </div>

              <Field>
                <Label className="text-gray-300">E-mail *</Label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                />
              </Field>

              <Field>
                <Label className="text-gray-300">Telefone/WhatsApp *</Label>
                <Input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </Field>

              <Field>
                <Label className="text-gray-300">Quantas telas você precisa?</Label>
                <Select
                  value={formData.screens}
                  onChange={(e) => setFormData({ ...formData, screens: e.target.value })}
                >
                  <option value="1-2">1-2 telas</option>
                  <option value="3-5">3-5 telas</option>
                  <option value="6-10">6-10 telas</option>
                  <option value="10+">Mais de 10 telas</option>
                </Select>
              </Field>

              <Button type="submit" color="pitanga" className="w-full">
                Solicitar proposta gratuita
              </Button>

              <p className="text-center text-xs text-gray-500">
                Sem compromisso. Respondemos em até 24h úteis.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
