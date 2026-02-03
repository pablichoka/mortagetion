export const calculateSavings = (salary, baseParams) => {
    return salary - baseParams.expensesFixed - baseParams.investment;
};

export const calculateTarget = (price, baseParams) => {
    const entryPct = baseParams.hasICO ? 0 : 0.20;
    const expensesPct = baseParams.hasITP ? 0.04 : 0.10; // 4% Murcia Joven vs 10% Estándar
    
    const entry = price * entryPct;
    const expenses = price * expensesPct;
    return entry + expenses + baseParams.cushion;
};

export const calculateMonths = (target, monthlySavings, baseParams) => {
    if (monthlySavings <= 0) return 999;
    let balance = parseFloat(baseParams.initialCapital);
    let months = 0;
    const monthlyRate = (baseParams.interestRate / 100) / 12;

    while (balance < target && months < 600) { // Limit to 50 years to avoid infinite
        const interest = balance * monthlyRate;
        balance += monthlySavings + interest;
        months++;
    }
    return months;
};

export const calculateMortgageQuota = (price, baseParams) => {
    // Estimación: 80% financiado (o 100% con ICO, pero asumimos cuota sobre el 80-100% según el caso)
    // Simplificación: Siempre calculamos hipoteca sobre el 80% del valor para el riesgo, 
    // ya que el ICO avala el 20% pero el banco te presta el dinero igual (tienes que devolver el 100%).
    // Si hay ICO, el principal es el 100%. Si no hay ICO, pones 20% y pides 80%.
    
    const principal = baseParams.hasICO ? price : price * 0.8; 
    const annualRate = 0.03; // 3% Fijo estimado
    const years = 30;
    const r = annualRate / 12;
    const n = years * 12;
    
    // Formula cuota francesa
    return (principal * r) / (1 - Math.pow(1 + r, -n));
};

export const calculateInvestmentProjection = (monthlyAmount, months, annualRate) => {
    if (monthlyAmount <= 0 || months <= 0) return 0;
    
    const r = annualRate / 100 / 12;
    // Future Value of a Series (Annuity)
    // FV = P * [((1 + r)^n - 1) / r]
    // Assuming contribution at end of month (ordinary annuity)
    
    if (r === 0) return monthlyAmount * months;
    
    return monthlyAmount * ((Math.pow(1 + r, months) - 1) / r);
};

export const getRiskLevel = (quota, salary) => {
    const ratio = (quota / salary) * 100;
    if (ratio < 20) return { level: 1, label: 'Excelente', color: 'bg-green-100 text-green-800' };
    if (ratio < 25) return { level: 2, label: 'Muy Seguro', color: 'bg-green-100 text-green-800' };
    if (ratio < 30) return { level: 3, label: 'Seguro', color: 'bg-blue-100 text-blue-800' };
    if (ratio < 35) return { level: 4, label: 'Precaución', color: 'bg-yellow-100 text-yellow-800' };
    if (ratio < 40) return { level: 5, label: 'Alto Riesgo', color: 'bg-orange-100 text-orange-800' };
    return { level: 6, label: 'Crítico', color: 'bg-red-100 text-red-800' };
};
