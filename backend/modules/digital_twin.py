"""
AgriPilot - Farm Digital Twin & What-If Simulation Engine (Module 6.4.7)
Implements:
1. High-fidelity virtual representation of the farmer's fields (moisture, NPK, pH, EC, canopy, weather, history).
2. What-If Simulation Engine evaluating alternative actions prior to execution.
3. Multi-dimensional tradeoff metrics: Crop Health, Water Consumption, Operational Cost, Yield Impact, Net Profit, and Risk Index.
"""

from typing import Dict, Any, List
import copy

# Field virtual state templates
INITIAL_FIELDS = [
    {
        "field_id": "FIELD-NORTH-01",
        "name": "North Plot — Alpha Ridge",
        "area_ha": 2.4,
        "soil_type": "Clay Loam",
        "crop": "Wheat",
        "variety": "HD-3086 (Pusa Gautami)",
        "sowing_date": "2026-08-05",
        "current_stage": "Vegetative (Tillering)",
        "days_after_sowing": 45,
        "soil_moisture_pct": 52.4,
        "soil_n_mg_kg": 154.0,
        "soil_p_mg_kg": 28.5,
        "soil_k_mg_kg": 210.0,
        "soil_ph": 7.2,
        "soil_ec_ds_m": 1.15,
        "canopy_cover_pct": 68.0,
        "valve_id": "VALVE-N1-01",
        "pump_status": "STANDBY",
        "last_irrigation_date": "2026-09-12",
        "water_consumed_this_season_m3": 820.0,
        "active_pest_status": "Yellow Rust Focus (Early Spores)",
        "health_score": 86.0
    },
    {
        "field_id": "FIELD-SOUTH-02",
        "name": "South Plot — Delta Basin",
        "area_ha": 1.8,
        "soil_type": "Sandy Loam",
        "crop": "Chickpea",
        "variety": "JG-11 (Desi Pulse)",
        "sowing_date": "2026-08-10",
        "current_stage": "Vegetative Branching",
        "days_after_sowing": 40,
        "soil_moisture_pct": 38.2,
        "soil_n_mg_kg": 95.0,
        "soil_p_mg_kg": 42.0,
        "soil_k_mg_kg": 220.0,
        "soil_ph": 7.4,
        "soil_ec_ds_m": 0.95,
        "canopy_cover_pct": 54.0,
        "valve_id": "VALVE-S2-02",
        "pump_status": "STANDBY",
        "last_irrigation_date": "2026-09-08",
        "water_consumed_this_season_m3": 410.0,
        "active_pest_status": "Clean (No visual lesions)",
        "health_score": 92.0
    },
    {
        "field_id": "FIELD-EAST-03",
        "name": "East Terraced Orchard — Zone 3",
        "area_ha": 3.0,
        "soil_type": "Loam",
        "crop": "Cotton",
        "variety": "Bt-Cotton RCH-659",
        "sowing_date": "2026-07-20",
        "current_stage": "Square Formation",
        "days_after_sowing": 61,
        "soil_moisture_pct": 58.0,
        "soil_n_mg_kg": 185.0,
        "soil_p_mg_kg": 36.0,
        "soil_k_mg_kg": 270.0,
        "soil_ph": 6.8,
        "soil_ec_ds_m": 1.30,
        "canopy_cover_pct": 74.0,
        "valve_id": "VALVE-E3-03",
        "pump_status": "STANDBY",
        "last_irrigation_date": "2026-09-14",
        "water_consumed_this_season_m3": 1350.0,
        "active_pest_status": "Thrips Warning on perimeter rows",
        "health_score": 88.0
    }
]

