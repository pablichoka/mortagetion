import { useState, useEffect } from 'react';
import { calculateSavings } from '../utils/financialCalculations';
import { calculateNetSalary } from '../utils/taxCalculations';
import Modal from './Modal';
import { createSalary } from '../models';

function CashFlowCard({ baseParams, setBaseParams, salaries, setSalaries }) {
    // --- STATE ---
    const [isExpensesModalOpen, setIsExpensesModalOpen] = useState(false);
    const [tempExpenses, setTempExpenses] = useState({ expensesFixed: 0, investment: 0 });

    const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
    const [tempSalary, setTempSalary] = useState(createSalary());
    const [calculationResult, setCalculationResult] = useState({});

    // Live calculation Effect
    useEffect(() => {
        if (isSalaryModalOpen) {
            const res = calculateNetSalary(
                tempSalary.grossAnnual || 0,
                tempSalary.numPayments,
                tempSalary.age,
                tempSalary.children
            );
            setCalculationResult(res);
        }
    }, [tempSalary.grossAnnual, tempSalary.numPayments, tempSalary.age, tempSalary.children, isSalaryModalOpen]);

    // --- HANDLERS ---
    
    // Expenses Modal
    const openExpensesModal = () => {
        setTempExpenses({ 
            expensesFixed: baseParams.expensesFixed, 
            investment: baseParams.investment 
        });
        setIsExpensesModalOpen(true);
    };

    const saveExpenses = () => {
        setBaseParams({ 
            ...baseParams, 
            expensesFixed: tempExpenses.expensesFixed, 
            investment: tempExpenses.investment 
        });
        setIsExpensesModalOpen(false);
    };

    // Salary Modal
    const openAddSalaryModal = () => {
        setTempSalary(createSalary());
        setIsSalaryModalOpen(true);
    };

    const saveSalary = () => {
        if (!tempSalary.label || tempSalary.grossAnnual <= 0) return; 
        
        // Use the prorated monthly net for the persistent state to allow simple monthly calculations downstream
        const finalAmount = calculationResult.netMonthlyProrated || 0;
        
        setSalaries([...salaries, { 
            ...tempSalary, 
            amount: Math.round(finalAmount), // Important: Store effective monthly
            id: Date.now(),
            calculated: true,
            // also store breakdown if needed for display
            displayNet: Math.round(calculationResult.netMonthly)
        }]);
        setIsSalaryModalOpen(false);
    };
    
    const removeSalary = (id) => setSalaries(salaries.filter(s => s.id !== id));


    return (
        <div className="card p-6 col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-gray-800">2. Flujo de dinero mensual</h2>
            
            {/* GASTOS Y FLUJO */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Gastos e Inversión</h3>
                    <button onClick={openExpensesModal} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        <i className="fa-solid fa-pen mr-1"></i> Editar
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="block text-xs text-gray-500">Gastos fijos mensuales</span>
                        <span className="text-lg font-bold text-red-600">{baseParams.expensesFixed.toLocaleString()} €</span>
                    </div>
                    <div>
                        <span className="block text-xs text-gray-500">Dinero destinado a inversión</span>
                        <span className="text-lg font-bold text-indigo-600">{baseParams.investment.toLocaleString()} €</span>
                    </div>
                </div>
            </div>

            {/* LISTADO SUELDOS */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Escenarios de Sueldo</h3>
                    <button onClick={openAddSalaryModal} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        <i className="fa-solid fa-plus mr-1"></i> Añadir
                    </button>
                </div>

                {salaries.length === 0 ? (
                    <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-400 text-sm">No hay sueldos registrados.</p>
                        <button onClick={openAddSalaryModal} className="mt-2 text-blue-500 hover:underline text-sm">
                            Añadir el primero
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {salaries.map((sal) => {
                            const saving = calculateSavings(sal.amount, baseParams);
                            return (
                                <div key={sal.id} className="flex items-center justify-between bg-white border p-3 rounded shadow-sm">
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-800">{sal.label}</div>
                                        <div className="text-sm text-gray-500">{sal.amount.toLocaleString()} € netos</div>
                                    </div>
                                    
                                    <div className="text-right mr-4">
                                        <span className="block text-xs text-gray-400">Ahorro Est.</span>
                                        <span className={`font-bold ${saving > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {saving.toLocaleString()} €
                                        </span>
                                    </div>

                                    <button onClick={() => removeSalary(sal.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* EXPENSES MODAL */}
            <Modal isOpen={isExpensesModalOpen} onClose={() => setIsExpensesModalOpen(false)} title="Editar Gastos e Inversión">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gastos fijos mensuales (€)</label>
                        <p className="text-xs text-gray-500 mb-2">Coche, Casa, Comida, Ocio, Gimnasio...</p>
                        <input type="number" className="w-full p-3 border rounded bg-red-50 focus:ring-red-500 focus:border-red-500 outline-none" 
                            value={tempExpenses.expensesFixed === 0 ? '' : tempExpenses.expensesFixed} 
                            onChange={(e) => setTempExpenses({...tempExpenses, expensesFixed: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dinero destinado a inversión (€)</label>
                        <p className="text-xs text-gray-500 mb-2">MyInvestor, Fondos, Crypto...</p>
                        <input type="number" className="w-full p-3 border rounded bg-indigo-50 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                            value={tempExpenses.investment === 0 ? '' : tempExpenses.investment} 
                            onChange={(e) => setTempExpenses({...tempExpenses, investment: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div className="pt-4 flex justify-end space-x-3">
                        <button onClick={() => setIsExpensesModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                            Cancelar
                        </button>
                        <button onClick={saveExpenses} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow">
                            Guardar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ADD SALARY MODAL */}
            <Modal isOpen={isSalaryModalOpen} onClose={() => setIsSalaryModalOpen(false)} title="Calculadora de Sueldo Neto">
                <div className="space-y-6">
                    {/* Header Inputs */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del escenario</label>
                        <input type="text" placeholder="Ej: Sueldo Actual, Subida 2026..." 
                            className="w-full p-3 border rounded focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={tempSalary.label}
                            onChange={(e) => setTempSalary({...tempSalary, label: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* LEFT COLUMN: INPUTS */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wide border-b pb-1">Datos Profesionales</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <i className="fa-solid fa-euro-sign text-gray-400 mr-2"></i>Sueldo bruto anual
                                </label>
                                <input type="number" 
                                    className="w-full p-2 border rounded focus:ring-blue-500 outline-none"
                                    value={tempSalary.grossAnnual === 0 ? '' : tempSalary.grossAnnual}
                                    onChange={(e) => setTempSalary({...tempSalary, grossAnnual: parseFloat(e.target.value) || 0})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <i className="fa-solid fa-calendar text-gray-400 mr-2"></i>Número de Pagas
                                </label>
                                <select 
                                    className="w-full p-2 border rounded focus:ring-blue-500 outline-none bg-white"
                                    value={tempSalary.numPayments}
                                    onChange={(e) => setTempSalary({...tempSalary, numPayments: parseInt(e.target.value)})}
                                >
                                    <option value={12}>12 Pagas (Prorrateadas)</option>
                                    <option value={14}>14 Pagas (Extras Junio/Dic)</option>
                                </select>
                            </div>

                            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wide border-b pb-1 pt-2">Datos Personales</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                                    <input type="number" 
                                        className="w-full p-2 border rounded focus:ring-blue-500 outline-none"
                                        value={tempSalary.age === 0 ? '' : tempSalary.age}
                                        onChange={(e) => setTempSalary({...tempSalary, age: parseInt(e.target.value) || 0})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hijos</label>
                                    <div className="flex items-center space-x-2">
                                        <button className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold"
                                            onClick={() => setTempSalary(prev => ({...prev, children: Math.max(0, prev.children - 1)}))}>-</button>
                                        <span className="w-8 text-center font-bold">{tempSalary.children}</span>
                                        <button className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold"
                                            onClick={() => setTempSalary(prev => ({...prev, children: prev.children + 1}))}>+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: RESULTS PREVIEW */}
                        <div className="bg-teal-500 text-white rounded-lg p-5 flex flex-col justify-between shadow-lg">
                            <div>
                                <h4 className="text-teal-100 text-sm font-medium mb-1">Sueldo neto mensual</h4>
                                <div className="text-4xl font-bold mb-4">
                                    {calculationResult.netMonthly > 0 
                                        ? calculationResult.netMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 }) 
                                        : '---'} €
                                </div>
                                
                                {tempSalary.numPayments === 14 && calculationResult.netMonthly > 0 && (
                                    <div className="mb-4 text-teal-100 text-sm bg-teal-600/50 p-2 rounded">
                                        + 2 pagas extras de <span className="font-bold text-white">{calculationResult.netMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })} €</span>
                                    </div>
                                )}

                                <div className="space-y-2 border-t border-teal-400/50 pt-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-teal-100">Sueldo neto anual:</span>
                                        <span className="font-bold">{calculationResult.netAnnual > 0 
                                            ? calculationResult.netAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 }) 
                                            : '---'} €</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-teal-100">Retención IRPF:</span>
                                        <span className="font-bold">{calculationResult.retentionRate > 0 
                                            ? calculationResult.retentionRate.toFixed(1) 
                                            : '--'}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-teal-100">Seguridad Social:</span>
                                        <span className="font-bold">{calculationResult.socialSecurity > 0 
                                            ? Math.round(calculationResult.socialSecurity).toLocaleString() 
                                            : '---'} €</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3 border-t">
                        <button onClick={() => setIsSalaryModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                            Cancelar
                        </button>
                        <button onClick={saveSalary} disabled={!tempSalary.label || tempSalary.grossAnnual <= 0} 
                            className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 shadow disabled:bg-gray-300 disabled:cursor-not-allowed transition transform hover:scale-105">
                            Calcular y Añadir
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default CashFlowCard;
