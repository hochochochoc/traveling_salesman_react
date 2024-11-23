export const paragraphs = {
  Prims: [
    {
      id: 0,
      text: "Prim’s algorithm is a greedy method to find the minimum spanning tree (MST), useful for TSP estimates.",
    },
    {
      id: 1,
      text: "The algorithm starts by choosing a vertex and picking the smallest edge to an unvisited vertex.",
    },
    {
      id: 2,
      text: "After the first edge, it picks the smallest edge that connects to the MST without forming a cycle.",
    },
    {
      id: 3,
      text: "As it adds more vertices, it keeps choosing the smallest edge, ensuring no cycles are formed.",
    },
    {
      id: 4,
      text: "The MST grows as the algorithm scans and adds the shortest available edge to the tree.",
    },
    {
      id: 5,
      text: "Prim’s algorithm focuses on small edges to keep the overall weight low, helping with TSP bounds.",
    },
    {
      id: 6,
      text: "It continues until all vertices are included, carefully selecting edges to minimize total cost.",
    },
    {
      id: 7,
      text: "The total weight of the MST provides an estimate for the TSP lower bound, but it's not the optimal route.",
    },
    {
      id: 8,
      text: "Prim’s algorithm is useful for MSTs and TSP bounds, but further work is needed for the best tour.",
    },
  ],
  Kruskals: [
    {
      id: 0,
      text: "Kruskal’s algorithm is a greedy way to find the minimum spanning tree (MST), useful for TSP estimates.",
    },
    {
      id: 1,
      text: "It starts by sorting all edges by weight, choosing the smallest edge that doesn’t form a cycle.",
    },
    {
      id: 2,
      text: "The algorithm adds the next smallest edge, ensuring no cycles, and repeats until a tree forms.",
    },
    {
      id: 3,
      text: "If an edge would create a cycle, it’s skipped. The algorithm tracks connected components to prevent loops.",
    },
    {
      id: 4,
      text: "As edges are added, components merge, making sure the tree grows without unnecessary loops.",
    },
    {
      id: 5,
      text: "Kruskal’s method uses the sorted edge list, minimizing the tree’s weight without recalculating.",
    },
    {
      id: 6,
      text: "When all vertices connect, the MST is complete, giving an estimate for the TSP by summing the edge weights.",
    },
    {
      id: 7,
      text: "The MST provides a lower bound for TSP but not an optimal route. Further steps are needed for the full tour.",
    },
    {
      id: 8,
      text: "Kruskal’s algorithm is effective for the MST, offering a lower bound for TSP, but more is needed to solve it.",
    },
  ],
  Greedy: [
    {
      id: 0,
      text: "The greedy algorithm solves TSP by picking the shortest edges one by one, forming a loop.",
    },
    {
      id: 1,
      text: "It starts by selecting the shortest edge, which connects two points to begin the tour.",
    },
    {
      id: 2,
      text: "Next, it picks the shortest edge linking a new point to a visited one, avoiding small loops.",
    },
    {
      id: 3,
      text: "The process repeats, adding the smallest edge without forming invalid loops or sub-tours.",
    },
    {
      id: 4,
      text: "The algorithm ensures no point is revisited until all points are connected into one tour.",
    },
    {
      id: 5,
      text: "It chooses small edges but avoids closing loops too early, which could ruin the full tour.",
    },
    {
      id: 6,
      text: "As fewer points remain, it focuses on linking them without making incomplete sub-tours.",
    },
    {
      id: 7,
      text: "When only two points are left, the algorithm connects them to visited points and completes the tour.",
    },
    {
      id: 8,
      text: "Though fast, the greedy approach misses better routes, as it focuses only on short-term gains.",
    },
    {
      id: 9,
      text: "It’s quick and simple, but its focus on short edges often stops it from finding the best solution.",
    },
  ],
  Nearest: [
    {
      id: 0,
      text: "The nearest neighbor algorithm is a simple heuristic for solving the traveling salesman problem (TSP). ",
    },
    {
      id: 1,
      text: "The algorithm starts by selecting an arbitrary vertex as the starting point. ",
    },

    {
      id: 2,
      text: "It builds a solution by iteratively visiting the closest unvisited vertex.",
    },
    {
      id: 3,
      text: "The process continues, with each step involving selecting the nearest unvisited vertex.",
    },

    {
      id: 4,
      text: "This ensures that short edges are prioritized, keeping the path length minimal at each step.",
    },
    {
      id: 5,
      text: "While the nearest neighbor method is efficient, it often focuses too much on short-term gains.",
    },
    {
      id: 6,
      text: "Running the algorithm from different starting points can yield different results, with varying tour lengths.",
    },
    {
      id: 7,
      text: "When only one vertex remains, the algorithm completes the tour by returning to the starting point.",
    },
    {
      id: 8,
      text: "The nearest neighbor approach offers a quick and intuitive solution for the TSP.",
    },
    {
      id: 9,
      text: " While it’s not always optimal, it's useful in cases where speed is prioritized over accuracy.",
    },
  ],
  TwoOpt: [
    {
      id: 0,
      text: "The 2-Opt method is a simple algorithm that improves a TSP tour by removing crossings in the path.",
    },
    {
      id: 1,
      text: "It starts with a full tour, often built using a heuristic like nearest neighbor, and improves from there.",
    },
    {
      id: 2,
      text: "2-Opt swaps two edges in the tour, which removes crossings and can make the tour shorter.",
    },
    {
      id: 3,
      text: "After each swap, the new tour is checked. The process repeats until no better tour is found.",
    },
    {
      id: 4,
      text: "The algorithm stops when a full pass finds no shorter tour. The best tour is kept as the result.",
    },
    {
      id: 5,
      text: "It has a time complexity of O(n²), but works well when starting with a good initial solution.",
    },
    {
      id: 6,
      text: "2-Opt is simple but effective, quickly improving tours and working well for many TSP cases.",
    },
    {
      id: 7,
      text: "Though it improves tours, 2-Opt only finds local optima. Advanced methods may be needed for global optima.",
    },
    {
      id: 8,
      text: "It's popular in logistics and routing, valued for balancing simplicity with effectiveness.",
    },
    {
      id: 9,
      text: "2-Opt can be combined with methods like simulated annealing or genetic algorithms for better results.",
    },
  ],
  Christofides: [
    {
      id: 0,
      text: "Christofides' algorithm solves TSP by finding a tour within 1.5 times the optimal length.",
    },
    {
      id: 1,
      text: "It starts by creating a minimum spanning tree (MST), connecting all points with minimal edge weight.",
    },
    {
      id: 2,
      text: "Then, it finds vertices in the MST with odd degrees. These will be paired later to form an Eulerian graph.",
    },
    {
      id: 3,
      text: "Next, it adds edges to match all odd-degree vertices, creating pairs without forming any cycles.",
    },
    {
      id: 4,
      text: "Combining the MST and the matching forms an Eulerian graph, where all vertices have even degrees.",
    },
    {
      id: 5,
      text: "An Eulerian circuit is then traced, visiting every edge once without repeating any paths.",
    },
    {
      id: 6,
      text: "The Eulerian circuit is converted into a Hamiltonian circuit, visiting each point exactly once.",
    },
    {
      id: 7,
      text: "Shortcutting removes repeated visits while keeping the order. This gives the final TSP solution.",
    },
    {
      id: 8,
      text: "The result is a tour within 1.5 times the optimal length, balancing speed and accuracy.",
    },
    {
      id: 9,
      text: "Christofides' algorithm is practical for large problems, offering a good approximation for TSP.",
    },
  ],
};

