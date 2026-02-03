import { useState } from 'react';
import Modal from './Modal';

function ConfigurationCard({ baseParams, setBaseParams }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempParams, setTempParams] = useState({ ...baseParams });

    const openModal = () => {
        setTempParams({ ...baseParams });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        setBaseParams(tempParams);
        setIsModalOpen(false);
    };

    return (
        <div className="card p-6 col-span-1 md:col-span-1 border-l-4 border-blue-500 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">1. Configuración</h2>
                    <button onClick={openModal} className="text-blue-600 hover:text-blue-800">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                </div>
                
                <div className="space-y-4 text-sm text-gray-600">
                    <div className="flex justify-between border-b pb-2">
                        <span>Capital Inicial:</span>
                        <span className="font-bold text-gray-800">{baseParams.initialCapital.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span>Interés Ahorro:</span>
                        <span className="font-bold text-gray-800">{baseParams.interestRate}%</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span>Colchón:</span>
                        <span className="font-bold text-gray-800">{baseParams.cushion.toLocaleString()} €</span>
                    </div>
                    {baseParams.showInvestmentProjection && (
                        <div className="flex justify-between border-b pb-2 bg-indigo-50 p-1 rounded">
                            <span className="text-indigo-800">Rentabilidad Inv.:</span>
                            <span className="font-bold text-indigo-800">{baseParams.investmentReturnRate}%</span>
                        </div>
                    )}
                    <div className="pt-2">
                        <div className="flex items-center space-x-2 mb-1">
                            <i className={`fa-solid ${baseParams.hasICO ? 'fa-check text-green-500' : 'fa-times text-gray-400'}`}></i>
                            <span>Aval ICO (100%)</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                            <i className={`fa-solid ${baseParams.hasITP ? 'fa-check text-green-500' : 'fa-times text-gray-400'}`}></i>
                            <span>ITP Joven</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Editar Configuración">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Capital inicial (€)</label>
                        <input type="number" className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                            value={tempParams.initialCapital === 0 ? '' : tempParams.initialCapital} 
                            onChange={(e) => setTempParams({...tempParams, initialCapital: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Interés ahorro (%)</label>
                        <input type="number" step="0.01" className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                            value={tempParams.interestRate === 0 ? '' : tempParams.interestRate} 
                            onChange={(e) => setTempParams({...tempParams, interestRate: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Colchón seguridad (€)</label>
                        <input type="number" className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                            value={tempParams.cushion === 0 ? '' : tempParams.cushion} 
                            onChange={(e) => setTempParams({...tempParams, cushion: parseFloat(e.target.value) || 0})} />
                    </div>
                    
                    <div className="pt-4 border-t space-y-2">
                        <h4 className="font-bold text-gray-700 text-sm">Ayudas y fiscalidad</h4>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded" 
                                checked={tempParams.hasICO}
                                onChange={(e) => setTempParams({...tempParams, hasICO: e.target.checked})} />
                            <span className="text-sm text-gray-700">Aval ICO (Financia 100%)</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="form-checkbox h-5 w-5 text-green-600 rounded" 
                                checked={tempParams.hasITP}
                                onChange={(e) => setTempParams({...tempParams, hasITP: e.target.checked})} />
                            <span className="text-sm text-gray-700">ITP Joven (Murcia)</span>
                        </label>
                    </div>

                    <div className="pt-4 border-t space-y-2 bg-indigo-50 p-3 rounded">
                        <h4 className="font-bold text-indigo-800 text-sm">Proyección de inversión</h4>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600 rounded" 
                                checked={tempParams.showInvestmentProjection}
                                onChange={(e) => setTempParams({...tempParams, showInvestmentProjection: e.target.checked})} />
                            <span className="text-sm text-gray-700">Calcular valor futuro cartera</span>
                        </label>
                        
                        {tempParams.showInvestmentProjection && (
                            <div className="mt-2">
                                <label className="block text-xs font-medium text-gray-700">Rentabilidad media esperada (%)</label>
                                <input type="number" step="0.1" className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                                    value={tempParams.investmentReturnRate === 0 ? '' : tempParams.investmentReturnRate} 
                                    onChange={(e) => setTempParams({...tempParams, investmentReturnRate: parseFloat(e.target.value) || 0})} />
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                            Cancelar
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow">
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default ConfigurationCard;
