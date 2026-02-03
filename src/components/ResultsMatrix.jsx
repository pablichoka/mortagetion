import { 
    calculateSavings, 
    calculateTarget, 
    calculateMonths, 
    calculateMortgageQuota, 
    getRiskLevel,
    calculateInvestmentProjection
} from '../utils/financialCalculations';

function ResultsMatrix({ salaries, houses, baseParams }) {
    return (
        <div className="card p-6 mb-8 border-t-4 border-green-500">
            <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">Resultados y matriz de riesgo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {salaries.map((sal) => {
                    const savings = calculateSavings(sal.amount, baseParams);
                    return (
                        <div key={sal.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 className="font-bold text-lg text-gray-800 border-b pb-2 mb-3">
                                {sal.label} <span className="text-gray-500 font-normal">({sal.amount}€)</span>
                            </h3>
                            
                            <div className="space-y-4">
                                {houses.map(h => {
                                    const target = calculateTarget(h.price, baseParams);
                                    const months = calculateMonths(target, savings, baseParams);
                                    
                                    // Calcular fecha estimada
                                    const date = new Date();
                                    date.setMonth(date.getMonth() + months);
                                    const dateStr = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
                                    
                                    // Calcular Riesgo
                                    const quota = calculateMortgageQuota(h.price, baseParams);
                                    const risk = getRiskLevel(quota, sal.amount);

                                    // Calcular Proyección de Inversión (si activo)
                                    let investmentProjection = 0;
                                    if (baseParams.showInvestmentProjection) {
                                        investmentProjection = calculateInvestmentProjection(
                                            baseParams.investment, 
                                            months, 
                                            baseParams.investmentReturnRate
                                        );
                                    }

                                    return (
                                        <div key={h.id} className="bg-white p-3 rounded shadow-sm">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-gray-700">{h.label}</span>
                                                <span className="text-xs font-mono bg-gray-200 px-1 rounded">{Math.round(h.price/1000)}k</span>
                                            </div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-500">Tiempo:</span>
                                                <span className="font-bold text-blue-600">{months} meses</span>
                                            </div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-500">Fecha:</span>
                                                <span className="font-medium">{dateStr}</span>
                                            </div>
                                            
                                            {baseParams.showInvestmentProjection && (
                                                <div className="mb-2 p-2 bg-indigo-50 rounded text-xs">
                                                    <div className="flex justify-between">
                                                        <span className="text-indigo-800 font-medium">Cartera Inv. Proyectada:</span>
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-gray-500">({baseParams.investmentReturnRate}%)</span>
                                                        <span className="font-bold text-indigo-700 text-sm">
                                                            {Math.round(investmentProjection).toLocaleString()} €
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-2 pt-2 border-t flex justify-between items-center">
                                                <span className="text-xs text-gray-500">Riesgo:</span>
                                                <span className={`text-xs px-2 py-0.5 rounded font-bold ${risk.color}`}>
                                                    {risk.label} ({Math.round((quota/sal.amount)*100)}%)
                                                </span>
                                            </div>
                                            <div className="text-right mt-1">
                                                <span className="text-xs text-gray-400">Cuota aprox: {Math.round(quota)} €</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default ResultsMatrix;
