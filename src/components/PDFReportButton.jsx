import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { 
    calculateSavings, 
    calculateTarget, 
    calculateMonths, 
    calculateMortgageQuota, 
    getRiskLevel,
    calculateInvestmentProjection
} from '../utils/financialCalculations';

function PDFReportButton({ baseParams, salaries, houses }) {
    
    // --- PDF GENERATOR ---
    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Título
        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235); // Blue
        doc.text("Informe de Viabilidad Financiera", 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 27);

        // Sección 1: Parámetros
        const configBody = [
            ['Capital Inicial', `${baseParams.initialCapital.toLocaleString()} €`],
            ['Gastos Fijos Mensuales', `${baseParams.expensesFixed.toLocaleString()} €`],
            ['Dinero destinado a inversión', `${baseParams.investment.toLocaleString()} €`],
            ['Aval ICO (20% Entrada)', baseParams.hasICO ? 'SÍ' : 'NO'],
            ['ITP Joven/Reducido', baseParams.hasITP ? 'SÍ' : 'NO'],
        ];

        if (baseParams.showInvestmentProjection) {
            configBody.push(['Proyección Inversión', `ACTIVO (${baseParams.investmentReturnRate}%)`]);
        }

        autoTable(doc, {
            startY: 35,
            head: [['Parámetro', 'Valor']],
            body: configBody,
            theme: 'grid',
            headStyles: { fillColor: [37, 99, 235] }
        });

        // Sección 2: Análisis por Escenario de Sueldo
        let finalY = doc.lastAutoTable.finalY + 10;

        salaries.forEach((sal) => {
            const savings = calculateSavings(sal.amount, baseParams);
            const savingsPct = Math.round((savings / sal.amount) * 100);
            
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text(`${sal.label}: ${sal.amount.toLocaleString()} € netos`, 14, finalY);
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Ahorro Líquido Real: ${savings.toLocaleString()} €/mes (${savingsPct}%)`, 14, finalY + 6);

            const tableData = houses.map(h => {
                const target = calculateTarget(h.price, baseParams);
                const months = calculateMonths(target, savings, baseParams);
                const years = (months / 12).toFixed(1);
                const date = new Date();
                date.setMonth(date.getMonth() + months);
                
                const quota = calculateMortgageQuota(h.price, baseParams);
                const quotaPct = Math.round((quota / sal.amount) * 100);
                const risk = getRiskLevel(quota, sal.amount);

                let investmentProjStr = '-';
                if (baseParams.showInvestmentProjection) {
                    const proj = calculateInvestmentProjection(baseParams.investment, months, baseParams.investmentReturnRate);
                    investmentProjStr = `${Math.round(proj).toLocaleString()} €`;
                }

                return [
                    h.label,
                    `${h.price.toLocaleString()} €`,
                    `${Math.round(target).toLocaleString()} €`,
                    `${months} meses (${years} años)`,
                    `${Math.round(quota)} € (${quotaPct}%)`,
                    investmentProjStr,
                    risk.level <= 3 ? 'Seguro' : 'ALTO'
                ];
            });

            const headers = baseParams.showInvestmentProjection 
                ? [['Vivienda', 'Precio', 'Meta ahorro (€)', 'Tiempo', 'Cuota Hip.', 'Inv. Proy.', 'Riesgo']]
                : [['Vivienda', 'Precio', 'Meta ahorro (€)', 'Tiempo', 'Cuota Hip.', 'Riesgo']];

            // Adjust data if projection is hidden (remove that column)
            const finalTableData = baseParams.showInvestmentProjection 
                ? tableData 
                : tableData.map(row => [row[0], row[1], row[2], row[3], row[4], row[6]]); // Skip index 5 (Inv. Proj)

            autoTable(doc, {
                startY: finalY + 10,
                head: headers,
                body: finalTableData,
                theme: 'striped',
                headStyles: { fillColor: [50, 50, 50] }
            });

            finalY = doc.lastAutoTable.finalY + 15;
            
            // Salto de página si es necesario
            if (finalY > 250) {
                doc.addPage();
                finalY = 20;
            }
        });

        doc.save("Plan_Vivienda_2026.pdf");
    };

    return (
        <div className="text-center pb-12">
            <button onClick={generatePDF} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition hover:scale-105 flex items-center justify-center mx-auto">
                <i className="fa-solid fa-file-pdf mr-3 text-2xl"></i>
                <span className="text-lg">Generar Informe PDF Completo</span>
            </button>
            <p className="mt-3 text-gray-500 text-sm">Descarga el análisis detallado para imprimir o guardar.</p>
        </div>
    );
}

export default PDFReportButton;
