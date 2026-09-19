"""
AgriPilot - Adaptive Farm Agent Marketplace (Module 6.4.8)
Implements 7 dynamic specialist agents coordinated on-demand:
1. Weather Agent
2. Soil Agent
3. Crop Health Agent
4. Pest Agent
5. Market Agent
6. Machinery Agent
7. Labor Agent
"""

from typing import Dict, Any, List
from datetime import datetime
from modules.weather_service import weather_service
from modules.soil_fertigation import soil_fertigation_engine
from modules.pest_vision_pipeline import pest_vision_pipeline
from modules.market_intelligence import market_intelligence_service

class WeatherAgent:
    def __init__(self):
        self.name = "Weather Agent"
        self.category = "Environmental Intelligence"
        self.status = "Active"
        self.version = "2.4"

    def run(self, lat: float = 28.6139, lon: float = 77.2090) -> Dict[str, Any]:
        forecast = weather_service.fetch_forecast(lat, lon)
        curr = forecast.get("current", {})
        et0 = curr.get("et0_penman_monteith_mm_day", 4.2)
        rain_72h = forecast.get("next_72h_rain_mm", 0.0)

        risk_level = "High" if rain_72h >= 15.0 else ("Moderate" if et0 > 6.0 else "Normal")
        summary = (
            f"Current ET0 is {et0:.2f} mm/day. Upcoming 72h rain is {rain_72h:.1f} mm. "
            f"Irrigation advice: {forecast.get('irrigation_advice')}."
        )

        return {
            "agent": self.name,
            "status": "Success",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "risk_level": risk_level,
            "summary": summary,
            "metrics": {
                "et0_mm_day": et0,
                "temp_c": curr.get("temperature_c"),
                "humidity_pct": curr.get("humidity_percent"),
                "wind_kmh": curr.get("wind_speed_kmh"),
                "rain_72h_mm": rain_72h,
                "rain_alert_72h": forecast.get("rain_alert_72h", False)
            },
            "raw_data": forecast
        }

class SoilAgent:
    def __init__(self):
        self.name = "Soil Agent"
        self.category = "Nutrient & Moisture"
        self.status = "Active"
        self.version = "2.1"

    def run(self, crop: str = "Wheat", stage: str = "Vegetative", n: float = 154.0, p: float = 28.5, k: float = 210.0, ph: float = 7.2, ec: float = 1.15, area_ha: float = 2.4) -> Dict[str, Any]:
        eval_result = soil_fertigation_engine.evaluate_soil_health(
            crop=crop, stage=stage, measured_n=n, measured_p=p, measured_k=k,
            measured_ph=ph, measured_ec=ec, field_area_ha=area_ha
        )
        health = eval_result["soil_health_score"]
        rx = eval_result["prescription"]

        summary = (
            f"Soil Health Score: {health}/100. N: {eval_result['status']['N']}, P: {eval_result['status']['P']}, K: {eval_result['status']['K']}. "
            f"Prescription requires {rx['N_rate_kg_ha']} kg/ha N and {rx['K2O_rate_kg_ha']} kg/ha K2O via drip injection."
        )

        return {
            "agent": self.name,
            "status": "Success",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "risk_level": "Warning" if health < 70 else "Normal",
            "summary": summary,
            "metrics": {
                "soil_health_score": health,
                "n_status": eval_result["status"]["N"],
                "ph_status": eval_result["status"]["pH"],
                "carrier_water_liters": rx["carrier_water_liters"],
                "injection_duration_min": rx["drip_injection_minutes"]
            },
            "raw_data": eval_result
        }

