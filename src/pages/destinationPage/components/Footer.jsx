import React from "react";

const Footer = () => {
  return (
    <footer className="w-full">
      <div
        className="w-full py-12"
        style={{
          background: `linear-gradient(to bottom, #13141A 80%, rgba(19, 20, 26, 0.95) 90%, rgba(19, 20, 26, 0.9) 100%)`,
        }}
      >
        <div className="mx-auto max-w-6xl px-4">
          {/* Top section with logo and description */}
          <div className="mb-8 flex flex-col items-center md:flex-row md:justify-between">
            <div className="mb-8 md:mb-0 md:w-1/3">
              <h3 className="mb-4 text-2xl font-bold text-white">
                TSP Explorer
              </h3>
              <p className="text-gray-400">
                Visualizando algoritmos para el Problema del Viajante a través
                de experiencias interactivas de aprendizaje
              </p>
            </div>

            {/* Navigation links */}
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h4 className="mb-4 text-sm font-semibold uppercase text-gray-400">
                  Recursos
                </h4>
                <ul className="space-y-1.5">
                  <li>
                    <a
                      href="/tutorial"
                      className="text-gray-300 hover:text-white"
                    >
                      Tutorial
                    </a>
                  </li>
                  <li>
                    <a href="/docs" className="text-gray-300 hover:text-white">
                      Preguntas Frequentes
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 text-sm font-semibold uppercase text-gray-400">
                  Desarollador
                </h4>
                <ul className="space-y-1.5">
                  <li>
                    <a href="/about" className="text-gray-300 hover:text-white">
                      Sobre Mí
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="text-gray-300 hover:text-white"
                    >
                      Contacto
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 text-sm font-semibold uppercase text-gray-400">
                  Legal
                </h4>
                <ul className="space-y-1.5">
                  <li>
                    <a href="/menu" className="text-gray-300 hover:text-white">
                      Política de Privacidad
                    </a>
                  </li>
                  <li>
                    <a href="/menu" className="text-gray-300 hover:text-white">
                      Términos y condiciones
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom section with copyright */}
          <div className="mt-8 border-t border-gray-800 pt-8">
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              <div className="text-sm text-gray-400">
                © {new Date().getFullYear()} TSP Explorer. All rights reserved.
              </div>
              {/* Social links */}
              <div className="flex space-x-6">
                <a
                  href="https://github.com/hochochochoc/traveling_salesman_react"
                  className="text-gray-400 hover:text-white"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/jannik-riegel/"
                  className="text-gray-400 hover:text-white"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
