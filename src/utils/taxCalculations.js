export const calculateNetSalary = (grossAnnual, numPayments = 12, age = 30, children = 0) => {
    // 1. Social Security (Seguridad Social)
    // General Regime approx: 6.35% (4.7% Common + 1.55% Unemployment + 0.1% FP)
    // Max contribution base 2025 approx: 4720.50€/month -> 56,646€/year
    const ssRate = 0.0635;
    const maxBase = 56646; // Capped base
    const contributionBase = Math.min(grossAnnual, maxBase);
    const socialSecurity = contributionBase * ssRate;

    // 2. IRPF Base Estimator
    // Gross - SS - Standard Deduction (2000€)
    // This is a simplification. Real IRPF is complex.
    const deducionGastos = 2000;
    
    // Reduccion por rendimientos del trabajo (simplificado para rentas bajas)
    let reduccionRendimientos = 0;
    if (grossAnnual < 14047.50) {
        reduccionRendimientos = 6498;
    } else if (grossAnnual < 19747.50) {
        reduccionRendimientos = 6498 - (1.14 * (grossAnnual - 14047.50));
    }

    const netTaxBase = Math.max(0, grossAnnual - socialSecurity - deducionGastos - reduccionRendimientos);

    // 3. Minimo Personal y Familiar
    let minimoPersonal = 5550;
    // Age adjustments
    if (age > 65) minimoPersonal += 1150;
    if (age > 75) minimoPersonal += 1400;

    // Children adjustments (simplified)
    // 1st: 2400, 2nd: 2700, 3rd: 4000, 4th+: 4500
    let minimoDescendientes = 0;
    if (children >= 1) minimoDescendientes += 2400;
    if (children >= 2) minimoDescendientes += 2700;
    if (children >= 3) minimoDescendientes += 4000;
    if (children >= 4) minimoDescendientes += 4500 * (children - 3);

    const totalMinimo = minimoPersonal + minimoDescendientes;

    // 4. Calculate IRPF quota (State + Regional approx 50/50 split, using state scale x2 for simplicity)
    // Brackets 2024 (approx)
    const brackets = [
        { limit: 12450, rate: 0.19 },
        { limit: 20200, rate: 0.24 },
        { limit: 35200, rate: 0.30 },
        { limit: 60000, rate: 0.37 },
        { limit: 300000, rate: 0.45 },
        { limit: Infinity, rate: 0.47 }
    ];

    const calculateQuota = (base) => {
        let remaining = base;
        let quota = 0;
        let prevLimit = 0;

        for (const bracket of brackets) {
            const width = bracket.limit - prevLimit;
            const taxable = Math.min(remaining, width);
            
            if (taxable <= 0) break;

            quota += taxable * bracket.rate;
            remaining -= taxable;
            prevLimit = bracket.limit;
        }
        return quota;
    };

    // Calculate quota for Base and Minimo
    const quotaBase = calculateQuota(netTaxBase);
    const quotaMinimo = calculateQuota(totalMinimo);
    
    // Net Quota
    let irpfAnnual = Math.max(0, quotaBase - quotaMinimo);
    
    // Ensure retention doesn't exceed reasonable limits or go below 0 (simplified)
    if (grossAnnual < 15876 && children === 0) irpfAnnual = 0; // Limit for avoiding retention (approx)

    const netAnnual = grossAnnual - socialSecurity - irpfAnnual;
    const retentionRate = (irpfAnnual / grossAnnual) * 100;

    const netMonthly = netAnnual / numPayments;

    return {
        grossAnnual,
        netAnnual,
        netMonthlyProrated: netAnnual / 12, // For calculations
        netMonthly: netMonthly, // What you get in the bank
        numPayments: parseInt(numPayments),
        socialSecurity,
        irpfAnnual,
        retentionRate
    };
};
