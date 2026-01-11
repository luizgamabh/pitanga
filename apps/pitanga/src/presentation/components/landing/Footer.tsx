export function Footer() {
  return (
    <footer className="bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-4">
            <img
              src="/logo--dark.svg"
              alt="Pitanga"
              className="h-8 w-auto"
            />
          </div>

          <nav className="flex gap-6">
            <a
              href="#como-funciona"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Como funciona
            </a>
            <a
              href="#beneficios"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Benefícios
            </a>
            <a
              href="#precos"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Preços
            </a>
            <a
              href="#faq"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              FAQ
            </a>
          </nav>

          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Pitanga. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
