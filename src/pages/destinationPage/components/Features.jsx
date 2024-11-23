import React, { useState, useEffect } from "react";

const FeatureSection = ({
  title,
  description,
  imageSrc,
  isReversed,
  visibleElements,
  index,
}) => (
  <div
    className={`flex flex-col ${
      isReversed ? "md:flex-row-reverse" : "md:flex-row"
    } items-center gap-8 py-2`}
  >
    <div className="w-full md:w-1/2">
      <div
        className={`feature-element transform px-4 transition-all duration-700 md:px-8`}
        data-element={`text-${index}`}
        style={{
          transform: visibleElements.includes(`text-${index}`)
            ? "translateY(0)"
            : "translateY(100px)",
          opacity: visibleElements.includes(`text-${index}`) ? 1 : 0,
          transitionDelay: `${index * 0.2}s`,
        }}
      >
        <h3 className="mb-4 text-2xl font-bold text-gray-200">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
    <div
      className={`feature-element w-full transform transition-all duration-700 md:w-1/2`}
      data-element={`image-${index}`}
      style={{
        transform: visibleElements.includes(`image-${index}`)
          ? "translateY(0)"
          : "translateY(100px)",
        opacity: visibleElements.includes(`image-${index}`) ? 1 : 0,
        transitionDelay: `${index * 0.2 + 0.4}s`, // Add 0.2s delay after text
      }}
    >
      <img
        src={imageSrc}
        alt={title}
        className="h-auto max-h-[500px] w-full rounded-lg object-contain"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      />
    </div>
  </div>
);

const FeaturesShowcase = () => {
  const [visibleElements, setVisibleElements] = useState([]);
  const [isHeadlineVisible, setIsHeadlineVisible] = useState(false);

  const features = [
    {
      title: "Tutorial",
      description:
        "Aprende los conceptos básicos del Problema del Viajante de Comercio a través de una guía interactiva paso a paso. Comprende cómo funcionan las partes de TSP Explorer.",
      imageSrc: "/tutorial.png",
    },
    {
      title: "Países",
      description:
        "Explora diferentes escenarios del TSP basados en países reales. Visualiza cómo los algoritmos encuentran rutas óptimas entre ciudades y comprende el impacto de diferentes configuraciones geográficas.",
      imageSrc: "/countries.png",
    },
    {
      title: "Algoritmos",
      description:
        "Compara y contrasta diferentes enfoques algorítmicos para resolver el TSP. Observa en tiempo real cómo cada algoritmo aborda el problema y comprende sus ventajas y limitaciones.",
      imageSrc: "/algorithms.png",
    },
    {
      title: "Perfil",
      description:
        "Mantén un registro de tu progreso, guarda tus configuraciones favoritas y compara tu rendimiento en diferentes escenarios. Personaliza tu experiencia de aprendizaje.",
      imageSrc: "/profile.png",
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
              const elementId = element.getAttribute("data-element");
              if (elementId) {
                setVisibleElements((prev) => [
                  ...new Set([...prev, elementId]),
                ]);
              }
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
      const elements = document.querySelectorAll(".feature-element, .headline");
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="w-full py-16"
      style={{
        background: `linear-gradient(to bottom, rgba(19, 20, 26, 0.9) 0%, rgba(19, 20, 26, 0.95) 50%, #13141A 100%)`,
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div
          className={`headline mb-12 transform transition-all duration-1000 ${
            isHeadlineVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-20 opacity-0"
          }`}
        >
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
            Funcionalidades
          </h2>
        </div>
        <div className="space-y-16">
          {features.map((feature, index) => (
            <FeatureSection
              key={feature.title}
              title={feature.title}
              description={feature.description}
              imageSrc={feature.imageSrc}
              isReversed={index % 2 === 1}
              visibleElements={visibleElements}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesShowcase;
