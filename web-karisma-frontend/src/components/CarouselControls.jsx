import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export default function CarouselControls({ onPrev, onNext }) {
  return (
    <div className="flex space-x-4">
      <button
        onClick={onPrev}
        className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
      >
        <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
      </button>
      <button
        onClick={onNext}
        className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
      >
        <ChevronRightIcon className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );
}