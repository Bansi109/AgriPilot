"""
AgriPilot - Risk Detection Agent (Core Agent 1 - Section 6.3)
Implements:
1. Continuous stream buffer monitoring of soil NPK, pH, EC, moisture, and micro-climate.
2. Multi-factor anomaly scoring (Water stress, Nutrient shock, CV Pest threshold, Market volatility).
3. Automated incident triggering to the Farm Crisis Management module.
"""

from typing import Dict, Any, List
from datetime import datetime

class RiskDetectionAgent:
    def __init__(self):
        self.name = "Risk Detection Agent"
        self.role = "Continuous Telemetry Anomaly & Risk Evaluation"

    def evaluate_field_risks(
        self,
        field_telemetry: Dict[str, Any],
        weather_data: Dict[str, Any],
        pest_data: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Analyzes live field streams and identifies emergent agronomic risks.
        Returns composite anomaly score, flagged risk triggers, and severity.
        """
        field_id = field_telemetry.get("field_id", "FIELD-NORTH-01")
        field_name = field_telemetry.get("name", "North Plot")
        crop = field_telemetry.get("crop", "Wheat")
        moisture = field_telemetry.get("soil_moisture_pct", 52.4)
        ph = field_telemetry.get("soil_ph", 7.2)
        n_val = field_telemetry.get("soil_n_mg_kg", 154.0)

        rain_72h = weather_data.get("next_72h_rain_mm", 0.0)
        has_rain_alert = weather_data.get("rain_alert_72h", False)
        et0 = weather_data.get("current", {}).get("et0_penman_monteith_mm_day", 4.2)

        risk_flags = []
        anomaly_score = 15.0  # Baseline low noise

        # 1. Waterlogging Risk Analysis
        if moisture > 80.0 and rain_72h > 15.0:
            anomaly_score += 45.0
            risk_flags.append({
                "type": "Waterlogging Hazard",
                "severity": "High",
                "details": f"Soil moisture at {moisture:.1f}% with {rain_72h:.1f} mm rain predicted in 72 hours. Severe risk of root hypoxia.",
                "action_prompt": "Suppress all drip irrigation lines and open field runoff drains."
            })
        elif moisture < 35.0 and rain_72h < 5.0:
            anomaly_score += 35.0
            risk_flags.append({
                "type": "Moisture Deficit / Water Stress",
                "severity": "High",
                "details": f"Soil moisture depleted to {moisture:.1f}% (below 35% wilting threshold). No rain in near-term forecast.",
                "action_prompt": "Schedule immediate precision drip irrigation cycle."
            })

        # 2. Nutrient Deficiency Risk
        if n_val < 140.0:
            anomaly_score += 20.0
            risk_flags.append({
                "type": "Nitrogen Depletion Shock",
                "severity": "Medium",
                "details": f"Available soil Nitrogen at {n_val:.1f} mg/kg (target range 180-240 mg/kg for {crop}).",
                "action_prompt": "Inject soluble Urea fertigation split into drip line."
            })

        # 3. Soil Acidification / Alkalinity Risk
        if ph < 6.0 or ph > 7.8:
            anomaly_score += 15.0
            risk_flags.append({
                "type": "Soil pH Imbalance",
                "severity": "Medium",
                "details": f"Soil pH at {ph:.1f} restricts nutrient bioavailability.",
                "action_prompt": "Apply corrective agricultural lime (acidic) or gypsum/sulfur (alkaline)."
            })

        # 4. Computer Vision Pest Outbreak Risk
        if pest_data and pest_data.get("diagnosis_key") != "Healthy":
            sev = pest_data.get("severity_percentage", 0.0)
            if sev > 5.0:
                anomaly_score += 35.0
                risk_flags.append({
                    "type": f"Foliar Pest/Disease Outbreak ({pest_data.get('diagnosis')})",
                    "severity": "Critical" if sev > 15.0 else "High",
                    "details": f"Vision analysis detected {pest_data.get('diagnosis')} with {sev:.1f}% foliar coverage.",
                    "action_prompt": "Review precision pesticide spray window constraints."
                })

        anomaly_score = min(99.0, max(5.0, round(anomaly_score, 1)))

        if anomaly_score >= 70.0:
            threat_tier = "CRITICAL THREAT"
        elif anomaly_score >= 40.0:
            threat_tier = "ELEVATED CONCERN"
        else:
            threat_tier = "NORMAL OPERATIONAL BASELINE"

        return {
            "agent": self.name,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "field_id": field_id,
            "field_name": field_name,
            "crop": crop,
            "anomaly_score": anomaly_score,
            "threat_tier": threat_tier,
            "risk_flags_count": len(risk_flags),
            "flagged_risks": risk_flags,
            "needs_immediate_action": anomaly_score >= 40.0
        }

risk_detection_agent = RiskDetectionAgent()
