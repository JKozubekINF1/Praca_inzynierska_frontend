import React from 'react';

interface Props {
  photos: File[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

export const PhotoUploader: React.FC<Props> = ({ photos, onChange, onRemove }) => {
  return (
    <div className="space-y-4 border-t border-gray-200 pt-6 mt-6">
      <h3 className="text-xl font-bold text-black border-b border-gray-200 pb-2">Zdjęcia</h3>

      <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 text-center hover:bg-gray-100 transition relative">
        <input
          type="file"
          multiple
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onChange}
        />
        <div className="flex flex-col items-center pointer-events-none">
          <span className="text-blue-600 font-bold">Kliknij, aby dodać zdjęcia</span>
          <span className="text-sm text-gray-500 mt-1">lub przeciągnij je tutaj</span>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {photos.map((file, index) => (
            <div key={index} className="relative group aspect-w-4 aspect-h-3">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-full h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
