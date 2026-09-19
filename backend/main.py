"""
AgriPilot - Main FastAPI Backend Application
PS-6: Autonomous Farm-to-Field Advisory & Action Orchestration Agents
"""

import os
import sys
from fastapi import FastAPI, UploadFile, File, Form, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import asyncio
import json

# Add backend directory to sys.path so modules and agents import cleanly
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from modules.weather_service import weather_service
from modules.soil_fertigation import soil_fertigation_engine
from modules.crop_rotation_engine import crop_rotation_engine
from modules.pest_vision_pipeline import pest_vision_pipeline
from modules.market_intelligence import market_intelligence_service
from modules.crop_lifecycle import crop_lifecycle_engine
from modules.digital_twin import digital_twin
from modules.crisis_management import crisis_management_system
from modules.operations_planner import operations_planner
from modules.profit_optimizer import profit_optimizer
from modules.farm_to_market import farm_to_market_agent
from modules.knowledge_graph import seasonal_knowledge_graph
from modules.omnichannel_dispatcher import omnichannel_dispatcher
from modules.auth_service import auth_service

from agents.marketplace.specialist_agents import agent_marketplace
from agents.core_orchestrator import core_orchestrator

app = FastAPI(
    title="AgriPilot API",
    description="Autonomous Farm-to-Field Advisory & Action Orchestration Agents (PS-6)",
    version="1.0.0"
)

# Enable CORS for local dev and network clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic request models
class SoilEvalRequest(BaseModel):
    crop: str = "Wheat"
    stage: str = "Vegetative"
    measured_n: float = 154.0
    measured_p: float = 28.5
    measured_k: float = 210.0
    measured_ph: float = 7.2
    measured_ec: float = 1.15
    field_area_ha: float = 2.4

class WhatIfRequest(BaseModel):
    field_id: str = "FIELD-NORTH-01"
    scenario_type: str = "irrigation"  # "irrigation", "fertigation", "harvest"
    incoming_rain_mm_72h: float = 18.0

class DecisionCycleRequest(BaseModel):
    field_id: str = "FIELD-NORTH-01"
    farmer_phone: str = "+91 98765 43210"
    preferred_language: str = "Hindi"

class IoTCommandRequest(BaseModel):
    valve_id: str = "VALVE-N1-01"
    command: str = "VALVE_OPEN"
    duration_minutes: int = 30
    flow_rate_lpm: float = 115.0
    fertigation_channel: str = "A"

class SMSRequest(BaseModel):
    phone_number: str = "+91 98765 43210"
    message_en: str
    message_hi: str
    language_preference: str = "Hindi"

class EscalationReviewRequest(BaseModel):
    escalation_id: str
    approved: bool
    reviewer_name: str = "Dr. R. K. Verma"
    decision_notes: str = ""

class IncidentUpdateRequest(BaseModel):
    incident_id: str
    resolution_status: str
    agronomist_notes: str = ""

class SendOTPRequest(BaseModel):
    phone: str
    role: str = "Farmer"
    language: str = "Hindi"

class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str
    role: Optional[str] = None

# API Endpoints

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "system": "AgriPilot Multi-Agent Decision Engine",
        "active_modules": 13,
        "specialist_agents": 7,
        "mode": "Closed-Loop Autonomous"
    }

# Genuine Authentication Endpoints
@app.post("/api/auth/send-otp")
def send_contact_otp(req: SendOTPRequest):
    result = auth_service.generate_and_send_otp(
        phone=req.phone,
        role=req.role,
        language=req.language
    )
    if not result.get("success"):
        return JSONResponse(status_code=400, content=result)
    return result

@app.post("/api/auth/verify-otp")
def verify_contact_otp(req: VerifyOTPRequest):
    result = auth_service.verify_otp(
        phone=req.phone,
        submitted_otp=req.otp,
        role=req.role
    )
    if not result.get("success"):
        return JSONResponse(status_code=400, content=result)
    return result

@app.get("/api/auth/registered-contacts")
def get_registered_contacts():
    return auth_service.get_registered_contacts()

