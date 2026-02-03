// Initial configuration state
export const INITIAL_CONFIG = {
    initialCapital: 0,
    interestRate: 0,
    cushion: 0,
    expensesFixed: 0,
    investment: 0,
    hasICO: false,    // Aval ICO (Ahorra el 20% entrada)
    hasITP: false,    // ITP Joven Murcia (Gastos ~4% en vez de 10%)
    showInvestmentProjection: false, // Calcular proyección de inversión paralela
    investmentReturnRate: 5.0, // Rentabilidad media anual estimada (%)
};

// Factory for a new Salary Scenario
export const createSalary = () => ({
    id: Date.now(),
    label: '',
    amount: 0, // This will be the Net Monthly (effective or actual)
    // Extended Calculator Data
    grossAnnual: 0,
    numPayments: 12,
    age: 30,
    children: 0,
    calculated: false // flag to know if it comes from calculator
});

// Factory for a new House Objective
export const createHouse = () => ({
    id: Date.now(),
    label: '',
    price: 0
});