export const paragraphs_es = {
  Prims: [
    {
      id: 0,
      text: "El algoritmo de Prim es un método voraz para encontrar el árbol de expansión mínima (MST), útil para estimaciones del TSP.",
    },
    {
      id: 1,
      text: "El algoritmo comienza eligiendo un vértice y seleccionando la arista más pequeña hacia un vértice no visitado.",
    },
    {
      id: 2,
      text: "Después de la primera arista, selecciona la arista más pequeña que se conecta al MST sin formar un ciclo.",
    },
    {
      id: 3,
      text: "A medida que agrega más vértices, sigue eligiendo la arista más pequeña, asegurando que no se formen ciclos.",
    },
    {
      id: 4,
      text: "El MST crece mientras el algoritmo escanea y agrega la arista más corta disponible al árbol.",
    },
    {
      id: 5,
      text: "El algoritmo de Prim se centra en aristas pequeñas para mantener bajo el peso total, ayudando con los límites del TSP.",
    },
    {
      id: 6,
      text: "Continúa hasta que se incluyen todos los vértices, seleccionando cuidadosamente las aristas para minimizar el costo total.",
    },
    {
      id: 7,
      text: "El peso total del MST proporciona una estimación para el límite inferior del TSP, pero no es la ruta óptima.",
    },
    {
      id: 8,
      text: "El algoritmo de Prim es útil para MSTs y límites del TSP, pero se necesita más trabajo para encontrar el mejor recorrido.",
    },
  ],
  Kruskals: [
    {
      id: 0,
      text: "El algoritmo de Kruskal es una forma voraz de encontrar el árbol de expansión mínima (MST), útil para estimaciones del TSP.",
    },
    {
      id: 1,
      text: "Comienza ordenando todas las aristas por peso, eligiendo la más pequeña que no forme un ciclo.",
    },
    {
      id: 2,
      text: "El algoritmo agrega la siguiente arista más pequeña, asegurando que no haya ciclos, y repite hasta formar un árbol.",
    },
    {
      id: 3,
      text: "Si una arista crearía un ciclo, se omite. El algoritmo rastrea componentes conectados para prevenir bucles.",
    },
    {
      id: 4,
      text: "A medida que se agregan aristas, los componentes se fusionan, asegurando que el árbol crezca sin bucles innecesarios.",
    },
    {
      id: 5,
      text: "El método de Kruskal usa la lista ordenada de aristas, minimizando el peso del árbol sin recalcular.",
    },
    {
      id: 6,
      text: "Cuando todos los vértices se conectan, el MST está completo, dando una estimación para el TSP sumando los pesos de las aristas.",
    },
    {
      id: 7,
      text: "El MST proporciona un límite inferior para TSP pero no una ruta óptima. Se necesitan más pasos para el recorrido completo.",
    },
    {
      id: 8,
      text: "El algoritmo de Kruskal es efectivo para el MST, ofreciendo un límite inferior para TSP, pero se necesita más para resolverlo.",
    },
  ],
  Greedy: [
    {
      id: 0,
      text: "El algoritmo voraz resuelve el TSP seleccionando las aristas más cortas una por una, formando un bucle.",
    },
    {
      id: 1,
      text: "Comienza seleccionando la arista más corta, que conecta dos puntos para iniciar el recorrido.",
    },
    {
      id: 2,
      text: "Luego, elige la arista más corta que une un nuevo punto con uno visitado, evitando bucles pequeños.",
    },
    {
      id: 3,
      text: "El proceso se repite, agregando la arista más pequeña sin formar bucles inválidos o sub-recorridos.",
    },
    {
      id: 4,
      text: "El algoritmo asegura que ningún punto sea revisitado hasta que todos los puntos estén conectados en un recorrido.",
    },
    {
      id: 5,
      text: "Elige aristas pequeñas pero evita cerrar bucles demasiado pronto, lo que podría arruinar el recorrido completo.",
    },
    {
      id: 6,
      text: "A medida que quedan menos puntos, se centra en enlazarlos sin hacer sub-recorridos incompletos.",
    },
    {
      id: 7,
      text: "Cuando solo quedan dos puntos, el algoritmo los conecta a puntos visitados y completa el recorrido.",
    },
    {
      id: 8,
      text: "Aunque es rápido, el enfoque voraz pierde mejores rutas, ya que se centra solo en ganancias a corto plazo.",
    },
    {
      id: 9,
      text: "Es rápido y simple, pero su enfoque en aristas cortas a menudo le impide encontrar la mejor solución.",
    },
  ],
  Nearest: [
    {
      id: 0,
      text: "El algoritmo del vecino más cercano es una heurística simple para resolver el problema del viajante (TSP).",
    },
    {
      id: 1,
      text: "El algoritmo comienza seleccionando un vértice arbitrario como punto de partida.",
    },
    {
      id: 2,
      text: "Construye una solución visitando iterativamente el vértice no visitado más cercano.",
    },
    {
      id: 3,
      text: "El proceso continúa, con cada paso involucrando la selección del vértice no visitado más cercano.",
    },
    {
      id: 4,
      text: "Esto asegura que se prioricen las aristas cortas, manteniendo mínima la longitud del camino en cada paso.",
    },
    {
      id: 5,
      text: "Si bien el método del vecino más cercano es eficiente, a menudo se centra demasiado en ganancias a corto plazo.",
    },
    {
      id: 6,
      text: "Ejecutar el algoritmo desde diferentes puntos de partida puede producir diferentes resultados, con longitudes de recorrido variables.",
    },
    {
      id: 7,
      text: "Cuando solo queda un vértice, el algoritmo completa el recorrido regresando al punto de partida.",
    },
    {
      id: 8,
      text: "El enfoque del vecino más cercano ofrece una solución rápida e intuitiva para el TSP.",
    },
    {
      id: 9,
      text: "Si bien no siempre es óptimo, es útil en casos donde se prioriza la velocidad sobre la precisión.",
    },
  ],
  TwoOpt: [
    {
      id: 0,
      text: "El método 2-Opt es un algoritmo simple que mejora un recorrido TSP eliminando cruces en el camino.",
    },
    {
      id: 1,
      text: "Comienza con un recorrido completo, a menudo construido usando una heurística como vecino más cercano, y mejora desde allí.",
    },
    {
      id: 2,
      text: "2-Opt intercambia dos aristas en el recorrido, lo que elimina cruces y puede hacer el recorrido más corto.",
    },
    {
      id: 3,
      text: "Después de cada intercambio, se verifica el nuevo recorrido. El proceso se repite hasta que no se encuentra un mejor recorrido.",
    },
    {
      id: 4,
      text: "El algoritmo se detiene cuando una pasada completa no encuentra un recorrido más corto. Se mantiene el mejor recorrido como resultado.",
    },
    {
      id: 5,
      text: "Tiene una complejidad temporal de O(n²), pero funciona bien cuando se comienza con una buena solución inicial.",
    },
    {
      id: 6,
      text: "2-Opt es simple pero efectivo, mejorando rápidamente los recorridos y funcionando bien para muchos casos de TSP.",
    },
    {
      id: 7,
      text: "Aunque mejora los recorridos, 2-Opt solo encuentra óptimos locales. Pueden necesitarse métodos avanzados para óptimos globales.",
    },
    {
      id: 8,
      text: "Es popular en logística y enrutamiento, valorado por equilibrar simplicidad con efectividad.",
    },
    {
      id: 9,
      text: "2-Opt puede combinarse con métodos como recocido simulado o algoritmos genéticos para mejores resultados.",
    },
  ],
  Christofides: [
    {
      id: 0,
      text: "El algoritmo de Christofides resuelve el TSP encontrando un recorrido dentro de 1.5 veces la longitud óptima.",
    },
    {
      id: 1,
      text: "Comienza creando un árbol de expansión mínima (MST), conectando todos los puntos con peso mínimo de arista.",
    },
    {
      id: 2,
      text: "Luego, encuentra vértices en el MST con grados impares. Estos se emparejarán más tarde para formar un grafo Euleriano.",
    },
    {
      id: 3,
      text: "Después, agrega aristas para emparejar todos los vértices de grado impar, creando pares sin formar ciclos.",
    },
    {
      id: 4,
      text: "Combinar el MST y el emparejamiento forma un grafo Euleriano, donde todos los vértices tienen grados pares.",
    },
    {
      id: 5,
      text: "Luego se traza un circuito Euleriano, visitando cada arista una vez sin repetir caminos.",
    },
    {
      id: 6,
      text: "El circuito Euleriano se convierte en un circuito Hamiltoniano, visitando cada punto exactamente una vez.",
    },
    {
      id: 7,
      text: "Los atajos eliminan visitas repetidas manteniendo el orden. Esto da la solución final del TSP.",
    },
    {
      id: 8,
      text: "El resultado es un recorrido dentro de 1.5 veces la longitud óptima, equilibrando velocidad y precisión.",
    },
    {
      id: 9,
      text: "El algoritmo de Christofides es práctico para problemas grandes, ofreciendo una buena aproximación para TSP.",
    },
  ],
};