# 1. Closed-Loop Decision Cycle
@app.post("/api/cycle/run")
def run_closed_loop_cycle(req: DecisionCycleRequest):
    result = core_orchestrator.run_decision_cycle(
        field_id=req.field_id,
        farmer_phone=req.farmer_phone,
        preferred_language=req.preferred_language
    )
    return result

@app.get("/api/cycle/last")
def get_last_cycle():
    if core_orchestrator.last_cycle_result:
        return core_orchestrator.last_cycle_result
    # Run once if none exists
    return core_orchestrator.run_decision_cycle()

# 2. Weather & Micro-climate (6.4.1)
@app.get("/api/weather/current")
def get_weather(lat: float = 28.6139, lon: float = 77.2090):
    return weather_service.fetch_forecast(lat=lat, lon=lon)

# 3. Real-Time Soil Nutrient & Fertigation (6.4.2)
@app.post("/api/soil/evaluate")
def evaluate_soil(req: SoilEvalRequest):
    return soil_fertigation_engine.evaluate_soil_health(
        crop=req.crop,
        stage=req.stage,
        measured_n=req.measured_n,
        measured_p=req.measured_p,
        measured_k=req.measured_k,
        measured_ph=req.measured_ph,
        measured_ec=req.measured_ec,
        field_area_ha=req.field_area_ha
    )

# 4. Dynamic Alternate Cropping & DAG (6.4.3)
@app.get("/api/crop/rotation")
def get_crop_rotation(current_crop: str = "Wheat", water_budget_mm: float = 400.0):
    return crop_rotation_engine.evaluate_rotation_options(
        current_crop=current_crop,
        available_water_budget_mm=water_budget_mm
    )

# 5. Vision-Based Pest Detection (6.4.4)
@app.post("/api/pest/analyze")
async def analyze_pest_image(
    file: Optional[UploadFile] = File(None),
    preset_pathology: Optional[str] = Form(None),
    crop: str = Form("Wheat"),
    ambient_temp_c: float = Form(24.5),
    ambient_rh_pct: float = Form(78.0),
    wind_speed_kmh: float = Form(7.5),
    rain_next_6h_mm: float = Form(0.0),
    days_until_harvest: int = Form(30)
):
    image_bytes = b""
    if file:
        image_bytes = await file.read()
    elif preset_pathology:
        # Generate clean synthetic demonstration image for selected preset
        pil_img = pest_vision_pipeline._generate_demo_leaf(preset_pathology)
        import io
        buf = io.BytesIO()
        pil_img.save(buf, format="JPEG")
        image_bytes = buf.getvalue()

    return pest_vision_pipeline.analyze_image(
        image_bytes=image_bytes,
        crop_hint=crop,
        ambient_temp_c=ambient_temp_c,
        ambient_rh_pct=ambient_rh_pct,
        wind_speed_kmh=wind_speed_kmh,
        rain_next_6h_mm=rain_next_6h_mm,
        days_until_harvest=days_until_harvest
    )

# 6. Market Intelligence & Mandi Harvest Timing (6.4.5)
@app.get("/api/market/analysis")
def get_market_analysis(crop: str = "Wheat", maturity_pct: float = 85.0):
    return market_intelligence_service.get_market_analysis(crop=crop, crop_maturity_pct=maturity_pct)

# 7. Crop Lifecycle Roadmap & Switcher (6.4.6)
@app.get("/api/crop/lifecycle")
def get_crop_lifecycle(crop: str = "Wheat", sowing_date: Optional[str] = None, soil_moisture: float = 52.4):
    return crop_lifecycle_engine.get_lifecycle_roadmap(
        crop=crop,
        sowing_date_str=sowing_date,
        current_soil_moisture=soil_moisture
    )

# 8. Farm Digital Twin & What-If Simulator (6.4.7)
@app.get("/api/twin/fields")
def get_twin_fields():
    return digital_twin.get_all_fields()

@app.post("/api/twin/what-if")
def simulate_what_if(req: WhatIfRequest):
    return digital_twin.run_what_if_simulation(
        field_id=req.field_id,
        scenario_type=req.scenario_type,
        incoming_rain_mm_72h=req.incoming_rain_mm_72h
    )

