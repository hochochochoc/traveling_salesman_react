import React from "react";

export default function Description() {
  return (
    <div>
      <div className="mb-4 rounded-lg bg-egg p-4">
        <div className="mb-2 font-bold">Description</div>
        <p className="">
          The travelling salesman problem, also known as the travelling
          salesperson problem (TSP), asks the following question: "Given a list
          of cities and the distances between each pair of cities, what is the
          shortest possible route that visits each city exactly once and returns
          to the origin city?" It is an NP-hard problem in combinatorial
          optimization, important in theoretical computer science and operations
          research.
        </p>
        <p>
          In the theory of computational complexity, the decision version of the
          TSP (where given a length L, the task is to decide whether the graph
          has a tour whose length is at most L) belongs to the class of
          NP-complete problems. Thus, it is possible that the worst-case running
          time for any algorithm for the TSP increases superpolynomially (but no
          more than exponentially) with the number of cities.
        </p>
        <div className="h-24"></div>
      </div>
    </div>
  );
}