export const paragraphs_ca = {
  Prims: [
    {
      id: 0,
      text: "L'algoritme de Prim és un mètode voraç per trobar l'arbre d'expansió mínima (MST), útil per a estimacions del TSP.",
    },
    {
      id: 1,
      text: "L'algoritme comença triant un vèrtex i seleccionant l'aresta més petita cap a un vèrtex no visitat.",
    },
    {
      id: 2,
      text: "Després de la primera aresta, selecciona l'aresta més petita que connecta amb el MST sense formar un cicle.",
    },
    {
      id: 3,
      text: "A mesura que afegeix més vèrtexs, continua triant l'aresta més petita, assegurant que no es formin cicles.",
    },
    {
      id: 4,
      text: "El MST creix mentre l'algoritme escaneja i afegeix l'aresta més curta disponible a l'arbre.",
    },
    {
      id: 5,
      text: "L'algoritme de Prim se centra en arestes petites per mantenir el pes total baix, ajudant amb els límits del TSP.",
    },
    {
      id: 6,
      text: "Continua fins que s'inclouen tots els vèrtexs, seleccionant acuradament les arestes per minimitzar el cost total.",
    },
    {
      id: 7,
      text: "El pes total del MST proporciona una estimació per al límit inferior del TSP, però no és la ruta òptima.",
    },
    {
      id: 8,
      text: "L'algoritme de Prim és útil per a MSTs i límits del TSP, però cal més treball per trobar la millor ruta.",
    },
  ],
  Kruskals: [
    {
      id: 0,
      text: "L'algoritme de Kruskal és una manera voraç de trobar l'arbre d'expansió mínima (MST), útil per a estimacions del TSP.",
    },
    {
      id: 1,
      text: "Comença ordenant totes les arestes per pes, triant l'aresta més petita que no formi un cicle.",
    },
    {
      id: 2,
      text: "L'algoritme afegeix la següent aresta més petita, assegurant que no hi hagi cicles, i repeteix fins que es forma un arbre.",
    },
    {
      id: 3,
      text: "Si una aresta crearia un cicle, es salta. L'algoritme segueix els components connectats per evitar bucles.",
    },
    {
      id: 4,
      text: "A mesura que s'afegeixen arestes, els components es fusionen, assegurant que l'arbre creix sense bucles innecessaris.",
    },
    {
      id: 5,
      text: "El mètode de Kruskal utilitza la llista d'arestes ordenada, minimitzant el pes de l'arbre sense recalcular.",
    },
    {
      id: 6,
      text: "Quan tots els vèrtexs es connecten, el MST està complet, donant una estimació per al TSP sumant els pesos de les arestes.",
    },
    {
      id: 7,
      text: "El MST proporciona un límit inferior per al TSP però no una ruta òptima. Calen més passos per al recorregut complet.",
    },
    {
      id: 8,
      text: "L'algoritme de Kruskal és efectiu per al MST, oferint un límit inferior per al TSP, però cal més per resoldre'l.",
    },
  ],
  Greedy: [
    {
      id: 0,
      text: "L'heurística golafre resol el TSP seleccionant les arestes més curtes una per una, formant un bucle.",
    },
    {
      id: 1,
      text: "Comença seleccionant l'aresta més curta, que connecta dos punts per iniciar el recorregut.",
    },
    {
      id: 2,
      text: "Després, tria l'aresta més curta que enllaça un nou punt amb un de visitat, evitant bucles petits.",
    },
    {
      id: 3,
      text: "El procés es repeteix, afegint l'aresta més petita sense formar bucles invàlids o sub-recorreguts.",
    },
    {
      id: 4,
      text: "L'algoritme assegura que cap punt es revisita fins que tots els punts estiguin connectats en un sol recorregut.",
    },
    {
      id: 5,
      text: "Tria arestes petites però evita tancar bucles massa aviat, cosa que podria arruïnar el recorregut complet.",
    },
    {
      id: 6,
      text: "A mesura que queden menys punts, se centra en enllaçar-los sense fer sub-recorreguts incomplets.",
    },
    {
      id: 7,
      text: "Quan només queden dos punts, l'algoritme els connecta amb punts visitats i completa el recorregut.",
    },
    {
      id: 8,
      text: "Tot i ser ràpid, l'enfocament voraç perd millors rutes, ja que se centra només en guanys a curt termini.",
    },
    {
      id: 9,
      text: "És ràpid i simple, però el seu focus en arestes curtes sovint l'impedeix trobar la millor solució.",
    },
  ],
  Nearest: [
    {
      id: 0,
      text: "L'algoritme del veí més proper és una heurística simple per resoldre el problema del viatjant de comerç (TSP).",
    },
    {
      id: 1,
      text: "L'algoritme comença seleccionant un vèrtex arbitrari com a punt de partida.",
    },
    {
      id: 2,
      text: "Construeix una solució visitant iterativament el vèrtex no visitat més proper.",
    },
    {
      id: 3,
      text: "El procés continua, amb cada pas implicant seleccionar el vèrtex no visitat més proper.",
    },
    {
      id: 4,
      text: "Això assegura que es prioritzin les arestes curtes, mantenint la longitud del camí mínima en cada pas.",
    },
    {
      id: 5,
      text: "Tot i que el mètode del veí més proper és eficient, sovint se centra massa en guanys a curt termini.",
    },
    {
      id: 6,
      text: "Executar l'algoritme des de diferents punts de partida pot produir resultats diferents, amb longituds de recorregut variables.",
    },
    {
      id: 7,
      text: "Quan només queda un vèrtex, l'algoritme completa el recorregut tornant al punt de partida.",
    },
    {
      id: 8,
      text: "L'enfocament del veí més proper ofereix una solució ràpida i intuïtiva per al TSP.",
    },
    {
      id: 9,
      text: "Tot i que no sempre és òptim, és útil en casos on la velocitat es prioritza sobre la precisió.",
    },
  ],
  TwoOpt: [
    {
      id: 0,
      text: "El mètode 2-Opt és un algoritme simple que millora un recorregut TSP eliminant encreuaments en el camí.",
    },
    {
      id: 1,
      text: "Comença amb un recorregut complet, sovint construït utilitzant una heurística com el veí més proper, i millora a partir d'aquí.",
    },
    {
      id: 2,
      text: "2-Opt intercanvia dues arestes en el recorregut, eliminant encreuaments i podent fer el recorregut més curt.",
    },
    {
      id: 3,
      text: "Després de cada intercanvi, es comprova el nou recorregut. El procés es repeteix fins que no es troba cap millor recorregut.",
    },
    {
      id: 4,
      text: "L'algoritme s'atura quan una passada completa no troba cap recorregut més curt. Es manté el millor recorregut com a resultat.",
    },
    {
      id: 5,
      text: "Té una complexitat temporal de O(n²), però funciona bé quan es comença amb una bona solució inicial.",
    },
    {
      id: 6,
      text: "2-Opt és simple però efectiu, millorant ràpidament els recorreguts i funcionant bé per a molts casos de TSP.",
    },
    {
      id: 7,
      text: "Tot i que millora els recorreguts, 2-Opt només troba òptims locals. Poden ser necessaris mètodes avançats per a òptims globals.",
    },
    {
      id: 8,
      text: "És popular en logística i rutes, valorat per equilibrar simplicitat amb efectivitat.",
    },
    {
      id: 9,
      text: "2-Opt es pot combinar amb mètodes com el recuit simulat o algoritmes genètics per obtenir millors resultats.",
    },
  ],
  Christofides: [
    {
      id: 0,
      text: "L'algoritme de Christofides resol el TSP trobant un recorregut dins d'1,5 vegades la longitud òptima.",
    },
    {
      id: 1,
      text: "Comença creant un arbre d'expansió mínima (MST), connectant tots els punts amb pes d'aresta mínim.",
    },
    {
      id: 2,
      text: "Després, troba vèrtexs en el MST amb graus senars. Aquests s'aparellaran més tard per formar un graf eulerià.",
    },
    {
      id: 3,
      text: "A continuació, afegeix arestes per aparellar tots els vèrtexs de grau senar, creant parelles sense formar cicles.",
    },
    {
      id: 4,
      text: "Combinar el MST i l'aparellament forma un graf eulerià, on tots els vèrtexs tenen graus parells.",
    },
    {
      id: 5,
      text: "Es traça llavors un circuit eulerià, visitant cada aresta una vegada sense repetir camins.",
    },
    {
      id: 6,
      text: "El circuit eulerià es converteix en un circuit hamiltonià, visitant cada punt exactament una vegada.",
    },
    {
      id: 7,
      text: "Les dreceres eliminen visites repetides mantenint l'ordre. Això dóna la solució final del TSP.",
    },
    {
      id: 8,
      text: "El resultat és un recorregut dins d'1,5 vegades la longitud òptima, equilibrant velocitat i precisió.",
    },
    {
      id: 9,
      text: "L'algoritme de Christofides és pràctic per a problemes grans, oferint una bona aproximació per al TSP.",
    },
  ],
};
