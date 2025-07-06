import { Users } from "lucide-react";

const GradientButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 my-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
  >
    <Users className="w-5 h-5 mr-2 mt-0.5" />
    {label}
  </button>
);

export default GradientButton;
