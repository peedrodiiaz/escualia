export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1D4ED8] flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-white font-bold text-lg">Escualia</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Política de privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos de uso</a>
            <a href="mailto:hola@escualia.es" className="hover:text-white transition-colors">hola@escualia.es</a>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Escualia. El software que entiende tu autoescuela.</p>
        </div>
      </div>
    </footer>
  );
}
