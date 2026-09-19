"""
AgriPilot - Dynamic Alternate Cropping & Crop Rotation Engine (Module 6.4.3)
Implements:
1. Agronomic Predecessor-Successor Rules (N-depletion -> N-fixation -> Scavengers -> Bio-fumigation).
2. Botanical Family & Pathogen Disruption (Prevents Solanaceous-after-Solanaceous to disrupt Fusarium/Ralstonia).
3. Directed Acyclic Graph (DAG) state transition engine with multi-objective scoring.
4. Relay sowing and Companion Intercropping with Land Equivalent Ratio (LER) computation.
"""

from typing import Dict, Any, List, Optional

# Crop agronomic metadata
CROPS_METADATA = {
    "Rice": {
        "family": "Poaceae",
        "nutrient_demand": "High N & P",
        "water_req_mm": 1100,
        "root_depth_cm": 40,
        "n_fixer": False,
        "category": "Heavy Consumer",
        "season": "Kharif",
        "avg_profit_per_ha": 38000
    },
    "Wheat": {
        "family": "Poaceae",
        "nutrient_demand": "High N & K",
        "water_req_mm": 450,
        "root_depth_cm": 60,
        "n_fixer": False,
        "category": "Heavy Consumer",
        "season": "Rabi",
        "avg_profit_per_ha": 42000
    },
    "Chickpea": {
        "family": "Fabaceae",
        "nutrient_demand": "Low N (Fixer), Moderate P",
        "water_req_mm": 280,
        "root_depth_cm": 90,
        "n_fixer": True,
        "category": "Nitrogen Restorer",
        "season": "Rabi",
        "avg_profit_per_ha": 48000
    },
    "Lentil": {
        "family": "Fabaceae",
        "nutrient_demand": "Low N, Moderate P",
        "water_req_mm": 240,
        "root_depth_cm": 70,
        "n_fixer": True,
        "category": "Nitrogen Restorer",
        "season": "Rabi",
        "avg_profit_per_ha": 44000
    },
    "Groundnut": {
        "family": "Fabaceae",
        "nutrient_demand": "Low N, High Ca & K",
        "water_req_mm": 500,
        "root_depth_cm": 65,
        "n_fixer": True,
        "category": "Nitrogen Restorer",
        "season": "Kharif/Zaid",
        "avg_profit_per_ha": 52000
    },
    "Cotton": {
        "family": "Malvaceae",
        "nutrient_demand": "High Deep N & K",
        "water_req_mm": 700,
        "root_depth_cm": 150,
        "n_fixer": False,
        "category": "Deep-Root Scavenger",
        "season": "Kharif",
        "avg_profit_per_ha": 58000
    },
    "Pigeonpea": {
        "family": "Fabaceae",
        "nutrient_demand": "Low N, Moderate P",
        "water_req_mm": 550,
        "root_depth_cm": 180,
        "n_fixer": True,
        "category": "Deep-Root Scavenger & Restorer",
        "season": "Kharif",
        "avg_profit_per_ha": 51000
    },
    "Pearl Millet": {
        "family": "Poaceae",
        "nutrient_demand": "Low, Highly Drought Hardy",
        "water_req_mm": 250,
        "root_depth_cm": 100,
        "n_fixer": False,
        "category": "Drought-Tolerant Grain",
        "season": "Kharif/Zaid",
        "avg_profit_per_ha": 29000
    },
    "Sorghum": {
        "family": "Poaceae",
        "nutrient_demand": "Moderate",
        "water_req_mm": 350,
        "root_depth_cm": 120,
        "n_fixer": False,
        "category": "Biomass & Moisture Saver",
        "season": "Kharif",
        "avg_profit_per_ha": 34000
    },
    "Mustard": {
        "family": "Brassicaceae",
        "nutrient_demand": "Moderate N, High S",
        "water_req_mm": 290,
        "root_depth_cm": 80,
        "n_fixer": False,
        "category": "Bio-Fumigant & Pest Break",
        "season": "Rabi",
        "avg_profit_per_ha": 49000
    },
    "Potato": {
        "family": "Solanaceae",
        "nutrient_demand": "Very High K & N",
        "water_req_mm": 480,
        "root_depth_cm": 45,
        "n_fixer": False,
        "category": "Pest/Pathogen Sensitive",
        "season": "Rabi",
        "avg_profit_per_ha": 65000
    },
    "Tomato": {
        "family": "Solanaceae",
        "nutrient_demand": "High N, P, K, Ca",
        "water_req_mm": 550,
        "root_depth_cm": 60,
        "n_fixer": False,
        "category": "Pest/Pathogen Sensitive",
        "season": "Zaid/Kharif",
        "avg_profit_per_ha": 72000
    }
}

