<p align="center">
  <img src="assets/agripilot-logo.png" alt="AgriPilot Logo" width="220"/>
</p>

<h1 align="center">🌱 AgriPilot — Autonomous Farm Decision & Action Orchestration Platform</h1>

<p align="center">
  <b><i>The farm decides. The farm acts. The farm remembers.</i></b>
</p>

<p align="center">
  A closed-loop, multi-agent autonomous decision system for precision agriculture — offline-first by design for Indian agro-climatic zones.
</p>

<p align="center">
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.12"/></a>
  <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"/></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/></a>
  <a href="https://coin-or.github.io/pulp/"><img src="https://img.shields.io/badge/PuLP-Optimization-FF6F00?style=for-the-badge" alt="PuLP"/></a>
  <a href="https://www.twilio.com/"><img src="https://img.shields.io/badge/Offline%20Dispatch-Twilio%20SMS-F22F46?style=for-the-badge&logo=twilio&logoColor=white" alt="Twilio"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License MIT"/></a>
</p>

---

## 📌 Executive Overview

In smallholder agriculture across India, farmers make critical weekly decisions — when to irrigate, how much NPK fertilizer to apply, when to spray pesticides, what successor crop to sow, and when to harvest for APMC mandis. Today, these decisions are often made in isolation based on habit, regional weather forecasts, or guesswork.

**AgriPilot** is the orchestration layer that connects IoT soil telemetry, Open-Meteo micro-climate weather data, computer vision drone/smartphone imagery, and APMC mandi price feeds into **a single automated closed-loop system**.

Instead of leaving advice on a screen, AgriPilot carries decisions all the way to physical execution — triggering **MQTT drip irrigation valves**, sending **multilingual offline SMS/Voice alerts**, or escalating high-risk anomalies to **senior agronomists**.

---

## 🎯 The Core Gap We Solve

| Traditional Farming Challenge | AgriPilot Autonomous Solution |
| :--- | :--- |
| **Regional Weather Mismatch**: Standard forecasts miss field-level micro-climates. | **Micro-Climate Fusion**: Blends Open-Meteo satellite feeds with live field sensors for Penman-Monteith ET₀ calculation. |
| **Delayed Soil Feedback**: Lab soil tests arrive weeks after crop stress occurs. | **Real-Time Soil Intelligence**: Autonomous NPK ratio monitoring and dynamic fertigation dosage. |
| **Reactive Pest Spraying**: Infestations spotted only after visual crop damage occurs. | **Computer Vision Pest Lab**: Leaf pathology detection with statutory pre-harvest spray window solvers. |
| **Unoptimized Mandi Sales**: Harvest timing disconnected from peak market price movements. | **PuLP Linear Programming**: Profit optimization matching harvest timing with top-paying regional APMC mandis. |
| **Connectivity Barriers**: Smartphone apps fail in remote rural fields without 4G/5G data. | **Omnichannel Offline Dispatch**: Direct MQTT hardware control and offline Twilio SMS/Voice advisories in regional languages. |

---

## 🚀 Key Platform Features

- 🔄 **Closed-Loop Autonomous Decision Engine**: Senses field conditions, predicts risks, simulates alternatives, schedules tasks, and executes actions.
- 🌡️ **Micro-Climate & ET₀ Forecasting**: Merges Open-Meteo forecasts with on-field sensor telemetry for 7-day moisture loss calibration.
- 💧 **Smart Fertigation & Drip Solenoid Control**: Computes precise NPK nutrient mixes and triggers MQTT relay solenoid valves.
- 🔬 **Computer Vision Pest Vision Lab**: Segments micro-lesions, quantifies outbreak severity, and checks mathematical spray window constraints (wind drift, rainfall runoff, thermal volatilization, and statutory PHI safety).
- 📈 **PuLP Mandi Profit Optimizer**: Mathematical linear programming model maximizing net farm profit per hectare (up to +65% margin boost).
- 🔄 **Dynamic Crop Rotation & DAG Engine**: Predecessor-successor transition optimization balancing soil nitrogen recovery, water budgets, and land equivalent ratios (LER).
- 📋 **Autonomous Farm Operations Planner**: Converts AI recommendations into executable daily/weekly schedules with rain replanning.
- 📱 **Omnichannel Offline SMS & Voice Inbox**: Delivers clear advisories via Twilio SMS to feature phones in regional languages (English & Hindi).
- 🔐 **Multi-Role Authentication Portal**: Role-tailored access flows for **Progressive Farmers**, **Field Extension Officers**, and **Senior Agronomists**.
- 🧠 **Farm Memory & Seasonal Knowledge Graph**: Persists seasonal field learnings and yield outcomes so each harvest improves AI accuracy.