# 9. Specialist Agent Marketplace (6.4.8)
@app.get("/api/marketplace/status")
def get_marketplace_status():
    field = digital_twin.get_all_fields()[0]
    return agent_marketplace.run_all(field)

# 10. Farm Crisis Response & Incident Management (6.4.9)
@app.get("/api/crisis/incidents")
def get_incidents():
    return crisis_management_system.get_all_incidents()

@app.post("/api/crisis/update")
def update_incident(req: IncidentUpdateRequest):
    res = crisis_management_system.update_incident_status(
        incident_id=req.incident_id,
        resolution_status=req.resolution_status,
        agronomist_notes=req.agronomist_notes
    )
    return res or {"error": "Incident not found"}

# 11. Autonomous Operations Planner (6.4.10)
@app.get("/api/operations/schedule")
def get_operations_schedule():
    return operations_planner.get_schedule()

@app.post("/api/operations/replan-rain")
def replan_for_rain(rain_mm: float = 18.0):
    return operations_planner.trigger_rain_replan(rain_event_mm=rain_mm)

# 12. Farm Profit Optimization (6.4.11)
@app.get("/api/profit/optimize")
def get_profit_optimization(crop: str = "Wheat", area_ha: float = 2.4, price_inr: float = 2450.0):
    return profit_optimizer.optimize_farm_economics(
        crop=crop,
        field_area_ha=area_ha,
        target_mandi_price_inr_qtl=price_inr
    )

# 13. Farm-to-Market Logistics (6.4.12)
@app.get("/api/farm-to-market")
def get_farm_to_market(crop: str = "Wheat", maturity_pct: float = 95.0):
    return farm_to_market_agent.evaluate_harvest_and_logistics(
        crop=crop,
        field_id="FIELD-NORTH-01",
        field_area_ha=2.4,
        maturity_pct=maturity_pct
    )

# 14. Farm Memory & Seasonal Knowledge Graph (6.4.13)
@app.get("/api/knowledge-graph")
def get_knowledge_graph():
    return seasonal_knowledge_graph.get_graph_data()

# 15. Omnichannel & Hardware Controls (6.5 & 6.6)
@app.post("/api/omnichannel/iot-command")
def send_iot_command(req: IoTCommandRequest):
    return omnichannel_dispatcher.send_iot_relay_command(
        valve_id=req.valve_id,
        command=req.command,
        duration_minutes=req.duration_minutes,
        flow_rate_lpm=req.flow_rate_lpm,
        fertigation_channel=req.fertigation_channel
    )

@app.post("/api/omnichannel/sms-alert")
def send_sms_alert(req: SMSRequest):
    return omnichannel_dispatcher.dispatch_sms_alert(
        phone_number=req.phone_number,
        message_en=req.message_en,
        message_hi=req.message_hi,
        language_preference=req.language_preference
    )

@app.get("/api/omnichannel/logs")
def get_omnichannel_logs():
    return {
        "dispatch_log": omnichannel_dispatcher.get_dispatch_log(),
        "escalation_queue": omnichannel_dispatcher.get_escalation_queue()
    }

@app.post("/api/omnichannel/review-escalation")
def review_escalation(req: EscalationReviewRequest):
    res = omnichannel_dispatcher.review_escalation(
        escalation_id=req.escalation_id,
        approved=req.approved,
        reviewer_name=req.reviewer_name,
        decision_notes=req.decision_notes
    )
    return res or {"error": "Escalation not found"}

# WebSocket for live sensor telemetry stream
@app.websocket("/ws/telemetry")
async def websocket_telemetry_stream(websocket: WebSocket):
    await websocket.accept()
    step = 0
    try:
        while True:
            step += 1
            # Send live telemetry updates every 3 seconds
            payload = {
                "step": step,
                "timestamp": asyncio.get_event_loop().time(),
                "field_id": "FIELD-NORTH-01",
                "soil_moisture_pct": round(52.4 + (0.5 * (step % 5)), 1),
                "soil_temp_c": round(24.2 + (0.2 * (step % 3)), 1),
                "soil_ec_ds_m": 1.15,
                "battery_solar_pct": 94,
                "valve_status": "STANDBY",
                "system_status": "Closed-Loop Sense Active"
            }
            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(3.0)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
