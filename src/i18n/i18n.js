import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        VISUALIZINGOPTIMIZATION: "VISUALIZING OPTIMIZATION",
        Chooseacountry: "Choose a country",
        Selectacountry: "Select a country to try out the algorithms.",
        search_country: "Search for a country...",
        welcome_message_1:
          "Welcome to TSP Explorer, where we bring the Traveling Salesman Problem to life through interactive demos, visual maps, and algorithm codes. Explore optimization solutions and learn at your own pace.",
        welcome_message_2:
          "Try your hand at solving the problem, discover new algorithms, and deepen your understanding of route optimization in a fun, visual way.",
        About: "About",
        Contact: "Contact",
        Log_in: "Log in",
        Log_out: "Log out",
        User: "User",
        how_it_works: "How it works",
        demos_text:
          "Understand the logic behind the algorithms for solving the TSP and their validation.",
        Back: "Previous Step",
        connect_the_cities:
          "Connect the cities to create a circular route! Try zooming in for groups of closer cities.",
        try_it_yourself: "Try it yourself",
        jump_in: "Jump in!",
        sign_up: "Sign up",
        countries: "Countries",
        algorithms: "Algorithms",
        profile: "Profile",
        choose_algorithm: "Choose algorithm",
        step_1: "Step 1: Choose number of cities",
        step_2: "Step 2: Choose a method",
        step_3_diy: "Step 3: Connect the cities",
        step_3_algorithm: "Step 3: Choose an algorithm",
      },
    },
    es: {
      translation: {
        VISUALIZINGOPTIMIZATION: "OPTIMIZACIÓN",
        Chooseacountry: "Elige un país",
        Selectacountry: "Selecciona un país para probar los algoritmos.",
        search_country: "Busca un país...",
        welcome_message_1:
          "Bienvenido a TSP Explorer, donde damos vida al Problema del Viajante mediante demostraciones interactivas, mapas visuales y códigos de algoritmos. Explora soluciones de optimización y aprende a tu propio ritmo.",
        welcome_message_2:
          "Ponte a prueba resolviendo el problema, descubre nuevos algoritmos y profundiza en tu comprensión de la optimización de rutas de forma divertida y visual.",
        About: "Sobre",
        Contact: "Contacto",
        Log_in: "Iniciar sesión",
        Log_out: "Cerrar sesión",
        User: "Usuario",
        how_it_works: "Cómo funciona",
        demos_text:
          "Entiende la lógica detrás de los algoritmos para resolver el TSP y su validación.",
        Back: "Paso Anterior",
        connect_the_cities:
          "Conecta las ciudades para crear una ruta circular. Prueba acercar el zoom para ver grupos de ciudades más cercanas.",
        try_it_yourself: "Inténtalo tú mismo",
        jump_in: "¡Entra y explora!",
        sign_up: "Regístrate",
        countries: "Países",
        algorithms: "Algoritmos",
        profile: "Perfil",
        choose_algorithm: "Elige un algoritmo",
        step_1: "Paso 1: Elige el número de ciudades",
        step_2: "Paso 2: Elige un método",
        step_3_diy: "Paso 3: Conecta las ciudades",
        step_3_algorithm: "Paso 3: Elige un algoritmo",
      },
    },
    ca: {
      translation: {
        VISUALIZINGOPTIMIZATION: "OPTIMIZACIÓ",
        Chooseacountry: " tria un país",
        Selectacountry: "Selecciona un país per provar els algorismes.",
        search_country: "Busca un país...",
        welcome_message_1:
          "Benvingut a TSP Explorer, on el Problema del Viatjant pren vida amb demostracions interactives, mapes visuals i codis d'algorismes. Descobreix solucions d'optimització i aprèn al teu propi ritme.",
        welcome_message_2:
          "Posa't a prova resolent el problema, descobreix nous algorismes i aprofundeix en la teva comprensió de l'optimització de rutes de manera divertida i visual.",
        About: "Sobre",
        Contact: "Contacte",
        Log_in: "Iniciar sessió",
        Log_out: "Tancar sesió",
        User: "Usuari",
        how_it_works: "Com funciona",
        demos_text:
          "Entén la lògica darrere dels algorismes per resoldre el TSP i la seva validació.",
        Back: "Pas Anterior",
        connect_the_cities:
          "Connecta les ciutats per crear una ruta circular! Prova a fer zoom per veure grups de ciutats més properes.",
        try_it_yourself: "Prova-ho tu mateix",
        jump_in: "Entra i explora!",
        sign_up: "registra't",
        countries: "Països",
        algorithms: "Algorismes",
        profile: "Perfil",
        choose_algorithm: "Tria un algorisme",
        step_1: "Pas 1: Tria el nombre de ciutats",
        step_2: "Pas 2: Tria un mètode",
        step_3_diy: "Pas 3: Connecta les ciutats",
        step_3_algorithm: "Pas 3: Tria un algorisme",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