---

## 📸 Product Screenshots & Visual Walkthrough

### 1. Command Center — Closed-Loop Autonomous Decision Cycle
<p align="center">
  <img src="assets/screenshots/01-command-center.png" alt="AgriPilot Command Center" width="100%"/>
</p>

*The primary dashboard integrating live field telemetry, soil moisture gauges, 72-hour precipitation alerts, PuLP profit optimization graphs, and interactive execution plans.*

---

### 2. Mandi Profit Optimizer — APMC Market Intelligence
<p align="center">
  <img src="assets/screenshots/02-mandi-profit-optimizer.png" alt="Mandi Profit Optimizer" width="100%"/>
</p>

*30-day commodity price forecasting, regional APMC mandi payout comparisons (Indore, Khanna, Nashik), and linear programming profit optimization.*

---

### 3. Crop Lifecycle & Monthly Care Roadmap
<p align="center">
  <img src="assets/screenshots/03-crop-lifecycle.png" alt="Crop Lifecycle Dashboard" width="100%"/>
</p>

*Growth-stage tracking for crops from sowing to maturity, with DAS counters, stage-wise agronomic care checklists, and dynamic care intelligence.*

---

### 4. Pest Vision Lab — Computer Vision & Spray Solver
<p align="center">
  <img src="assets/screenshots/04-pest-vision-lab.png" alt="Pest Vision Lab" width="100%"/>
</p>

*Drone and smartphone leaf pathology inspection with micro-lesion segmentation, infection risk index, and mathematical spray safety constraint solver.*

---

### 5. Multi-Role Portal Login — Farmers, Extension Officers & Agronomists
<p align="center">
  <img src="assets/screenshots/05-login-portal.png" alt="AgriPilot Login Portal" width="100%"/>
</p>

*Role-based authentication portal supporting Mobile OTP and Kisan ID login for Farmers, Field Extension Officers (KVK), and Senior Agronomists (ICAR).*

---

## 🏗️ System Architecture

```
                               ┌─────────────────────────┐
                               │   IoT Soil Sensors      │
                               │   Open-Meteo Satellite  │
                               │   Drone/Phone Imagery   │
                               │   APMC Mandi Price APIs │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │ Risk Detection & Closed │
                               │   Loop Decision Engine  │
                               └────────────┬────────────┘
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     ▼                                             ▼
       ┌───────────────────────────┐                 ┌───────────────────────────┐
       │ Specialist Agent Network  │                 │    Farm Digital Twin      │
       │ (Weather, Soil, Pest,     │                 │   What-If Simulation      │
       │  Market, Machinery)       │                 │   Constraint Solver       │
       └─────────────┬─────────────┘                 └─────────────┬─────────────┘
                     │                                             │
                     └──────────────────────┬──────────────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │ Autonomous Operations   │
                               │    Schedule Planner     │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │ Execution Orchestrator  │
                               └────────────┬────────────┘
                                            │
         ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
         ▼                  ▼                               ▼                  ▼
  ┌──────────────┐   ┌──────────────┐              ┌────────────────┐  ┌──────────────┐
  │ MQTT Relay   │   │  Twilio SMS  │              │ Web Dashboard  │  │ Agronomist   │
  │ Hardware     │   │  / Voice     │              │ (Extension)    │  │ Escalation   │
  └──────────────┘   └──────────────┘              └────────────────┘  └──────────────┘
         │                  │                               │                  │
         └──────────────────┴───────────────┬───────────────┴──────────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │ Seasonal Knowledge      │
                               │ Graph (Farm Memory)     │
                               └─────────────────────────┘
```

---

## 💻 Tech Stack

### Frontend Architecture
- **Framework**: React 19 + Vite 5
- **UI & Styling**: Vanilla CSS with glassmorphism design tokens, dark mode, and dynamic animations
- **Iconography**: Lucide React
- **Internationalization**: Bilingual (English & हिन्दी) with seamless real-time switching

