"""
AgriPilot - Soil Nutrient Checking & Precision Fertigation Engine (Module 6.4.2)
Implements:
1. Dynamic comparison of real-time Soil NPK (mg/kg), pH, and EC against crop growth-stage curves.
2. Variable-rate fertigation volume (liters) and NPK ratio computation (N, P2O5, K2O in kg/ha).
3. Soil pH balancing with chemical soil conditioning (lime vs sulfur/gypsum).
4. Leaching prevention thresholds and smart drip valve pulse parameters.
"""

from typing import Dict, Any, Tuple

# Crop nutrient targets per growth stage (Optimal ranges in mg/kg for N, P, K and optimal pH)
CROP_STAGE_NUTRIENT_TARGETS = {
    "Wheat": {
        "Establishment": {"N": (140, 180), "P": (25, 40), "K": (180, 240), "pH": (6.0, 7.5), "EC": (0.8, 1.8)},
        "Vegetative": {"N": (180, 240), "P": (30, 50), "K": (220, 280), "pH": (6.0, 7.5), "EC": (1.0, 2.0)},
        "Reproductive": {"N": (160, 210), "P": (35, 55), "K": (240, 310), "pH": (6.0, 7.5), "EC": (1.0, 2.2)},
        "Maturity": {"N": (100, 140), "P": (20, 35), "K": (160, 210), "pH": (6.0, 7.5), "EC": (0.8, 1.6)}
    },
    "Chickpea": {
        "Establishment": {"N": (80, 120), "P": (30, 45), "K": (160, 210), "pH": (6.2, 7.8), "EC": (0.6, 1.5)},
        "Vegetative": {"N": (90, 130), "P": (40, 60), "K": (190, 250), "pH": (6.2, 7.8), "EC": (0.8, 1.8)},
        "Reproductive": {"N": (90, 120), "P": (45, 65), "K": (210, 280), "pH": (6.2, 7.8), "EC": (0.8, 2.0)},
        "Maturity": {"N": (60, 90), "P": (25, 40), "K": (150, 190), "pH": (6.2, 7.8), "EC": (0.6, 1.5)}
    },
    "Cotton": {
        "Establishment": {"N": (120, 160), "P": (25, 40), "K": (200, 260), "pH": (6.0, 8.0), "EC": (1.0, 2.2)},
        "Vegetative": {"N": (200, 260), "P": (35, 55), "K": (260, 340), "pH": (6.0, 8.0), "EC": (1.2, 2.5)},
        "Reproductive": {"N": (180, 230), "P": (40, 60), "K": (300, 380), "pH": (6.0, 8.0), "EC": (1.2, 2.8)},
        "Maturity": {"N": (110, 150), "P": (20, 35), "K": (200, 260), "pH": (6.0, 8.0), "EC": (0.8, 2.0)}
    },
    "Maize": {
        "Establishment": {"N": (130, 170), "P": (25, 40), "K": (170, 230), "pH": (5.8, 7.2), "EC": (0.8, 1.8)},
        "Vegetative": {"N": (210, 280), "P": (35, 55), "K": (230, 310), "pH": (5.8, 7.2), "EC": (1.0, 2.2)},
        "Reproductive": {"N": (190, 250), "P": (40, 65), "K": (260, 350), "pH": (5.8, 7.2), "EC": (1.0, 2.4)},
        "Maturity": {"N": (110, 150), "P": (20, 35), "K": (180, 230), "pH": (5.8, 7.2), "EC": (0.8, 1.8)}
    },
    "Groundnut": {
        "Establishment": {"N": (70, 100), "P": (30, 50), "K": (150, 200), "pH": (6.0, 7.5), "EC": (0.6, 1.4)},
        "Vegetative": {"N": (80, 110), "P": (40, 65), "K": (180, 240), "pH": (6.0, 7.5), "EC": (0.7, 1.6)},
        "Reproductive": {"N": (85, 115), "P": (45, 70), "K": (200, 260), "pH": (6.0, 7.5), "EC": (0.8, 1.8)},
        "Maturity": {"N": (50, 80), "P": (20, 35), "K": (140, 180), "pH": (6.0, 7.5), "EC": (0.6, 1.4)}
    }
}

