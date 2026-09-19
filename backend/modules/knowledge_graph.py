"""
AgriPilot - Farm Memory & Seasonal Knowledge Graph (Module 6.4.13)
Implements:
1. Multi-season memory graph connecting: Fields <-> Seasons <-> Crops <-> Soil States <-> Pests <-> Interventions <-> Yield Outcomes.
2. Cross-season experiential learning: queries past successes and failures to inform current decisions.
3. Graph query engine for contextualized advisory generation.
"""

from typing import Dict, Any, List, Optional

GRAPH_NODES = [
    {"id": "F-01", "label": "Field North-01 (Alpha Ridge)", "type": "Field", "soil_type": "Clay Loam", "area_ha": 2.4},
    {"id": "F-02", "label": "Field South-02 (Delta Basin)", "type": "Field", "soil_type": "Sandy Loam", "area_ha": 1.8},
    {"id": "F-03", "label": "Field East-03 (Terraced)", "type": "Field", "soil_type": "Loam", "area_ha": 3.0},

    {"id": "S-2024-KHARIF", "label": "Kharif 2024 (Monsoon)", "type": "Season", "rainfall_mm": 680},
    {"id": "S-2024-RABI", "label": "Rabi 2024-25 (Winter)", "type": "Season", "rainfall_mm": 45},
    {"id": "S-2025-ZAID", "label": "Zaid 2025 (Summer)", "type": "Season", "rainfall_mm": 12},
    {"id": "S-2025-KHARIF", "label": "Kharif 2025 (Monsoon)", "type": "Season", "rainfall_mm": 720},
    {"id": "S-2025-RABI", "label": "Rabi 2025-26 (Winter)", "type": "Season", "rainfall_mm": 38},

    {"id": "CROP-RICE", "label": "Paddy Rice (Basmati PB-1121)", "type": "Crop", "family": "Poaceae"},
    {"id": "CROP-WHEAT", "label": "Wheat (HD-3086)", "type": "Crop", "family": "Poaceae"},
    {"id": "CROP-CHICKPEA", "label": "Chickpea (Desi JG-11)", "type": "Crop", "family": "Fabaceae"},
    {"id": "CROP-COTTON", "label": "Cotton (Bt RCH-659)", "type": "Crop", "family": "Malvaceae"},
    {"id": "CROP-MUSTARD", "label": "Mustard (Pusa Mustard-25)", "type": "Crop", "family": "Brassicaceae"},

    {"id": "PEST-RUST", "label": "Stripe / Yellow Rust Outbreak", "type": "PestEvent", "pathogen": "Puccinia striiformis"},
    {"id": "PEST-BORER", "label": "Pod Borer Infestation", "type": "PestEvent", "pathogen": "Helicoverpa armigera"},

    {"id": "INT-TILT", "label": "Foliar Propiconazole 25% EC @ 1 ml/L", "type": "Intervention", "efficacy": "High (96% spore suppression)"},
    {"id": "INT-NEEM", "label": "Neem Oil 5% + Hand Picking", "type": "Intervention", "efficacy": "Moderate (Late stage slow containment)"},
    {"id": "INT-DRIP-SPLIT", "label": "Precision Drip Fertigation Split (N+K)", "type": "Intervention", "efficacy": "Very High (+14% yield)"},

    {"id": "OUT-WHEAT-2025", "label": "Harvest Yield: 48.2 Qtl/ha (Record Profit ₹62,400/ha)", "type": "Outcome", "quality": "Grade A"},
    {"id": "OUT-CHICK-2025", "label": "Harvest Yield: 24.5 Qtl/ha (Profit ₹71,200/ha)", "type": "Outcome", "quality": "Grade A"}
]

