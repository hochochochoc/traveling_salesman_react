const LoadingPopup = ({ estimatedTime }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="rounded-lg bg-white p-4 shadow-lg">
      <p>Loading cities, please wait...</p>
      <p>Ready in: {estimatedTime} seconds</p>
    </div>
  </div>
);

export default LoadingPopup;