### Backend Architecture
- **API Framework**: FastAPI 0.110 (Python 3.12)
- **Optimization Engine**: PuLP Linear Programming Solver
- **Computer Vision Pipeline**: PIL + NumPy leaf pathology micro-lesion segmentation
- **Telemetry & Protocols**: WebSockets (`/ws/telemetry`), REST APIs, MQTT simulation payloads
- **SMS Gateway**: Twilio REST API + Fast2SMS Gateway integration

---

## 🛠️ Getting Started & Installation

### Prerequisites
- **Python**: Version 3.10+ (Python 3.12 recommended)
- **Node.js**: Version 18.0+ & npm

### 1. Clone the Repository
```bash
git clone https://github.com/Bansi109/AgriPilot.git
cd AgriPilot
```

### 2. Set Up & Run Backend Server
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install fastapi uvicorn pulp pillow numpy twilio

# Start FastAPI server
python main.py
```
*Backend API server will start at `http://127.0.0.1:8000` with interactive docs at `http://127.0.0.1:8000/docs`.*

### 3. Set Up & Run Frontend Application
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Launch Vite dev server
npm run dev
```
*Frontend application will start at `http://localhost:5173`.*

---

## 📡 Key API Endpoints Summary

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/cycle/run` | Triggers complete closed-loop autonomous decision cycle |
| `GET` | `/api/weather/current` | Fetches micro-climate forecast & Penman-Monteith ET₀ |
| `POST` | `/api/soil/evaluate` | Evaluates NPK soil levels and returns fertigation recipes |
| `POST` | `/api/pest/analyze` | Analyzes leaf image / preset for pathology and spray safety window |
| `GET` | `/api/profit/optimize` | Runs PuLP linear programming optimization for APMC prices |
| `GET` | `/api/farm-to-market` | Evaluates harvest readiness, APMC payouts, and logistics transport |
| `POST` | `/api/omnichannel/iot-command` | Dispatches MQTT hardware relay command to solenoid valves |
| `POST` | `/api/omnichannel/sms-alert` | Dispatches offline SMS advisory via cellular gateway |
| `GET` | `/api/omnichannel/logs` | Fetches live omnichannel dispatch logs and escalation queue |
| `POST` | `/api/auth/verify-otp` | Authenticates OTP for Farmers, Extension Officers, and Agronomists |
| `WS` | `/ws/telemetry` | WebSocket stream broadcasting real-time field telemetry |

---

## 📂 Project Structure

```
AgriPilot/
├── assets/
│   ├── agripilot-logo.png
│   └── screenshots/
│       ├── 01-command-center.png
│       ├── 02-mandi-profit-optimizer.png
│       ├── 03-crop-lifecycle.png
│       ├── 04-pest-vision-lab.png
│       └── 05-login-portal.png
├── backend/
│   ├── main.py                     # FastAPI main application server & routing
│   ├── agents/                     # Multi-Agent decision & planning agents
│   └── modules/                    # Specialized domain engines:
│       ├── auth_service.py         # OTP & contact authentication
│       ├── pest_vision_pipeline.py # Leaf computer vision & spray solver
│       ├── omnichannel_dispatcher.py # MQTT hardware & SMS dispatcher
│       ├── profit_optimizer.py     # PuLP profit optimization solver
│       ├── crop_rotation_engine.py # DAG succession & intercropping
│       ├── farm_to_market.py       # Harvest & APMC logistics coordinator
│       └── weather_service.py      # Open-Meteo & micro-climate engine
└── frontend/
    ├── src/
    │   ├── App.jsx                 # Primary layout & tab navigation orchestrator
    │   ├── components/             # Feature UI components
    │   │   ├── HomePage.jsx        # Landing page & feature showcase
    │   │   ├── LoginPage.jsx       # Multi-role authentication portal
    │   │   ├── OverviewDashboard.jsx # Command Center & Closed-Loop Engine
    │   │   ├── PestVisionLab.jsx   # Vision pathology lab & spray solver
    │   │   ├── OmnichannelSimulator.jsx # IoT MQTT & SMS dispatch feed
    │   │   ├── FarmToMarketView.jsx # Logistics & Mandi optimization
    │   │   └── ...                 # Additional feature components
    │   └── i18n/
    │       └── translations.js     # Bilingual translation dictionary (EN & HI)
    ├── package.json
    └── vite.config.js
```

---

## 📜 License

This project is open-source and released under the [MIT License](LICENSE).

---

<p align="center">
  <b>Built for Indian Agriculture 🇮🇳 • Powered by Open-Meteo & PuLP Optimization</b>
</p>