class CropHealthAgent:
    def __init__(self):
        self.name = "Crop Health Agent"
        self.category = "Physiological Growth"
        self.status = "Active"
        self.version = "2.0"

    def run(self, crop: str = "Wheat", days_after_sowing: int = 45, canopy_cover_pct: float = 68.0, moisture_pct: float = 52.4) -> Dict[str, Any]:
        # Evaluates physiological development and canopy stress
        expected_canopy = min(90.0, days_after_sowing * 1.5)
        canopy_stress = canopy_cover_pct < (expected_canopy * 0.8)
        water_stress = moisture_pct < 40.0

        if water_stress:
            status_verdict = "Water Stress: Stomata closure impeding photosynthesis."
            risk_level = "High"
        elif canopy_stress:
            status_verdict = "Canopy lag: Vegetative biomass below target for stage."
            risk_level = "Warning"
        else:
            status_verdict = "Vigorous Vegetative Tillering; optimal chlorophyll density."
            risk_level = "Normal"

        summary = f"Crop {crop} at Day {days_after_sowing}. Canopy Cover: {canopy_cover_pct:.1f}% (Target ~{expected_canopy:.0f}%). {status_verdict}"

        return {
            "agent": self.name,
            "status": "Success",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "risk_level": risk_level,
            "summary": summary,
            "metrics": {
                "days_after_sowing": days_after_sowing,
                "canopy_cover_pct": canopy_cover_pct,
                "expected_canopy_pct": expected_canopy,
                "water_stress_detected": water_stress,
                "biomass_index": round(canopy_cover_pct / max(1.0, expected_canopy), 2)
            }
        }

class PestAgent:
    def __init__(self):
        self.name = "Pest Agent"
        self.category = "Bio-Security & Vision"
        self.status = "Active"
        self.version = "3.2"

    def run(self, crop: str = "Wheat", temp_c: float = 19.5, rh_pct: float = 82.0, wind_kmh: float = 6.8, rain_6h: float = 0.0) -> Dict[str, Any]:
        # Micro-climate spore risk check
        # High RH (>80%) + cool temp (15-22°C) is prime for Yellow Rust sporulation
        high_rust_risk = (rh_pct >= 80.0 and 10.0 <= temp_c <= 22.0)
        risk_level = "Critical" if high_rust_risk else "Normal"

        spray_check = pest_vision_pipeline.solve_spray_window(
            diagnosis_key="Yellow_Rust" if high_rust_risk else "Healthy",
            wind_speed_kmh=wind_kmh,
            rain_next_6h_mm=rain_6h,
            ambient_temp_c=temp_c,
            days_until_harvest=45
        )

        summary = (
            f"Fungal infection risk is {('CRITICAL (88/100)' if high_rust_risk else 'LOW (22/100)')}. "
            f"Spray window status: {spray_check['overall_status']}."
        )

        return {
            "agent": self.name,
            "status": "Success",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "risk_level": risk_level,
            "summary": summary,
            "metrics": {
                "fungal_infection_risk": 88 if high_rust_risk else 22,
                "can_spray_now": spray_check["can_spray_now"],
                "recommended_slot": spray_check["recommended_time_slot"],
                "ambient_rh_pct": rh_pct,
                "ambient_temp_c": temp_c
            },
            "raw_data": spray_check
        }

class MarketAgent:
    def __init__(self):
        self.name = "Market Agent"
        self.category = "Economic Intelligence"
        self.status = "Active"
        self.version = "2.3"

    def run(self, crop: str = "Wheat", maturity_pct: float = 85.0) -> Dict[str, Any]:
        analysis = market_intelligence_service.get_market_analysis(crop=crop, crop_maturity_pct=maturity_pct)
        modal_price = analysis["current_modal_price"]
        msp = analysis["msp"]
        advice = analysis["harvest_timing_advice"]

        summary = (
            f"Modal APMC Price: ₹{modal_price:.0f}/Qtl (MSP: ₹{msp:.0f}). "
            f"Trend: {analysis['projected_trend']}. Advice: {advice['decision']}."
        )

        return {
            "agent": self.name,
            "status": "Success",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "risk_level": "Warning" if "Bearish" in analysis["projected_trend"] else "Normal",
            "summary": summary,
            "metrics": {
                "modal_price_inr_qtl": modal_price,
                "msp_inr_qtl": msp,
                "margin_over_msp": modal_price - msp,
                "daily_arrivals_mt": analysis["daily_arrivals_mt"],
                "peak_projected_day": analysis["peak_price_window"]["day"],
                "peak_projected_price": analysis["peak_price_window"]["projected_price"]
            },
            "raw_data": analysis
        }

