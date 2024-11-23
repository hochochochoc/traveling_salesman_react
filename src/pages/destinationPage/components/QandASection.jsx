import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const QASection = () => {
  const [visibleRows, setVisibleRows] = useState([]);
  const [openQuestions, setOpenQuestions] = useState({});
  const [isHeadlineVisible, setIsHeadlineVisible] = useState(false);

  // Split items into two columns
  const leftColumnItems = [
    {
      question: "¿Qué es el TSP?",
      answer:
        "El Problema del Viajante (TSP, del inglés 'Traveling Salesman Problem') es un problema clásico de optimización que busca encontrar la ruta más corta que conecta varios puntos, visitando cada punto exactamente una vez y regresando al punto de inicio.",
    },
    {
      question: "¿Para quién es?",
      answer:
        "Esta plataforma está diseñada para estudiantes y personas interesadas en explorar y comprender el Problema del Viajante (TSP) mediante visualización interactiva.",
    },
  ];

  const rightColumnItems = [
    {
      question: "¿Cómo puedo empezar?",
      answer:
        "Puedes comenzar eligiendo un país para crear una ruta, o explorar las explicaciones detalladas de los algoritmos.",
    },
    {
      question: "¿Dónde se utiliza el TSP?",
      answer:
        "El TSP se aplica en múltiples campos como la logística, planificación de rutas, diseño de circuitos electrónicos, secuenciación de ADN y optimización de procesos industriales, entre otros.",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            if (element.classList.contains("headline")) {
              setIsHeadlineVisible(true);
            } else {
              const rowIndex = element.getAttribute("data-row");
              setVisibleRows((prev) => [
                ...new Set([...prev, parseInt(rowIndex)]),
              ]);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    );

    setTimeout(() => {
      const elements = document.querySelectorAll(".qa-row, .headline");
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, []);

  const toggleQuestion = (index) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="relative">
      <div className="overflow-hidden bg-egg">
        <div className="px-4 md:px-8 md:py-8">
          <div
            className={`headline mb-8 transform transition-all duration-1000 ${
              isHeadlineVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
              Preguntas Más Frecuentes
            </h2>
            <p className="mt-2 text-center text-lg text-gray-300">
              Todo lo que necesitas saber sobre nuestra plataforma de
              visualización
            </p>
          </div>

          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col space-y-4">
                {leftColumnItems.map((item, index) => (
                  <div
                    key={`left-${index}`}
                    className={`qa-row transform transition-all duration-700`}
                    data-row={index}
                  >
                    <div
                      className={`transform transition-all duration-700 ${
                        visibleRows.includes(index)
                          ? "translate-y-0 opacity-100"
                          : "translate-y-32 opacity-0"
                      }`}
                      style={{
                        transitionDelay: `${index * 0.2}s`,
                      }}
                    >
                      <div className="rounded-lg border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm transition-colors hover:border-blue-500/30">
                        <button
                          onClick={() => toggleQuestion(`left-${index}`)}
                          className="flex w-full items-center justify-between p-4 text-left"
                        >
                          <h3 className="pr-4 text-lg font-bold text-white">
                            {item.question}
                          </h3>
                          {openQuestions[`left-${index}`] ? (
                            <ChevronUp className="text-white" />
                          ) : (
                            <ChevronDown className="text-white" />
                          )}
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-500 ${
                            openQuestions[`left-${index}`]
                              ? "max-h-48"
                              : "max-h-0"
                          }`}
                        >
                          <p className="px-4 pb-4 text-gray-300">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col space-y-4">
                {rightColumnItems.map((item, index) => (
                  <div
                    key={`right-${index}`}
                    className={`qa-row transform transition-all duration-700`}
                    data-row={index + leftColumnItems.length}
                  >
                    <div
                      className={`transform transition-all duration-700 ${
                        visibleRows.includes(index + leftColumnItems.length)
                          ? "translate-y-0 opacity-100"
                          : "translate-y-32 opacity-0"
                      }`}
                      style={{
                        transitionDelay: `${(index + leftColumnItems.length) * 0.2}s`,
                      }}
                    >
                      <div className="rounded-lg border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm transition-colors hover:border-blue-500/30">
                        <button
                          onClick={() => toggleQuestion(`right-${index}`)}
                          className="flex w-full items-center justify-between p-4 text-left"
                        >
                          <h3 className="pr-4 text-lg font-bold text-white">
                            {item.question}
                          </h3>
                          {openQuestions[`right-${index}`] ? (
                            <ChevronUp className="text-white" />
                          ) : (
                            <ChevronDown className="text-white" />
                          )}
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-500 ${
                            openQuestions[`right-${index}`]
                              ? "max-h-48"
                              : "max-h-0"
                          }`}
                        >
                          <p className="px-4 pb-4 text-gray-300">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QASection;