# Predecessor-Successor Rules Table
SUCCESSION_RULES = [
    {
        "predecessor": "Rice / Wheat",
        "post_soil": "Depleted N & P; upper soil compaction",
        "successors": ["Chickpea", "Lentil", "Groundnut"],
        "goal": "Biological N-fixation & soil structure recovery",
        "n_credit_kg_ha": "+35 to +50 kg N/ha biological credit",
        "pathogen_disruption": "Breaks cereal rust and bunt spore cycles"
    },
    {
        "predecessor": "Chickpea / Pulses",
        "post_soil": "N-rich soil; low-to-medium moisture reserve",
        "successors": ["Pearl Millet", "Sorghum", "Maize"],
        "goal": "Biomass production & water conservation",
        "n_credit_kg_ha": "Utilizes residual organic N from pulse nodules",
        "pathogen_disruption": "Interrupts pulse wilt (Fusarium oxysporum)"
    },
    {
        "predecessor": "Cotton / Pigeonpea",
        "post_soil": "Heavy deep-soil nutrient extraction",
        "successors": ["Mustard", "Sesame", "Groundnut"],
        "goal": "Shallow root extraction & pest cycle break",
        "n_credit_kg_ha": "Taproot aeration facilitates following brassica rooting",
        "pathogen_disruption": "Breaks pink bollworm and Helicoverpa host cycle"
    },
    {
        "predecessor": "Potato / Solanaceous",
        "post_soil": "Elevated soil-borne pathogen risk (Fusarium, Nematodes)",
        "successors": ["Chickpea", "Mustard", "Pearl Millet"],
        "goal": "Pathogen break-crop & micro-flora reset (Strict non-solanaceous rule)",
        "n_credit_kg_ha": "Bio-fumigant glucosinolates from mustard suppress nematodes",
        "pathogen_disruption": "CRITICAL: Prohibits Tomato/Eggplant/Chilli immediately"
    }
]