class MachineryAgent:
    def __init__(self):
        self.name = "Machinery Agent"
        self.category = "Asset & Automation"
        self.status = "Active"
        self.version = "1.8"

    def run(self) -> Dict[str, Any]:
        fleet = [
            {"equipment": "Solar Drip Pump P-01 (10 HP)", "status": "Operational", "pressure_bar": 2.4, "battery_pct": 94},
            {"equipment": "Smart Drip Valve VALVE-N1-01", "status": "Ready", "last_pulse_min": 45, "signal_rssi": -62},
            {"equipment": "Battery Backpack Sprayer #2", "status": "Ready", "battery_pct": 100, "tank_capacity_l": 16},
            {"equipment": "Combine Harvester (John Deere W70)", "status": "Scheduled for Day 115", "fuel_pct": 85}
        ]
        return {
            "agent": self.name,
            "status": "Success",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "risk_level": "Normal",
            "summary": "All 4 critical machinery units operational. Solar pump battery at 94%. Solenoid valves calibrated.",
            "fleet_status": fleet
        }

class LaborAgent:
    def __init__(self):
        self.name = "Labor Agent"
        self.category = "Human Workforce"
        self.status = "Active"
        self.version = "1.6"

    def run(self) -> Dict[str, Any]:
        workforce = [
            {"worker": "Ramesh Kumar", "role": "Lead Irrigation Tech", "shift": "Morning (06:00 - 14:00)", "assigned_tasks": 2, "status": "On-Duty"},
            {"worker": "Suresh Patel", "role": "Sprayer Operator", "shift": "Dawn / Morning (06:30 - 11:30)", "assigned_tasks": 1, "status": "On-Duty"},
            {"worker": "Pooja Devi & Team", "role": "Canopy & Weeding Crew (3)", "shift": "Morning (08:00 - 12:00)", "assigned_tasks": 1, "status": "Assigned"},
            {"worker": "Anil Singh", "role": "Mechanic & Diagnostics", "shift": "Full Shift (09:00 - 17:00)", "assigned_tasks": 1, "status": "Available"}
        ]
        return {
            "agent": self.name,
            "status": "Success",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "risk_level": "Normal",
            "summary": "Workforce capacity: 6 operators available. Peak labor allocated to dawn spray window and CRI fertigation.",
            "workforce_status": workforce
        }

class AdaptiveAgentMarketplace:
    def __init__(self):
        self.weather_agent = WeatherAgent()
        self.soil_agent = SoilAgent()
        self.crop_health_agent = CropHealthAgent()
        self.pest_agent = PestAgent()
        self.market_agent = MarketAgent()
        self.machinery_agent = MachineryAgent()
        self.labor_agent = LaborAgent()

    def run_all(self, field_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Runs all 7 specialist agents and returns their aggregated state."""
        fd = field_data or {}
        crop = fd.get("crop", "Wheat")
        area = fd.get("area_ha", 2.4)
        n = fd.get("soil_n_mg_kg", 154.0)
        p = fd.get("soil_p_mg_kg", 28.5)
        k = fd.get("soil_k_mg_kg", 210.0)
        ph = fd.get("soil_ph", 7.2)
        ec = fd.get("soil_ec_ds_m", 1.15)
        moisture = fd.get("soil_moisture_pct", 52.4)
        canopy = fd.get("canopy_cover_pct", 68.0)
        das = fd.get("days_after_sowing", 45)

        w_res = self.weather_agent.run()
        s_res = self.soil_agent.run(crop=crop, n=n, p=p, k=k, ph=ph, ec=ec, area_ha=area)
        c_res = self.crop_health_agent.run(crop=crop, days_after_sowing=das, canopy_cover_pct=canopy, moisture_pct=moisture)
        p_res = self.pest_agent.run(crop=crop)
        m_res = self.market_agent.run(crop=crop)
        mac_res = self.machinery_agent.run()
        l_res = self.labor_agent.run()

        agents_list = [w_res, s_res, c_res, p_res, m_res, mac_res, l_res]
        has_critical = any(a.get("risk_level") == "Critical" for a in agents_list)
        has_warning = any(a.get("risk_level") in ["High", "Warning"] for a in agents_list)

        overall_status = "Critical Attention Required" if has_critical else ("Active Monitoring" if has_warning else "All Systems Optimal")

        return {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "total_specialist_agents": 7,
            "active_agents_count": 7,
            "overall_status": overall_status,
            "agents": {
                "weather": w_res,
                "soil": s_res,
                "crop_health": c_res,
                "pest": p_res,
                "market": m_res,
                "machinery": mac_res,
                "labor": l_res
            }
        }

agent_marketplace = AdaptiveAgentMarketplace()