GRAPH_EDGES = [
    {"from": "F-01", "to": "S-2024-KHARIF", "relation": "CULTIVATED_IN"},
    {"from": "S-2024-KHARIF", "to": "CROP-RICE", "relation": "HAD_CROP"},
    {"from": "F-01", "to": "S-2024-RABI", "relation": "CULTIVATED_IN"},
    {"from": "S-2024-RABI", "to": "CROP-WHEAT", "relation": "HAD_CROP"},
    {"from": "CROP-WHEAT", "to": "PEST-RUST", "relation": "SUFFERED_FROM"},
    {"from": "PEST-RUST", "to": "INT-TILT", "relation": "TREATED_WITH"},
    {"from": "INT-TILT", "to": "OUT-WHEAT-2025", "relation": "RESULTED_IN"},

    {"from": "F-02", "to": "S-2024-RABI", "relation": "CULTIVATED_IN"},
    {"from": "S-2024-RABI", "to": "CROP-CHICKPEA", "relation": "HAD_CROP"},
    {"from": "CROP-CHICKPEA", "to": "INT-DRIP-SPLIT", "relation": "MANAGED_WITH"},
    {"from": "INT-DRIP-SPLIT", "to": "OUT-CHICK-2025", "relation": "RESULTED_IN"},

    {"from": "F-03", "to": "S-2024-KHARIF", "relation": "CULTIVATED_IN"},
    {"from": "S-2024-KHARIF", "to": "CROP-COTTON", "relation": "HAD_CROP"},
    {"from": "F-03", "to": "S-2024-RABI", "relation": "ROTATED_TO"},
    {"from": "S-2024-RABI", "to": "CROP-MUSTARD", "relation": "SUCCESSOR_BIOFUMIGANT"}
]

HISTORICAL_INSIGHTS = [
    {
        "insight_id": "INS-01",
        "title": "Field North-01 Yellow Rust Micro-Climate Sensitivity",
        "category": "Pest Memory",
        "lesson_learned": "In Rabi 2024-25, Field North-01 experienced heavy dew and canopy humidity during flag leaf stage, triggering early yellow rust. Timely Propiconazole 25% EC at 0.1% suppressed 96% of spores before grain fill, preventing a projected 28% yield collapse.",
        "actionable_rule": "Whenever relative humidity exceeds 80% for 3 consecutive days in Field North-01, trigger an autonomous scout advisory and pre-check spray windows."
    },
    {
        "insight_id": "INS-02",
        "title": "Field South-02 Biological Nitrogen Carryover",
        "category": "Soil Memory",
        "lesson_learned": "Following the Rabi 2024-25 Chickpea harvest in Field South-02, soil tests revealed a residual biological nitrogen credit of +42 kg N/ha. The successor cereal crop required 30% less synthetic urea, saving ₹1,850/ha while maintaining 100% target yield.",
        "actionable_rule": "Automatically credit 35-45 kg N/ha into the soil fertigation calculator when succeeding a leguminous pulse crop."
    },
    {
        "insight_id": "INS-03",
        "title": "Field East-03 Cotton-to-Mustard Nematode Reset",
        "category": "Crop Rotation Memory",
        "lesson_learned": "Rotating Deep-rooted Cotton into Mustard in Field East-03 broke the pink bollworm hibernation cycle and bio-fumigated root-knot nematodes with glucosinolates.",
        "actionable_rule": "Do not plant solanaceous crops after cotton. Prioritize Brassica bio-fumigants or leguminous pulse crops."
    }
]

class SeasonalKnowledgeGraph:
    def __init__(self):
        self.nodes = GRAPH_NODES
        self.edges = GRAPH_EDGES
        self.insights = HISTORICAL_INSIGHTS

    def get_graph_data(self) -> Dict[str, Any]:
        return {
            "nodes": self.nodes,
            "edges": self.edges,
            "insights": self.insights,
            "summary": {
                "total_fields_tracked": 3,
                "seasons_recorded": 5,
                "crops_logged": 5,
                "interventions_evaluated": 3,
                "historical_yield_gain_avg": "+16.8% over baseline"
            }
        }

    def query_context(self, field_id: str, crop: str) -> List[Dict[str, Any]]:
        """Returns relevant historical lessons for the selected field and crop."""
        matches = []
        for ins in self.insights:
            if field_id in ins["lesson_learned"] or crop in ins["lesson_learned"]:
                matches.append(ins)
        return matches or self.insights[:2]

seasonal_knowledge_graph = SeasonalKnowledgeGraph()
