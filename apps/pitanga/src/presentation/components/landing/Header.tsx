'use client';

import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Como funciona', href: '#como-funciona' },
  { name: 'Benefícios', href: '#beneficios' },
  { name: 'Segmentos', href: '#segmentos' },
  { name: 'Preços', href: '#precos' },
  { name: 'FAQ', href: '#faq' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Pitanga Digital Signage</span>
            <img
              alt="Pitanga"
              src="/logo.svg"
              className="h-10 w-auto dark:hidden"
            />
            <img
              alt="Pitanga"
              src="/logo--dark.svg"
              className="h-10 w-auto hidden dark:block"
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
          >
            <span className="sr-only">Abrir menu</span>
            <Bars3Icon className="size-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm/6 font-semibold text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a
            href="#contato"
            className="rounded-md bg-pitanga-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pitanga-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitanga-500 transition-colors"
          >
            Solicitar proposta
          </a>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-white/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Pitanga Digital Signage</span>
              <img
                alt="Pitanga"
                src="/logo.svg"
                className="h-10 w-auto dark:hidden"
              />
              <img
                alt="Pitanga"
                src="/logo--dark.svg"
                className="h-10 w-auto hidden dark:block"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
            >
              <span className="sr-only">Fechar menu</span>
              <XMarkIcon className="size-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-500/25">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="#contato"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-pitanga-600 hover:bg-gray-50 dark:text-pitanga-400 dark:hover:bg-gray-800"
                >
                  Solicitar proposta
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