class FarmDigitalTwin:
    def __init__(self):
        self.fields = copy.deepcopy(INITIAL_FIELDS)

    def get_all_fields(self) -> List[Dict[str, Any]]:
        return self.fields

    def get_field_by_id(self, field_id: str) -> Optional[Dict[str, Any]]:
        for f in self.fields:
            if f["field_id"] == field_id:
                return f
        return self.fields[0]

    def update_field_telemetry(self, field_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        field = self.get_field_by_id(field_id)
        if field:
            field.update(updates)
            return field
        return {}

    def run_what_if_simulation(
        self,
        field_id: str,
        scenario_type: str = "irrigation",
        incoming_rain_mm_72h: float = 18.0
    ) -> Dict[str, Any]:
        """
        Simulates alternative future actions on the field's digital twin:
        1. Irrigation Scenario: "Irrigate Now (25mm)" vs "Delay 36h (Incoming Rain)"
        2. Fertigation Scenario: "Uniform Surface Dosing" vs "AI Precision Variable Split"
        3. Harvest Scenario: "Harvest Immediately" vs "Wait 10 Days for Mandi Spike"
        """
        field = self.get_field_by_id(field_id)
        field_area = field["area_ha"]
        curr_moisture = field["soil_moisture_pct"]

        if scenario_type == "irrigation":
            # Option A: Irrigate immediately (25mm)
            water_used_a = round(25.0 * 10.0 * field_area * 1000.0)  # Liters
            cost_a_inr = round(field_area * 650.0)  # Electricity and pump wear
            projected_moisture_a = min(85.0, curr_moisture + 28.0)
            health_a = 92.0
            # If 18mm rain arrives after 25mm irrigation -> waterlogging risk!
            post_rain_moisture_a = projected_moisture_a + (incoming_rain_mm_72h * 1.1)
            risk_a = 74.0 if post_rain_moisture_a > 88.0 else 25.0
            yield_impact_a = -4.5 if risk_a > 60 else +1.5

            # Option B: Delay 36 hours and rely on predicted rainfall (18mm)
            water_used_b = 0  # Conserves fresh water!
            cost_b_inr = 0
            # Natural depletion over 36h is ~6%
            pre_rain_moisture_b = max(28.0, curr_moisture - 6.0)
            post_rain_moisture_b = min(78.0, pre_rain_moisture_b + (incoming_rain_mm_72h * 1.1))
            health_b = 94.0
            risk_b = 18.0
            yield_impact_b = +3.0

            recommendation = (
                "STRONGLY RECOMMEND OPTION B (DELAY IRRIGATION): "
                f"Saves {water_used_a:,} Liters of groundwater and ₹{cost_a_inr:,} in pumping costs. "
                "Prevents root hypoxia/waterlogging from overlapping irrigation and natural rain."
            )

            return {
                "field_id": field["field_id"],
                "field_name": field["name"],
                "scenario_title": "Irrigation Timing vs 72h Micro-Climate Rainfall",
                "weather_context": f"{incoming_rain_mm_72h:.1f} mm rain forecast in next 72 hours",
                "option_a": {
                    "label": "Option A: Irrigate Now (25mm pulse)",
                    "water_consumed_liters": water_used_a,
                    "operational_cost_inr": cost_a_inr,
                    "projected_soil_moisture_pct": round(post_rain_moisture_a, 1),
                    "crop_health_score": health_a,
                    "yield_impact_pct": yield_impact_a,
                    "risk_index": risk_a,
                    "risk_notes": "High waterlogging & root rot hazard when predicted rain combines with irrigated profile."
                },
                "option_b": {
                    "label": "Option B: Delay Irrigation (Rely on 18mm rain)",
                    "water_consumed_liters": water_used_b,
                    "operational_cost_inr": cost_b_inr,
                    "projected_soil_moisture_pct": round(post_rain_moisture_b, 1),
                    "crop_health_score": health_b,
                    "yield_impact_pct": yield_impact_b,
                    "risk_index": risk_b,
                    "risk_notes": "Minimal risk. Soil stays safely in optimal aeration range (55-75% moisture)."
                },
                "water_saved_liters": water_used_a,
                "cost_saved_inr": cost_a_inr,
                "ai_decision": "Option B (Delay Irrigation)",
                "explanation": recommendation
            }

        elif scenario_type == "fertigation":
            # Option A: Standard bulk urea broadcast
            cost_a = round(field_area * 1850.0)
            health_a = 78.0
            risk_a = 45.0  # Leaching and volatilization risk
            yield_a = +2.0

            # Option B: Variable-rate precision fertigation split via drip
            cost_b = round(field_area * 1350.0)  # 27% fertilizer cost savings
            health_b = 95.0
            risk_b = 12.0
            yield_b = +8.5

            return {
                "field_id": field["field_id"],
                "field_name": field["name"],
                "scenario_title": "Fertilizer Application Strategy: Broadcast vs Variable-Rate Drip",
                "weather_context": "Vegetative Growth Phase — High Nitrogen & Potassium Uptake",
                "option_a": {
                    "label": "Option A: Conventional Broadcast (100 kg/ha Urea)",
                    "water_consumed_liters": 0,
                    "operational_cost_inr": cost_a,
                    "projected_soil_moisture_pct": curr_moisture,
                    "crop_health_score": health_a,
                    "yield_impact_pct": yield_a,
                    "risk_index": risk_a,
                    "risk_notes": "Up to 35% nitrogen lost via ammonia volatilization and nitrate leaching into groundwater."
                },
                "option_b": {
                    "label": "Option B: Precision Variable-Rate Drip Injection",
                    "water_consumed_liters": 2500,
                    "operational_cost_inr": cost_b,
                    "projected_soil_moisture_pct": round(curr_moisture + 4.0, 1),
                    "crop_health_score": health_b,
                    "yield_impact_pct": yield_b,
                    "risk_index": risk_b,
                    "risk_notes": "Zero leaching. 92% fertilizer use efficiency (FUE) directly into active root zone."
                },
                "water_saved_liters": 0,
                "cost_saved_inr": cost_a - cost_b,
                "ai_decision": "Option B (Precision Variable-Rate)",
                "explanation": "RECOMMEND OPTION B: Saves ₹500/ha in chemical fertilizer costs while boosting expected yield by +6.5%."
            }

        else:  # harvest timing
            price_today = 2420.0
            price_peak = 2580.0
            tonnage = field_area * 4.5 * 10.0  # quintals
            rev_a = round(tonnage * price_today)
            rev_b = round(tonnage * 1.02 * price_peak)  # 2% weight gain + higher price

            return {
                "field_id": field["field_id"],
                "field_name": field["name"],
                "scenario_title": "Harvest Scheduling: Early Harvest vs Peak Mandi Window",
                "weather_context": "Grain filling complete; Mandi arrivals expected to drop next week.",
                "option_a": {
                    "label": "Option A: Harvest Immediately at Day 110",
                    "water_consumed_liters": 0,
                    "operational_cost_inr": round(field_area * 3200),
                    "projected_soil_moisture_pct": 40.0,
                    "crop_health_score": 88.0,
                    "yield_impact_pct": 0.0,
                    "risk_index": 20.0,
                    "net_revenue_inr": rev_a,
                    "risk_notes": "Misses peak price window by selling into current market glut."
                },
                "option_b": {
                    "label": "Option B: Hold Harvest 10 Days for Peak Mandi Rate",
                    "water_consumed_liters": 12000,
                    "operational_cost_inr": round(field_area * 3600),
                    "projected_soil_moisture_pct": 32.0,
                    "crop_health_score": 85.0,
                    "yield_impact_pct": +2.0,
                    "risk_index": 35.0,
                    "net_revenue_inr": rev_b,
                    "risk_notes": "Requires monitoring weather for sudden storms; captures ₹160/Qtl price premium."
                },
                "water_saved_liters": 0,
                "cost_saved_inr": 0,
                "revenue_gain_inr": rev_b - rev_a,
                "ai_decision": "Option B (Hold for Peak Window)",
                "explanation": f"RECOMMEND OPTION B: Holding harvest 10 days generates +₹{(rev_b - rev_a):,} additional farm revenue."
            }

digital_twin = FarmDigitalTwin()
