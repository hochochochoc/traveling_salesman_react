import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Component() {
  return (
    <div className="mt-2 flex justify-center space-x-4">
      <button className="rounded-lg border border-gray-400 p-2 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 active:scale-95 active:bg-gray-200">
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous</span>
      </button>
      <button className="rounded-lg border border-gray-400 p-2 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 active:scale-95 active:bg-gray-200">
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next</span>
      </button>
    </div>
  );
}
