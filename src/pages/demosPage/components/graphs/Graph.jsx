import React, { useState, useEffect, useRef, useContext } from "react";
import * as d3 from "d3";
import { Play, Pause, Square } from "lucide-react";
import { DemosContext } from "../../context/GraphContext";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { RotateCcw } from "lucide-react";
import {
  paragraphs,
  paragraphs_es,
  paragraphs_ca,
} from "../../data/paragraphs";
import { initialGraphData } from "../../data/graphData";
import { useTranslation } from "react-i18next";

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload(); // Forces a full reload
  });
}

// Simulated graph data
// Function to calculate distance between two points
const distance = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

const Graph = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 450);
  const {
    primsMST,
    kruskalsMST,
    nearestNeighborTSP,
    christofidesTSP,
    twoOptTSP,
    cheapestInsertionTSP,
    validationSelection,
    algorithmSelection,
    activeSection,
  } = useContext(DemosContext);

  const [graphData, setGraphData] = useState([...initialGraphData]);
  const [currentStep, setCurrentStep] = useState(0);
  const svgRef = useRef(null);
  const [treeEdges, setTreeEdges] = useState([]);
  const timerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [edges, setEdges] = useState([]);
  const [stepsIsOpen, setStepsIsOpen] = useState(false);
  const popoverRef = useRef(null);
  const [direction, setDirection] = useState("left");
  const [totalLength, setTotalLength] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);
  const [potentialEdges, setPotentialEdges] = useState([]);
  const [allPotentialEdges, setAllPotentialEdges] = useState([]);
  const { t, i18n } = useTranslation();

  // Update potential edges only when new edges are added
  useEffect(() => {
    if (currentStep < edges.length) {
      setAllPotentialEdges((prev) => [...prev, ...potentialEdges]);
    }
  }, [currentStep, edges, potentialEdges]);

  // calculate total length
  useEffect(() => {
    // Calculate total length based on current step
    const newTotalLength = treeEdges.reduce((sum, edge) => {
      const fromNode = graphData[edge[0]];
      const toNode = graphData[edge[1]];
      return sum + distance(fromNode, toNode);
    }, 0);

    setTotalLength(newTotalLength);
  }, [currentStep, treeEdges, graphData]);

  // Update isMobile state based on window size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 450);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    resetVisualization();
  }, [validationSelection, algorithmSelection]);

  let vertexRadius = isMobile ? 7 : 5;
  let graphFontSize = isMobile ? "16px" : "12px";
  let edgeSize = isMobile ? 5 : 3;
  let offset = isMobile ? 25 : 15;

  // Calculate MST edges
  useEffect(() => {
    if (activeSection === "algorithms") {
      // console.log("active section algorithm correctly detected");
      if (algorithmSelection === "Nearest") {
        const {
          edges: mstEdges,
          potentialEdges: nextEdges,
          executionTime,
        } = nearestNeighborTSP(graphData);
        setEdges(mstEdges);
        setPotentialEdges(nextEdges); // Set potential edges
        setExecutionTime(executionTime);
      }
      if (algorithmSelection === "Greedy") {
        const { edges: mstEdges, executionTime } =
          cheapestInsertionTSP(graphData);
        setEdges(mstEdges);
        setExecutionTime(executionTime);
      }
      if (algorithmSelection === "Christofides") {
        const { edges: mstEdges, executionTime } = christofidesTSP(graphData);
        setEdges(mstEdges);
        setExecutionTime(executionTime);
      }
      if (algorithmSelection === "TwoOpt") {
        const { edges: mstEdges, executionTime } = twoOptTSP(graphData);
        setEdges(mstEdges);
        setExecutionTime(executionTime);
      }
    }

    if (activeSection === "validation") {
      if (validationSelection === "Prims") {
        const { mst: mstEdges, executionTime } = primsMST(graphData);
        setEdges(mstEdges);
        setExecutionTime(executionTime);
      }
      if (validationSelection === "Kruskals") {
        const { mst: mstEdges, executionTime } = kruskalsMST(graphData);
        setEdges(mstEdges);
        setExecutionTime(executionTime);
      }
    }
  }, [
    graphData,
    validationSelection,
    algorithmSelection,
    primsMST,
    kruskalsMST,
    nearestNeighborTSP,
    christofidesTSP,
    twoOptTSP,
    cheapestInsertionTSP,
  ]);

  // Initialize the graph with drag behavior
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", "0 0 600 400");

    const drag = d3
      .drag()
      .on("start", (event, d) => {
        if (currentStep === 0 && !isPlaying) {
          d3.select(event.sourceEvent.target).raise().attr("stroke", "black");
        }
      })
      .on("drag", (event, d) => {
        if (currentStep === 0 && !isPlaying) {
          d3.select(event.sourceEvent.target)
            .attr("cx", (d.x = event.x))
            .attr("cy", (d.y = event.y));
        }
      })
      .on("end", (event, d) => {
        if (currentStep === 0 && !isPlaying) {
          const updatedGraph = graphData.map((node) =>
            node.id === d.id ? { ...node, x: d.x, y: d.y } : node,
          );
          setGraphData(updatedGraph);
        }
      });

    // Create nodes (points)
    svg
      .selectAll("circle")
      .data(graphData)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", vertexRadius)
      .attr("fill", "orange")
      .call(drag);

    // Add labels to the nodes
    svg
      .selectAll("text")
      .data(graphData)
      .enter()
      .append("text")
      .attr("x", (d) => d.x + 10)
      .attr("y", (d) => d.y - 10)
      .text((d) => d.id)
      .attr("font-size", graphFontSize)
      .attr("fill", "white");

    // Update edges
    updateEdges();
  }, [graphData, currentStep, isPlaying]);

  // Function to update edges
  const updateEdges = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("line").remove();

    // Draw the main tree edges
    treeEdges.forEach((edge) => {
      const fromNode = graphData[edge[0]];
      const toNode = graphData[edge[1]];
      const weight = distance(fromNode, toNode).toFixed(0);

      svg
        .append("line")
        .attr("x1", fromNode.x)
        .attr("y1", fromNode.y)
        .attr("x2", toNode.x)
        .attr("y2", toNode.y)
        .attr("stroke", "#FFFF99")
        .attr("stroke-width", edgeSize);

      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);

      const textX = midX + offset * Math.cos(angle + Math.PI / 2);
      const textY = midY + offset * Math.sin(angle + Math.PI / 2);

      svg
        .append("text")
        .attr("x", textX)
        .attr("y", textY)
        .attr("fill", "#FFFF99")
        .attr("font-size", graphFontSize)
        .attr("text-anchor", "middle")
        .text(weight);
    });

    // Draw potential edges from the last added node
    if (currentStep < edges.length && algorithmSelection === "Nearest") {
      const currentEdge = edges[currentStep];
      const currentFromNode = currentEdge[0]; // This is the node from which potential edges are being drawn

      // Find potential edges from the current node to remaining nodes
      if (currentStep > 0) {
        potentialEdges.forEach(({ from, to, distance: edgeDistance }) => {
          if (from === currentFromNode) {
            const fromNode = graphData[currentFromNode];
            const toNode = graphData[to];

            svg
              .append("line")
              .attr("x1", fromNode.x)
              .attr("y1", fromNode.y)
              .attr("x2", toNode.x)
              .attr("y2", toNode.y)
              .attr("stroke", "lightgray") // Lighter color for potential edges
              .attr("stroke-width", edgeSize - 2);
          }
        });
      }
    }
  };

  // Update edges when treeEdges change
  useEffect(() => {
    updateEdges();
  }, [treeEdges]);

  // Animation logic
  useEffect(() => {
    if (isPlaying && currentStep < edges.length) {
      timerRef.current = setTimeout(() => {
        setTreeEdges((prevEdges) => [...prevEdges, edges[currentStep]]);
        setCurrentStep((prevStep) => prevStep + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, edges]);

  const playAnimation = () => {
    setIsPlaying(true);
  };

  const resetVisualization = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setTreeEdges([]);
    setGraphData([...initialGraphData]);
  };

  const handleStepClick = (step) => {
    setIsPlaying(false);

    const newTreeEdges = edges.slice(0, step);
    setTreeEdges(newTreeEdges);
    setCurrentStep(step);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:p-10 lg:px-8">
      <div className="relative w-full lg:w-1/2">
        <svg
          ref={svgRef}
          width="100%"
          className="mb-5 border border-gray-500 bg-landing3 shadow-lg shadow-inherit lg:my-0 lg:mb-5"
          style={{ maxHeight: "400px", height: "100%" }}
        ></svg>
        <p
          style={{
            position: "absolute",
            left: "10px",
            color: "white",
            fontSize: window.innerWidth > 1024 ? "16px" : "14px",
            top: window.innerWidth > 1024 ? "365px" : "210px",
          }}
        >
          {t("total_edge_weight")}: {totalLength.toFixed(0)}
        </p>

        {currentStep === edges.length && (
          <p
            style={{
              position: "absolute",
              left: "10px",
              color: "white",
              fontSize: window.innerWidth > 1024 ? "16px" : "14px",
              top: window.innerWidth > 1024 ? "345px" : "190px",
            }}
          >
            {t("time")}: {executionTime.toFixed(3)} ms
          </p>
        )}

        <div className="items-center justify-center lg:flex lg:space-x-10">
          <div className="flex items-center justify-center space-x-2">
            <button
              className="rounded-md border border-gray-500 px-3 py-2 text-white active:scale-95 active:bg-gray-50"
              onClick={() => {
                setIsPlaying(true);
                playAnimation();
              }}
            >
              <Play />
            </button>

            <button
              className="rounded-md border border-gray-500 px-3 py-2 text-white active:scale-95 active:bg-gray-50"
              onClick={() => {
                setIsPlaying(false);
              }}
            >
              <Pause />
            </button>
            <button
              className="rounded-md border border-gray-500 px-3 py-2 text-white active:scale-95 active:bg-gray-50"
              onClick={resetVisualization}
            >
              <Square />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full text-egg lg:mb-12 lg:ml-14 lg:mt-0 lg:flex lg:w-1/2 lg:flex-col lg:justify-center">
        <div className="flex flex-col items-center justify-center lg:space-y-8">
          <div className="relative h-24 w-full lg:overflow-hidden">
            {(activeSection === "algorithms" ||
              activeSection === "validation") &&
              (i18n.language.startsWith("es")
                ? paragraphs_es
                : i18n.language.startsWith("ca")
                  ? paragraphs_ca
                  : paragraphs)[
                activeSection === "algorithms"
                  ? algorithmSelection
                  : validationSelection
              ].map((paragraph, i) => (
                <p
                  key={i}
                  className={`text-md absolute inset-0 mx-4 flex items-center justify-center text-center text-white transition-all duration-500 ease-in-out lg:text-lg ${
                    i === currentStep
                      ? `translate-x-0 opacity-100`
                      : i < currentStep
                        ? `${direction === "left" ? "-translate-x-full" : "translate-x-full"} opacity-0`
                        : `${direction === "left" ? "translate-x-full" : "-translate-x-full"} opacity-0`
                  }`}
                >
                  {paragraph.text}
                </p>
              ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center space-x-2">
          {Array.from({ length: edges.length + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => handleStepClick(i)}
              className={`h-3 w-3 rounded-full transition-all duration-200 ${
                i === currentStep
                  ? "scale-125 border border-white bg-black"
                  : "border border-white bg-landing3"
              }`}
              aria-label={`Go to step ${i}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Graph;
