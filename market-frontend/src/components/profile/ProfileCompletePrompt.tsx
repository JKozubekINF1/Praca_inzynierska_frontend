import React from 'react';

interface Props {
    onEditClick: () => void;
}

export const ProfileCompletePrompt: React.FC<Props> = ({ onEditClick }) => {
    return (
        <div className="mb-6 p-6 bg-blue-50 border-l-4 border-blue-500 text-gray-800 rounded-r-md shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-blue-800 mb-2">Twój profil jest niekompletny</h3>
                    <p className="text-sm text-gray-700 mb-4">
                        Brakuje Twojego imienia, nazwiska lub numeru telefonu. 
                        Uzupełnij te dane, aby móc w pełni korzystać z serwisu i wzbudzić zaufanie kupujących.
                    </p>
                </div>
            </div>
            
            <div>
                <button 
                    onClick={onEditClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition text-sm shadow-sm"
                >
                    Uzupełnij teraz
                </button>
            </div>
        </div>
    );
};