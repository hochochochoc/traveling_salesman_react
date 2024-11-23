import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const TutorialTSP = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 5, right: 5, bottom: 5, left: 5 };
    const width = 200 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const distance = (point1, point2) => {
      return Math.sqrt(
        Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2),
      );
    };

    const generateValidPoint = (existingPoints) => {
      const MAX_ATTEMPTS = 100;
      let attempts = 0;

      while (attempts < MAX_ATTEMPTS) {
        const newPoint = {
          x: Math.random() * (width + 70),
          y: Math.random() * height,
        };

        const isValid = existingPoints.every(
          (existingPoint) => distance(newPoint, existingPoint) >= 40,
        );

        if (isValid) {
          return newPoint;
        }

        attempts++;
      }

      return {
        x: Math.random() * (width + 70),
        y: Math.random() * height,
      };
    };

    const generatePoints = () => {
      const points = [];
      for (let i = 0; i < 6; i++) {
        const point = generateValidPoint(points);
        points.push({
          id: i,
          x: point.x,
          y: point.y,
        });
      }
      return points;
    };

    const animateEdge = (startPoint, endPoint, isLastEdge, onComplete) => {
      const PIXELS_PER_SECOND = 500;
      const STEPS_PER_SECOND = 60;
      const STEP_DURATION = 1500 / STEPS_PER_SECOND;
      const lineLength = distance(startPoint, endPoint);
      const totalSteps = Math.ceil(
        (lineLength / PIXELS_PER_SECOND) * STEPS_PER_SECOND,
      );

      const dx = (endPoint.x - startPoint.x) / totalSteps;
      const dy = (endPoint.y - startPoint.y) / totalSteps;

      const line = g
        .append("line")
        .attr("x1", startPoint.x)
        .attr("y1", startPoint.y)
        .attr("x2", startPoint.x)
        .attr("y2", startPoint.y)
        .attr("stroke", "#FFFF99")
        .attr("stroke-width", 4);

      let step = 0;

      const updateLine = () => {
        if (step >= totalSteps) {
          // Add pause after reaching each point
          setTimeout(() => {
            if (isLastEdge) {
              // If this is the last edge, wait 1 second before starting new cycle
              setTimeout(onComplete, 2000);
            } else {
              onComplete();
            }
          }, 100); // 100ms pause at each point
          return;
        }

        step++;
        const currentX = startPoint.x + dx * step;
        const currentY = startPoint.y + dy * step;

        line.attr("x2", currentX).attr("y2", currentY);
        setTimeout(updateLine, STEP_DURATION);
      };

      updateLine();
    };

    const animatePath = (points, onComplete) => {
      g.selectAll("*").remove();

      g.selectAll("circle")
        .data(points)
        .join("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 6)
        .attr("fill", "#4CAF50");

      let currentIndex = 0;

      const drawNextEdge = () => {
        const startPoint = points[currentIndex];
        const endPoint =
          currentIndex === points.length - 1
            ? points[0]
            : points[currentIndex + 1];

        const isLastEdge = currentIndex === points.length - 1;

        animateEdge(startPoint, endPoint, isLastEdge, () => {
          currentIndex++;
          if (currentIndex < points.length) {
            drawNextEdge();
          } else {
            onComplete();
          }
        });
      };

      drawNextEdge();
    };

    const startNewCycle = () => {
      const points = generatePoints();
      animatePath(points, () => {
        startNewCycle(); // Start a new cycle when the current one completes
      });
    };

    startNewCycle();

    return () => {
      // Cleanup - remove all elements when component unmounts
      svg.selectAll("*").remove();
    };
  }, []);

  return (
    <div className="mx-auto mt-3 w-full max-w-3xl rounded-lg bg-black/90 p-4">
      <svg ref={svgRef} width="200" height="250" className="w-full" />
    </div>
  );
};

export default TutorialTSP;
