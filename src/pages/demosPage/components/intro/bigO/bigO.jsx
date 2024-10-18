import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function BigO() {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const width = 300 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scalePow().exponent(0.5).range([0, width]);

    const y = d3.scalePow().exponent(0.5).range([height, 0]);

    const line = d3
      .line()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]));

    const functions = [
      {
        name: "O(1)",
        fn: () => 1,
        color: "#4CAF50",
        labelPosition: { x: 178, y: 105 }, // Above the O(1) line
      },
      {
        name: "O(log n)",
        fn: (n) => Math.log2(n),
        color: "#2196F3",
        labelPosition: { x: 178, y: 80 }, // Near end of log curve
      },
      {
        name: "O(n)",
        fn: (n) => n,
        color: "#FFC107",
        labelPosition: { x: 178, y: 35 }, // Right side of linear curve
      },
      {
        name: "O(n²)",
        fn: (n) => n * n,
        color: "#F44336",
        labelPosition: { x: 10, y: 15 }, // Top center for quadratic
      },
    ];

    x.domain([1, 50]);
    y.domain([0, 50]);

    const xAxis = d3.axisBottom(x).tickValues([1, 2, 5, 10, 20, 30, 40, 50]);
    const yAxis = d3.axisLeft(y).tickValues([1, 2, 5, 10, 20, 30, 40, 50]);

    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .append("text")
      .attr("fill", "#fff")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .text("Input Size (n)");

    // Add Y axis
    g.append("g")
      .call(yAxis)
      .append("text")
      .attr("fill", "#fff")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .text("Time Complexity");

    functions.forEach((func) => {
      const data = d3.range(1, 51, 0.5).map((n) => [n, func.fn(n)]);

      const path = g
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", func.color)
        .attr("stroke-width", 2)
        .attr("d", line);

      const totalLength = path.node().getTotalLength();

      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      // Add labels with custom positioning
      g.append("text")
        .attr("x", func.labelPosition.x)
        .attr("y", func.labelPosition.y)
        .attr("fill", func.color)
        .attr("text-anchor", "start")
        .text(func.name);
    });
  }, []);

  return (
    <div className="mx-auto mt-3 w-full max-w-3xl rounded-lg bg-black p-2 opacity-90">
      <p className="mb-4"></p>
      <svg ref={svgRef} width="300" height="200" className="w-full" />
    </div>
  );
}
