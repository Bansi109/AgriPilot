import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OverviewDashboard from './components/OverviewDashboard';
import DigitalTwinMap from './components/DigitalTwinMap';
import CropLifecycleRoadmap from './components/CropLifecycleRoadmap';
import AgentMarketplace from './components/AgentMarketplace';
import PestVisionLab from './components/PestVisionLab';
import CropRotationDAG from './components/CropRotationDAG';
import MarketProfitOptimizer from './components/MarketProfitOptimizer';
import OperationsPlanner from './components/OperationsPlanner';
import CrisisCenter from './components/CrisisCenter';
import FarmToMarketView from './components/FarmToMarketView';
import KnowledgeGraphView from './components/KnowledgeGraphView';
import OmnichannelSimulator from './components/OmnichannelSimulator';

import { 
  Cpu, 
  Globe, 
  Sprout, 
  Bot, 
  Bug, 
  GitFork, 
  TrendingUp, 
  Calendar, 
  ShieldAlert, 
  Truck, 
  Brain, 
  Radio
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFieldId, setSelectedFieldId] = useState('FIELD-NORTH-01');
  const [language, setLanguage] = useState('Hindi');
  const [fields, setFields] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [cycleData, setCycleData] = useState(null);
  const [cycleLoading, setCycleLoading] = useState(false);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [liveTelemetry, setLiveTelemetry] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    // 1. Fetch Fields
    fetch('/api/twin/fields')
      .then(res => res.json())
      .then(data => {
        setFields(data);
        if (data.length > 0) setSelectedFieldId(data[0].field_id);
      })
      .catch(console.error);

    // 2. Fetch Weather
    fetch('/api/weather/current')
      .then(res => res.json())
      .then(data => setWeatherData(data))
      .catch(console.error);

    // 3. Fetch Last Cycle
    fetch('/api/cycle/last')
      .then(res => res.json())
      .then(data => setCycleData(data))
      .catch(console.error);

    // 4. Connect Telemetry WebSocket
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/telemetry`;
    let ws;
    try {
      ws = new WebSocket(wsUrl);
      ws.onopen = () => setIsWsConnected(true);
      ws.onclose = () => setIsWsConnected(false);
      ws.onmessage = (event) => {
        try {
          const telemetry = JSON.parse(event.data);
          setLiveTelemetry(telemetry);
        } catch (e) {}
      };
    } catch (e) {
      console.warn("WebSocket fallback to polling:", e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleRunDecisionCycle = async () => {
    setCycleLoading(true);
    try {
      const res = await fetch('/api/cycle/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field_id: selectedFieldId,
          farmer_phone: "+91 98765 43210",
          preferred_language: language
        })
      });
      const data = await res.json();
      setCycleData(data);
      // Refresh weather & fields
      const [fRes, wRes] = await Promise.all([
        fetch('/api/twin/fields'),
        fetch('/api/weather/current')
      ]);
      setFields(await fRes.json());
      setWeatherData(await wRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setCycleLoading(false);
    }
  };

  const activeField = fields.find(f => f.field_id === selectedFieldId) || fields[0] || {
    field_id: 'FIELD-NORTH-01',
    name: 'North Plot — Alpha Ridge',
    crop: 'Wheat',
    area_ha: 2.4,
    soil_moisture_pct: 52.4,
    soil_n_mg_kg: 154.0,
    soil_ph: 7.2,
    valve_id: 'VALVE-N1-01',
    pump_status: 'STANDBY',
    active_pest_status: 'Yellow Rust Focus'
  };

  const navTabs = [
    { id: 'overview', label: 'Command Center', icon: <Cpu size={16} /> },
    { id: 'map', label: 'GIS Twin & What-If', icon: <Globe size={16} /> },
    { id: 'lifecycle', label: 'Crop Lifecycle', icon: <Sprout size={16} /> },
    { id: 'marketplace', label: 'Specialist Agents', icon: <Bot size={16} /> },
    { id: 'pest-vision', label: 'Pest Vision Lab', icon: <Bug size={16} /> },
    { id: 'crop-rotation', label: 'Crop Rotation DAG', icon: <GitFork size={16} /> },
    { id: 'profit', label: 'Mandi Profit Optimizer', icon: <TrendingUp size={16} /> },
    { id: 'planner', label: 'Operations Planner', icon: <Calendar size={16} /> },
    { id: 'crisis', label: 'Crisis Center', icon: <ShieldAlert size={16} /> },
    { id: 'farm-market', label: 'Farm-to-Market', icon: <Truck size={16} /> },
    { id: 'knowledge-graph', label: 'Seasonal Memory', icon: <Brain size={16} /> },
    { id: 'omnichannel', label: 'IoT & SMS Dispatch', icon: <Radio size={16} /> },
  ];

  return (
    <div className="app-container">
      {/* Top Navbar Header */}
      <Navbar
        selectedField={selectedFieldId}
        setSelectedField={setSelectedFieldId}
        fields={fields}
        language={language}
        setLanguage={setLanguage}
        onRunCycle={handleRunDecisionCycle}
        cycleLoading={cycleLoading}
        activeIncidentsCount={2}
        isWsConnected={isWsConnected}
      />

      {/* Navigation Tab Bar */}
      <nav className="nav-tab-bar">
        {navTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Tab Content Display */}
      <main>
        {activeTab === 'overview' && (
          <OverviewDashboard
            cycleData={cycleData}
            weatherData={weatherData}
            field={activeField}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'map' && (
          <DigitalTwinMap
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
          />
        )}

        {activeTab === 'lifecycle' && (
          <CropLifecycleRoadmap
            field={activeField}
          />
        )}

        {activeTab === 'marketplace' && (
          <AgentMarketplace />
        )}

        {activeTab === 'pest-vision' && (
          <PestVisionLab
            weatherData={weatherData}
          />
        )}

        {activeTab === 'crop-rotation' && (
          <CropRotationDAG />
        )}

        {activeTab === 'profit' && (
          <MarketProfitOptimizer
            field={activeField}
          />
        )}

        {activeTab === 'planner' && (
          <OperationsPlanner />
        )}

        {activeTab === 'crisis' && (
          <CrisisCenter />
        )}

        {activeTab === 'farm-market' && (
          <FarmToMarketView
            field={activeField}
          />
        )}

        {activeTab === 'knowledge-graph' && (
          <KnowledgeGraphView />
        )}

        {activeTab === 'omnichannel' && (
          <OmnichannelSimulator
            language={language}
          />
        )}
      </main>
    </div>
  );
}
