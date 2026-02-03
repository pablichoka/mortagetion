import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Components
import Header from './components/Header';
import ConfigurationCard from './components/ConfigurationCard';
import CashFlowCard from './components/CashFlowCard';
import HousingGoalsCard from './components/HousingGoalsCard';
import ResultsMatrix from './components/ResultsMatrix';
import PDFReportButton from './components/PDFReportButton';

// Models
import { INITIAL_CONFIG } from './models';

function App() {
    // --- ESTADO INICIAL ---
    const [baseParams, setBaseParams] = useState(INITIAL_CONFIG);

    const [salaries, setSalaries] = useState([]);

    const [houses, setHouses] = useState([]);

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <Header />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* CARD 1: CONFIGURACIÓN */}
                <ConfigurationCard 
                    baseParams={baseParams} 
                    setBaseParams={setBaseParams} 
                />

                {/* CARD 2: GASTOS Y FLUJO */}
                <CashFlowCard 
                    baseParams={baseParams}
                    setBaseParams={setBaseParams}
                    salaries={salaries}
                    setSalaries={setSalaries}
                />
            </div>

            {/* CARD 3: OBJETIVOS */}
            <HousingGoalsCard 
                houses={houses}
                setHouses={setHouses}
                baseParams={baseParams}
            />

            {/* CARD 4: RESULTADOS (MATRIZ CRUZADA PREVIA) */}
            <ResultsMatrix 
                salaries={salaries}
                houses={houses}
                baseParams={baseParams}
            />

            <PDFReportButton 
                baseParams={baseParams}
                salaries={salaries}
                houses={houses}
            />
        </div>
    );
}

export default App;
