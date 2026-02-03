import { useState } from 'react';
import { calculateTarget } from '../utils/financialCalculations';
import Modal from './Modal';
import { createHouse } from '../models';

function HousingGoalsCard({ houses, setHouses, baseParams }) {
    // --- STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempHouse, setTempHouse] = useState(createHouse());

    // --- HANDLERS ---
    const openModal = () => {
        setTempHouse(createHouse());
        setIsModalOpen(true);
    };

    const saveHouse = () => {
        if (!tempHouse.label || tempHouse.price <= 0) return;
        setHouses([...houses, { ...tempHouse, id: Date.now() }]);
        setIsModalOpen(false);
    };

    const removeHouse = (id) => setHouses(houses.filter(h => h.id !== id));

    return (
        <div className="card p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">3. Objetivos inmobiliarios</h2>
                <button onClick={openModal} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium">
                    + Añadir Casa
                </button>
            </div>
            
            {houses.length === 0 ? (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <i className="fa-solid fa-house mb-2 text-gray-300 text-3xl"></i>
                    <p className="text-gray-400">No has añadido ninguna vivienda objetivo.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-500 text-sm border-b">
                                <th className="p-3">Etiqueta</th>
                                <th className="p-3">Precio (€)</th>
                                <th className="p-3">Meta ahorro (€)</th>
                                <th className="p-3">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {houses.map((house) => {
                                const target = calculateTarget(house.price, baseParams);
                                return (
                                    <tr key={house.id} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="p-3 font-medium text-gray-800">
                                            {house.label}
                                        </td>
                                        <td className="p-3 font-mono">
                                            {house.price.toLocaleString()} €
                                        </td>
                                        <td className="p-3">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-bold">
                                                {Math.round(target).toLocaleString()} €
                                            </span>
                                            {baseParams.hasICO && <span className="ml-2 text-xs text-orange-600 font-bold">(ICO)</span>}
                                        </td>
                                        <td className="p-3">
                                            <button onClick={() => removeHouse(house.id)} className="text-red-300 hover:text-red-500 transition-colors">
                                                <i className="fa-solid fa-times"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ADD HOUSE MODAL */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Añadir Vivienda Objetivo">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre / Etiqueta</label>
                        <input type="text" placeholder="Ej: Obra Nueva, Segunda Mano..." 
                            className="w-full p-3 border rounded focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={tempHouse.label}
                            onChange={(e) => setTempHouse({...tempHouse, label: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio de Venta (€)</label>
                        <input type="number" placeholder="Ej: 200000" 
                            className="w-full p-3 border rounded focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={tempHouse.price === 0 ? '' : tempHouse.price}
                            onChange={(e) => setTempHouse({...tempHouse, price: parseFloat(e.target.value) || 0})}
                        />
                        <p className="text-xs text-gray-500 mt-1">Sin impuestos ni gastos (se calculan auto).</p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                        <p><strong>Recuerda:</strong> El 10% (o 4% ITP Joven) de impuestos y notaría se sumará automáticamente a la meta de ahorro.</p>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                            Cancelar
                        </button>
                        <button onClick={saveHouse} disabled={!tempHouse.label || tempHouse.price <= 0} 
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow disabled:bg-gray-300 disabled:cursor-not-allowed">
                            Añadir Vivienda
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default HousingGoalsCard;