class SoilFertigationEngine:
    def __init__(self):
        pass

    def evaluate_soil_health(
        self,
        crop: str,
        stage: str,
        measured_n: float,
        measured_p: float,
        measured_k: float,
        measured_ph: float,
        measured_ec: float,
        field_area_ha: float = 1.0
    ) -> Dict[str, Any]:
        """
        Analyzes measured soil nutrients against the crop's physiological requirements
        and generates a variable-rate fertigation prescription.
        """
        crop_name = crop if crop in CROP_STAGE_NUTRIENT_TARGETS else "Wheat"
        stages = CROP_STAGE_NUTRIENT_TARGETS[crop_name]
        stage_targets = stages.get(stage, stages.get("Vegetative"))

        target_n_min, target_n_max = stage_targets["N"]
        target_p_min, target_p_max = stage_targets["P"]
        target_k_min, target_k_max = stage_targets["K"]
        target_ph_min, target_ph_max = stage_targets["pH"]
        target_ec_min, target_ec_max = stage_targets["EC"]

        # Calculate deficits (mg/kg)
        target_n_mid = (target_n_min + target_n_max) / 2.0
        target_p_mid = (target_p_min + target_p_max) / 2.0
        target_k_mid = (target_k_min + target_k_max) / 2.0

        deficit_n = max(0.0, target_n_mid - measured_n)
        deficit_p = max(0.0, target_p_mid - measured_p)
        deficit_k = max(0.0, target_k_mid - measured_k)

        # Agronomic conversion factor: 1 mg/kg in top 20cm soil (bulk density 1.3 g/cm3) is approx 2.6 kg/ha
        # Applying a 0.65 efficiency factor for drip fertigation uptake
        n_needed_kg_ha = round((deficit_n * 2.6) * 0.45, 1) if deficit_n > 0 else 0.0
        p_needed_kg_ha = round((deficit_p * 2.6 * 2.29) * 0.35, 1) if deficit_p > 0 else 0.0  # P to P2O5
        k_needed_kg_ha = round((deficit_k * 2.6 * 1.20) * 0.40, 1) if deficit_k > 0 else 0.0  # K to K2O

        # Status classification
        def get_status(val: float, low: float, high: float) -> str:
            if val < low * 0.8:
                return "Severe Deficit"
            elif val < low:
                return "Deficient"
            elif val > high * 1.25:
                return "Excess / Leaching Risk"
            elif val > high:
                return "Elevated"
            return "Optimal"

        status_n = get_status(measured_n, target_n_min, target_n_max)
        status_p = get_status(measured_p, target_p_min, target_p_max)
        status_k = get_status(measured_k, target_k_min, target_k_max)

        # pH evaluation and soil conditioner recommendation
        ph_action = "Optimal pH balance maintained"
        ph_conditioner = "None needed"
        ph_amount_kg_ha = 0.0

        if measured_ph < 6.0:
            ph_action = "Acidic Soil: Impedes phosphorus uptake and root elongation."
            ph_amount_kg_ha = round((6.5 - measured_ph) * 450.0, 1)
            ph_conditioner = f"Agricultural Dolomitic Lime ({ph_amount_kg_ha} kg/ha)"
        elif measured_ph > 7.8:
            ph_action = "Alkaline / Calcareous Soil: Restricts micronutrient (Fe, Zn) availability."
            ph_amount_kg_ha = round((measured_ph - 7.2) * 320.0, 1)
            ph_conditioner = f"Elemental Gypsum / Bio-Sulfur ({ph_amount_kg_ha} kg/ha)"

        # Calculate Drip Tank Fertigation Recipe
        # Standard commercial soluble fertilizers: Urea (46-0-0), MAP (12-61-0), SOP (0-0-50)
        fertigation_recipe = []
        total_fertilizer_kg = 0.0

        if n_needed_kg_ha > 0:
            urea_kg = round(n_needed_kg_ha / 0.46, 1)
            fertigation_recipe.append({
                "fertilizer": "Soluble Urea (46-0-0)",
                "rate_kg_ha": urea_kg,
                "total_field_kg": round(urea_kg * field_area_ha, 1),
                "target_nutrient": "Nitrogen (N)"
            })
            total_fertilizer_kg += urea_kg

        if p_needed_kg_ha > 0:
            map_kg = round(p_needed_kg_ha / 0.61, 1)
            fertigation_recipe.append({
                "fertilizer": "Monoammonium Phosphate MAP (12-61-0)",
                "rate_kg_ha": map_kg,
                "total_field_kg": round(map_kg * field_area_ha, 1),
                "target_nutrient": "Phosphorus (P2O5)"
            })
            total_fertilizer_kg += map_kg

        if k_needed_kg_ha > 0:
            sop_kg = round(k_needed_kg_ha / 0.50, 1)
            fertigation_recipe.append({
                "fertilizer": "Sulphate of Potash SOP (0-0-50)",
                "rate_kg_ha": sop_kg,
                "total_field_kg": round(sop_kg * field_area_ha, 1),
                "target_nutrient": "Potassium (K2O)"
            })
            total_fertilizer_kg += sop_kg

        # Venturi injection volume (recommended 1:100 injection ratio)
        water_carrier_volume_liters = max(100.0, round(total_fertilizer_kg * 12.0 * field_area_ha, 1))

        # Overall soil health index (0 to 100)
        health_score = 100.0
        if status_n != "Optimal": health_score -= 15.0
        if status_p != "Optimal": health_score -= 12.0
        if status_k != "Optimal": health_score -= 10.0
        if measured_ph < 6.0 or measured_ph > 7.8: health_score -= 18.0
        if measured_ec > target_ec_max: health_score -= 15.0
        health_score = max(20.0, min(100.0, round(health_score, 1)))

        return {
            "crop": crop_name,
            "growth_stage": stage,
            "soil_health_score": health_score,
            "measured": {
                "N_mg_kg": measured_n,
                "P_mg_kg": measured_p,
                "K_mg_kg": measured_k,
                "pH": measured_ph,
                "EC_dS_m": measured_ec
            },
            "optimal_range": {
                "N": target_n_min, "N_max": target_n_max,
                "P": target_p_min, "P_max": target_p_max,
                "K": target_k_min, "K_max": target_k_max,
                "pH": target_ph_min, "pH_max": target_ph_max,
                "EC": target_ec_min, "EC_max": target_ec_max
            },
            "status": {
                "N": status_n,
                "P": status_p,
                "K": status_k,
                "pH": "Optimal" if target_ph_min <= measured_ph <= target_ph_max else ("Acidic" if measured_ph < target_ph_min else "Alkaline"),
                "EC": "Normal Salinity" if measured_ec <= target_ec_max else "Elevated Salinity Hazard"
            },
            "prescription": {
                "N_rate_kg_ha": n_needed_kg_ha,
                "P2O5_rate_kg_ha": p_needed_kg_ha,
                "K2O_rate_kg_ha": k_needed_kg_ha,
                "ph_conditioner": ph_conditioner,
                "ph_action_detail": ph_action,
                "carrier_water_liters": water_carrier_volume_liters,
                "drip_injection_minutes": max(15, int(water_carrier_volume_liters / 10.0)),
                "fertigation_recipe": fertigation_recipe
            }
        }

soil_fertigation_engine = SoilFertigationEngine()