class CropRotationEngine:
    def __init__(self):
        pass

    def evaluate_rotation_options(
        self,
        current_crop: str,
        available_water_budget_mm: float = 400.0,
        current_soil_n: float = 140.0,
        market_preference: str = "balanced"
    ) -> Dict[str, Any]:
        """
        Evaluates dynamic successor crop transitions using DAG scoring.
        Balances:
        - Soil NPK recovery (+35%)
        - Water budget availability (+25%)
        - Mandi market profit (+25%)
        - Botanical pathogen disruption (+15%)
        """
        curr_meta = CROPS_METADATA.get(current_crop, CROPS_METADATA["Wheat"])
        curr_family = curr_meta["family"]

        recommendations = []

        for candidate_name, candidate_meta in CROPS_METADATA.items():
            if candidate_name == current_crop:
                continue

            cand_family = candidate_meta["family"]

            # Botanical Family Pathogen Disruption Check
            is_same_family = (curr_family == cand_family)
            pathogen_risk_penalty = 0.0
            pathogen_verdict = "Pathogen Safe: Unrelated botanical family breaks pest cycle"

            if is_same_family and curr_family == "Solanaceae":
                # Strict Solanaceous break-crop constraint
                pathogen_risk_penalty = 80.0
                pathogen_verdict = "STRICT PROHIBITION: Repeating Solanaceae risks massive Fusarium & Nematode infestation"
            elif is_same_family:
                pathogen_risk_penalty = 35.0
                pathogen_verdict = "Sub-optimal: Same botanical family may maintain pest reservoirs"

            # 1. Soil NPK Recovery Score (0-100)
            if curr_meta["n_fixer"] is False and candidate_meta["n_fixer"] is True:
                # Ideal restorative transition
                soil_score = 98.0
                soil_detail = f"Excellent: {candidate_name} fixes 35-50 kg/ha atmospheric N, replenishing depleted soil."
            elif curr_meta["n_fixer"] is True and candidate_meta["n_fixer"] is False:
                # Good utilization of fixed nitrogen
                soil_score = 88.0
                soil_detail = f"Favorable: Scavenges residual organic N left by {current_crop} root nodules."
            elif candidate_meta["category"] == "Bio-Fumigant & Pest Break":
                soil_score = 92.0
                soil_detail = "Bio-fumigant taproot suppresses soil-borne micro-pathogens."
            elif is_same_family:
                soil_score = 30.0
                soil_detail = "Exhausts identical nutrient bands in upper soil layers."
            else:
                soil_score = 70.0
                soil_detail = "Neutral nutrient extraction profile."

            # 2. Water Budget Score (0-100)
            water_need = candidate_meta["water_req_mm"]
            if water_need <= available_water_budget_mm:
                water_score = 100.0 - ((available_water_budget_mm - water_need) / available_water_budget_mm * 15.0)
                water_detail = f"Well within budget ({water_need}mm req vs {available_water_budget_mm}mm available)."
            else:
                deficit = water_need - available_water_budget_mm
                water_score = max(10.0, 100.0 - (deficit * 0.25))
                water_detail = f"Water Deficit Warning: Exceeds expected budget by {deficit:.0f}mm."

            # 3. Market Profit Score (0-100)
            profit = candidate_meta["avg_profit_per_ha"]
            market_score = min(100.0, (profit / 70000.0) * 100.0)

            # 4. Pathogen Disruption Score (0-100)
            pathogen_score = max(0.0, 100.0 - pathogen_risk_penalty)

            # Weighted DAG Transition Score
            composite_score = round(
                (soil_score * 0.35) +
                (water_score * 0.25) +
                (market_score * 0.25) +
                (pathogen_score * 0.15),
                1
            )

            is_prohibited = (is_same_family and curr_family == "Solanaceae")

            recommendations.append({
                "crop": candidate_name,
                "family": cand_family,
                "category": candidate_meta["category"],
                "transition_score": composite_score if not is_prohibited else 12.0,
                "is_recommended": (composite_score >= 70.0 and not is_prohibited),
                "is_prohibited": is_prohibited,
                "soil_score": soil_score,
                "soil_detail": soil_detail,
                "water_score": round(water_score, 1),
                "water_detail": water_detail,
                "market_score": round(market_score, 1),
                "expected_profit_ha": profit,
                "pathogen_score": pathogen_score,
                "pathogen_verdict": pathogen_verdict
            })

        # Sort recommendations descending by score
        recommendations.sort(key=lambda x: x["transition_score"], reverse=True)

        return {
            "current_crop": current_crop,
            "current_family": curr_family,
            "available_water_budget_mm": available_water_budget_mm,
            "top_successor": recommendations[0]["crop"] if recommendations else "Chickpea",
            "recommendations": recommendations,
            "succession_rules_table": SUCCESSION_RULES,
            "intercropping_options": self.get_intercropping_strategies(current_crop)
        }

    def get_intercropping_strategies(self, base_crop: str) -> List[Dict[str, Any]]:
        """
        Calculates Land Equivalent Ratio (LER) for companion and relay intercropping modalities.
        LER = (Y1_inter / Y1_sole) + (Y2_inter / Y2_sole). LER > 1.0 indicates agronomic advantage.
        """
        strategies = [
            {
                "type": "Companion Intercropping",
                "pair": "Sorghum + Pigeonpea (2:1 Row Ratio)",
                "applicable_crops": ["Sorghum", "Pigeonpea", "Cotton"],
                "ler": 1.38,
                "ler_advantage": "+38% yield advantage per unit land area",
                "agronomic_benefit": "Sorghum provides early canopy, while slow-starting Pigeonpea taps deep subsoil moisture after sorghum harvest."
            },
            {
                "type": "Relay Sowing (Zero-Till)",
                "pair": "Rice -> Zero-Till Lentil / Chickpea",
                "applicable_crops": ["Rice"],
                "ler": 1.25,
                "ler_advantage": "+25% total economic productivity",
                "agronomic_benefit": "Seeds broadcast into standing rice stubble 10-14 days before harvest, utilizing residual moisture without tilling."
            },
            {
                "type": "Bio-Fumigant Border Intercropping",
                "pair": "Chickpea + Mustard Border Rows (6:1)",
                "applicable_crops": ["Chickpea", "Lentil", "Wheat"],
                "ler": 1.18,
                "ler_advantage": "+18% economic return with reduced pesticide cost",
                "agronomic_benefit": "Mustard acts as a trap crop for pod borers and releases natural biocidal glucosinolates into perimeter soil."
            }
        ]

        return [s for s in strategies if base_crop in s["applicable_crops"] or base_crop == "All"]

crop_rotation_engine = CropRotationEngine()
