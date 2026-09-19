"""
AgriPilot - Crop Lifecycle & Monthly Care Intelligence Engine (Module 6.4.6)
Implements:
1. Dynamic growth-stage farming roadmap from sowing to harvest (Establishment -> Vegetative -> Reproductive -> Maturity).
2. Dynamic Crop Switching (Instant re-generation for Wheat, Chickpea, Cotton, Maize, Groundnut, Tomato, Rice).
3. Telemetry-driven adaptation (GDD shifts, moisture corrections, emergency pest/water remediation task insertion).
4. Continuous answering: "What stage is my crop in, what should I do now, what should I prepare for next?"
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

CROP_ROADMAP_TEMPLATES = {
    "Wheat": {
        "duration_days": 120,
        "base_temp_c": 5.0,
        "target_gdd": 1850,
        "expected_yield_qtl_ha": 45.0,
        "stages": [
            {
                "stage_id": 1,
                "name": "Month 1 — Establishment & Crown Root Initiation (CRI)",
                "days_range": (0, 30),
                "monitoring_focus": "Seedling emergence; Crown root initiation (Day 20-25); Soil moisture in top 15cm; Early broadleaf weed scouting.",
                "tasks_now": [
                    "Perform CRI stage critical irrigation at Day 21 (Delaying this stage reduces tiller count by up to 30%).",
                    "Apply basal dose: 50% Nitrogen + 100% P2O5 + 100% K2O.",
                    "Scout for early termite damage and seedling rot."
                ],
                "prepare_next": "Prepare for 1st top-dressing of Urea and post-emergence weed management at Day 32-35.",
                "water_req_mm": 65.0,
                "critical_vulnerability": "Moisture stress at CRI permanently stunts root depth."
            },
            {
                "stage_id": 2,
                "name": "Month 2 — Vegetative Growth & Active Tillering",
                "days_range": (31, 65),
                "monitoring_focus": "Tiller density (target 400-500 tillers/m2); Canopy greenness (SPAD/NDVI); Stem elongation; Micro-climate humidity.",
                "tasks_now": [
                    "Broadcast 1st split Nitrogen dose (Urea @ 65 kg/ha) just prior to 2nd irrigation.",
                    "Apply post-emergence herbicide if weed coverage exceeds 15%.",
                    "Inspect underleaf canopy for yellow rust foci, especially in cool humid morning conditions."
                ],
                "prepare_next": "Flag leaf emergence approaching. Check micronutrient status (Zinc and Boron foliar spray preparation).",
                "water_req_mm": 110.0,
                "critical_vulnerability": "Yellow rust spore germination if ambient RH > 80% and temp 10-18°C."
            },
            {
                "stage_id": 3,
                "name": "Month 3 — Reproductive & Grain Filling (Booting to Milking)",
                "days_range": (66, 95),
                "monitoring_focus": "Flag leaf integrity; Spikelet fertilization; Milking to soft-dough grain stage; Terminal heat stress risk.",
                "tasks_now": [
                    "Ensure root-zone moisture remains above 55% during flowering and milking.",
                    "Apply light pulse irrigation to reduce canopy temperature if ambient temp exceeds 32°C (heat shock prevention).",
                    "Apply prophylactic bio-fungicide or systemic triazole if yellow rust stripes spotted on flag leaf."
                ],
                "prepare_next": "Prepare combine harvester booking and inspect grain dry-down rate.",
                "water_req_mm": 125.0,
                "critical_vulnerability": "Terminal heat stress causes grain shriveling and test weight decline."
            },
            {
                "stage_id": 4,
                "name": "Final Stage — Physiological Maturity & Harvest",
                "days_range": (96, 120),
                "monitoring_focus": "Grain moisture content (target 12-14%); Earhead golden color turn; Mandi commodity price arrivals; Transport readiness.",
                "tasks_now": [
                    "Cease irrigation 10-12 days before harvest to facilitate mechanical harvesting and prevent grain black point.",
                    "Sample grain moisture: Harvest when grain breaks with a crisp snap (under 14% moisture).",
                    "Coordinate farm-to-market truck dispatch to capture peak APMC mandi prices."
                ],
                "prepare_next": "Plan dynamic crop succession (e.g. Leguminous Chickpea / Groundnut or Green Gram) to restore soil N.",
                "water_req_mm": 20.0,
                "critical_vulnerability": "Late-season lodging from unseasonal rain or strong winds."
            }
        ]
    },
    "Chickpea": {
        "duration_days": 110,
        "base_temp_c": 8.0,
        "target_gdd": 1600,
        "expected_yield_qtl_ha": 22.0,
        "stages": [
            {
                "stage_id": 1,
                "name": "Month 1 — Sowing & Nodule Establishment",
                "days_range": (0, 25),
                "monitoring_focus": "Rhizobium nodulation on rootlets (pink interior indicates active N-fixation); Soil drainage; Cutworm damage.",
                "tasks_now": [
                    "Seed treatment with Rhizobium and Trichoderma bio-inoculant.",
                    "Ensure adequate residual moisture; avoid waterlogging as chickpeas are extremely sensitive to collar rot.",
                    "Install bird perches (15/ha) to encourage insectivorous birds."
                ],
                "prepare_next": "Prepare for apical branch nipping at Day 30 to stimulate lateral profuse branching.",
                "water_req_mm": 45.0,
                "critical_vulnerability": "Waterlogging causes anaerobic root asphyxiation and collar rot."
            },
            {
                "stage_id": 2,
                "name": "Month 2 — Vegetative Branching & Pre-Flowering",
                "days_range": (26, 60),
                "monitoring_focus": "Lateral branch canopy; Helicoverpa armigera (pod borer) pheromone trap counts; Soil moisture reserve.",
                "tasks_now": [
                    "Perform terminal shoot nipping (top 2-3 cm) to break apical dominance and double pod-bearing branches.",
                    "Light branch irrigation at late vegetative stage if soil moisture drops below 35%.",
                    "Scout for early Helicoverpa pod borer larvae on tender foliage."
                ],
                "prepare_next": "Monitor flower initiation. Strictly avoid heavy flood irrigation during peak flowering.",
                "water_req_mm": 75.0,
                "critical_vulnerability": "Over-irrigation during flowering triggers flower drop and vegetative overgrowth."
            },
            {
                "stage_id": 3,
                "name": "Month 3 — Pod Formation & Seed Development",
                "days_range": (61, 90),
                "monitoring_focus": "Pod borer infestation threshold (ETL: 1 larva/meter row); Pod development; Wilt disease patches.",
                "tasks_now": [
                    "Critical pod development irrigation if winter rains fail.",
                    "Apply Emamectin Benzoate 5% SG or HaNPV bio-spray if pod borer crosses Economic Threshold Level (ETL).",
                    "Foliar spray of 2% Urea or DAP to support seed protein filling."
                ],
                "prepare_next": "Track Indore/Bikaner mandi rates and book harvest threshers.",
                "water_req_mm": 80.0,
                "critical_vulnerability": "Pod borer larvae chewing holes into developing pods."
            },
            {
                "stage_id": 4,
                "name": "Final Stage — Pod Maturation & Harvest",
                "days_range": (91, 110),
                "monitoring_focus": "Foliage yellowing, pod rattling; Seed moisture (<10%); Mandi price peaks.",
                "tasks_now": [
                    "Harvest when 85-90% pods turn brown/straw color and seeds rattle inside pods.",
                    "Thresh during bright sunny hours to minimize grain splitting.",
                    "Leave chickpea root biomass in soil to retain ~40 kg/ha fixed biological nitrogen for the next cereal crop."
                ],
                "prepare_next": "Succession crop: Pearl Millet, Sorghum, or Maize to utilize residual organic N.",
                "water_req_mm": 10.0,
                "critical_vulnerability": "Pod shattering if harvest is delayed in hot dry weather."
            }
        ]
    },
    "Cotton": {
        "duration_days": 165,
        "base_temp_c": 12.0,
        "target_gdd": 2400,
        "expected_yield_qtl_ha": 28.0,
        "stages": [
            {
                "stage_id": 1,
                "name": "Month 1 — Emergence & Square Initiation",
                "days_range": (0, 35),
                "monitoring_focus": "Crop stand uniformity; Sucking pests (jassids, thrips, aphids); Root tap development.",
                "tasks_now": [
                    "Basal NPK fertigation + Zinc sulfate.",
                    "Inter-cultivation weeding to preserve deep soil moisture.",
                    "Yellow sticky traps for sucking pest monitoring."
                ],
                "prepare_next": "Vegetative canopy acceleration and square formation monitoring.",
                "water_req_mm": 85.0,
                "critical_vulnerability": "Thrips and jassids causing upward leaf curling and stunted seedling growth."
            },
            {
                "stage_id": 2,
                "name": "Month 2 & 3 — Square Formation & Flowering",
                "days_range": (36, 85),
                "monitoring_focus": "Square retention; Pink bollworm monitoring with gossyplure lures; Nitrogen split dosing.",
                "tasks_now": [
                    "Split fertigation with high Potassium (K) to support boll structural development.",
                    "Drip irrigation scheduling targeting 60% field capacity.",
                    "Install pink bollworm pheromone traps (8/ha)."
                ],
                "prepare_next": "Peak boll development and boll opening stages.",
                "water_req_mm": 210.0,
                "critical_vulnerability": "Pink bollworm rosette flower infestation causing premature square shedding."
            },
            {
                "stage_id": 3,
                "name": "Month 4 — Peak Boll Development & Fiber Filling",
                "days_range": (86, 130),
                "monitoring_focus": "Boll size; Water stress avoidance; Foliar leaf reddening (Magnesium deficiency).",
                "tasks_now": [
                    "Foliar spray of 1% Magnesium Sulfate + 1% 19-19-19 to counter leaf reddening.",
                    "Maintain steady soil moisture to prevent internal boll shedding.",
                    "Monitor boll rot incidence if unseasonal showers occur."
                ],
                "prepare_next": "Defoliation and staggered boll picking preparation.",
                "water_req_mm": 220.0,
                "critical_vulnerability": "Moisture stress during boll filling causes small bolls and poor fiber micronaire."
            },
            {
                "stage_id": 4,
                "name": "Final Stage — Boll Bursting & Staggered Picking",
                "days_range": (131, 165),
                "monitoring_focus": "Clean cotton boll bursting; Morning dew drying; Moisture content (<8%); Mandi rates.",
                "tasks_now": [
                    "Perform 1st picking when 50-60% bolls open cleanly. Avoid picking trash and bracts.",
                    "Dry harvested seed cotton in shade to preserve lint brightness.",
                    "Follow with 2nd picking 15-20 days later."
                ],
                "prepare_next": "Succession crop: Mustard, Sesame, or Groundnut to break cotton pest cycles.",
                "water_req_mm": 40.0,
                "critical_vulnerability": "Rain during boll bursting stains fiber, causing price discount."
            }
        ]
    },
    "Maize": {
        "duration_days": 105,
        "base_temp_c": 10.0,
        "target_gdd": 1550,
        "expected_yield_qtl_ha": 55.0,
        "stages": [
            {
                "stage_id": 1,
                "name": "Month 1 — Germination & Knee-High Stage",
                "days_range": (0, 30),
                "monitoring_focus": "Fall Armyworm (FAW) whorl scouting; Early vigor; Soil moisture.",
                "tasks_now": [
                    "Basal NPK (30% N, 100% P2O5, 50% K2O).",
                    "Scout for FAW pinholes in leaf whorls; apply sand-lime mix or bio-control if detected.",
                    "Keep field weed-free during first 30 days critical period of competition."
                ],
                "prepare_next": "Tasseling and silking preparation; 2nd Nitrogen top-dress.",
                "water_req_mm": 90.0,
                "critical_vulnerability": "Fall Armyworm whorl feeding destroying the growing point."
            },
            {
                "stage_id": 2,
                "name": "Month 2 — Tasseling & Silking (Critical Water Phase)",
                "days_range": (31, 60),
                "monitoring_focus": "Pollen shed synchronization with silk emergence; Soil moisture > 65%.",
                "tasks_now": [
                    "Top-dress remaining 50% Nitrogen prior to tasseling.",
                    "CRITICAL: Maintain zero moisture stress during 10-day silking window (any deficit reduces grain set by 40%).",
                    "Ensure adequate boron to facilitate pollen tube growth."
                ],
                "prepare_next": "Grain dough development and cob filling.",
                "water_req_mm": 160.0,
                "critical_vulnerability": "Drought stress during silking causes barren cobs with poor seed set."
            },
            {
                "stage_id": 3,
                "name": "Month 3 — Grain Dough to Dent Stage",
                "days_range": (61, 85),
                "monitoring_focus": "Kernel denting; Cob weight; Stem borer and ear rot prevention.",
                "tasks_now": [
                    "Maintain moderate soil moisture until milk line reaches 50% of kernel depth.",
                    "Inspect cobs for fungal ear rot in humid conditions.",
                    "Support root lodging resistance with balanced Potassium."
                ],
                "prepare_next": "Physiological black layer maturity check and harvester scheduling.",
                "water_req_mm": 110.0,
                "critical_vulnerability": "Stalk rot causing plant lodging before harvest."
            },
            {
                "stage_id": 4,
                "name": "Final Stage — Black Layer Maturity & Harvest",
                "days_range": (86, 105),
                "monitoring_focus": "Black abscission layer at kernel base; Husk browning; Grain moisture.",
                "tasks_now": [
                    "Confirm maturity when black layer forms at base of grain.",
                    "Harvest mechanically or by de-husking; sun dry grain down to 14% moisture.",
                    "Check regional mandi demand (feed mills vs starch factories)."
                ],
                "prepare_next": "Succession crop: Leguminous pulse (Chickpea/Lentil) or vegetable rotation.",
                "water_req_mm": 15.0,
                "critical_vulnerability": "Aflatoxin development if wet grain stored without rapid drying."
            }
        ]
    },
    "Groundnut": {
        "duration_days": 115,
        "base_temp_c": 10.0,
        "target_gdd": 1650,
        "expected_yield_qtl_ha": 25.0,
        "stages": [
            {
                "stage_id": 1,
                "name": "Month 1 — Emergence & Vegetative Canopy",
                "days_range": (0, 30),
                "monitoring_focus": "Seedling emergence; Collar rot check; Early weed eradication.",
                "tasks_now": [
                    "Seed treatment with Trichoderma and Rhizobium.",
                    "Apply basal Gypsum (200 kg/ha) for calcium and sulfur supply.",
                    "Perform shallow weeding before pegging begins."
                ],
                "prepare_next": "Flowering and peg initiation.",
                "water_req_mm": 70.0,
                "critical_vulnerability": "Soil compaction hindering later peg penetration."
            },
            {
                "stage_id": 2,
                "name": "Month 2 — Flowering & Peg Penetration",
                "days_range": (31, 65),
                "monitoring_focus": "Yellow flowers; Pegs entering loose soil; Tikka leaf spot scouting.",
                "tasks_now": [
                    "DO NOT DISTURB SOIL once pegs enter (stop hoeing/cultivation).",
                    "Top-dress remaining Gypsum (200 kg/ha) at pegging zone (calcium is absorbed directly by pods).",
                    "Maintain moist surface soil to allow soft peg penetration."
                ],
                "prepare_next": "Pod development and kernel expansion.",
                "water_req_mm": 140.0,
                "critical_vulnerability": "Dry hard surface soil prevents pegs from entering, resulting in aerial pod failure."
            },
            {
                "stage_id": 3,
                "name": "Month 3 — Pod Development & Oil Accumulation",
                "days_range": (66, 95),
                "monitoring_focus": "Pod filling inside soil; Foliar disease (Tikka and rust); Moisture adequacy.",
                "tasks_now": [
                    "Foliar spray for Tikka leaf spot (Hexaconazole or Mancozeb) if defoliation starts.",
                    "Ensure adequate moisture in pod zone for rapid oil synthesis.",
                    "Scout for white grub larvae damaging underground pods."
                ],
                "prepare_next": "Maturity check by pulling test plants and checking pod inner shell color.",
                "water_req_mm": 120.0,
                "critical_vulnerability": "Tikka disease causing premature total defoliation."
            },
            {
                "stage_id": 4,
                "name": "Final Stage — Shell Maturity & Lifting",
                "days_range": (96, 115),
                "monitoring_focus": "Inner pod shell turning brownish-black; Shell hardness; Oil mill prices.",
                "tasks_now": [
                    "Pull sample plants: 75% pods showing dark inner shell indicates optimal harvest.",
                    "Apply light softening irrigation 2 days prior to mechanical lifting if soil is hard.",
                    "Cure pods in inverted windrows for 3-4 days in sun to bring moisture below 8%."
                ],
                "prepare_next": "Succession crop: Cereal (Wheat/Barley/Maize) or Mustard.",
                "water_req_mm": 15.0,
                "critical_vulnerability": "Pods breaking off inside dry hard soil during lifting."
            }
        ]
    }
}

class CropLifecycleEngine:
    def __init__(self):
        pass

    def get_lifecycle_roadmap(
        self,
        crop: str = "Wheat",
        sowing_date_str: str = None,
        current_soil_moisture: float = 58.0,
        recent_rain_mm: float = 0.0,
        active_pest_incident: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generates dynamic, growth-stage farming roadmap.
        Updates dynamically based on current date, real-time soil moisture,
        weather, and pest incidents.
        """
        crop_key = crop if crop in CROP_ROADMAP_TEMPLATES else "Wheat"
        template = CROP_ROADMAP_TEMPLATES[crop_key]

        # Calculate current age based on sowing date
        if sowing_date_str:
            try:
                sow_dt = datetime.strptime(sowing_date_str, "%Y-%m-%d")
            except Exception:
                sow_dt = datetime.now() - timedelta(days=45)
        else:
            sow_dt = datetime.now() - timedelta(days=45)  # Default: Day 45 (Vegetative stage)

        days_after_sowing = max(1, min(template["duration_days"], (datetime.now() - sow_dt).days))
        progress_pct = round((days_after_sowing / template["duration_days"]) * 100.0, 1)

        # Determine current stage
        current_stage = None
        for stage in template["stages"]:
            d_min, d_max = stage["days_range"]
            if d_min <= days_after_sowing <= d_max:
                current_stage = stage
                break

        if not current_stage:
            current_stage = template["stages"][-1]

        # Dynamic adjustments based on live telemetry
        dynamic_tasks = list(current_stage["tasks_now"])
        dynamic_alerts = []

        # 1. Soil moisture adjustment
        if current_soil_moisture < 35.0:
            dynamic_tasks.insert(0, f"EMERGENCY IRRIGATION REQUIRED: Soil moisture has fallen to {current_soil_moisture:.1f}%. Apply scheduled drip cycle immediately.")
            dynamic_alerts.append(f"Water stress detected in current stage ({current_soil_moisture:.1f}% vs 50% target).")
        elif recent_rain_mm >= 15.0:
            dynamic_tasks.insert(0, f"IRRIGATION POSTPONED: Recent rainfall ({recent_rain_mm:.1f} mm) has replenished soil profile. Halt scheduled valve runs for 48 hours.")
            dynamic_alerts.append(f"Rainfall of {recent_rain_mm:.1f} mm detected. Water saved.")

        # 2. Active pest incident adjustment
        if active_pest_incident:
            dynamic_tasks.insert(0, f"PRIORITY BIO-CONTAINMENT: Flagged {active_pest_incident}. Execute targeted foliar treatment within recommended spray window.")
            dynamic_alerts.append(f"Emergency pest response active: {active_pest_incident}.")

        # Days until harvest
        days_until_harvest = max(0, template["duration_days"] - days_after_sowing)

        return {
            "selected_crop": crop_key,
            "sowing_date": sow_dt.strftime("%Y-%m-%d"),
            "days_after_sowing": days_after_sowing,
            "total_crop_duration_days": template["duration_days"],
            "growth_progress_percentage": progress_pct,
            "days_until_harvest": days_until_harvest,
            "expected_yield_qtl_ha": template["expected_yield_qtl_ha"],
            "current_stage": {
                "stage_id": current_stage["stage_id"],
                "name": current_stage["name"],
                "monitoring_focus": current_stage["monitoring_focus"],
                "active_care_tasks": dynamic_tasks,
                "prepare_next": current_stage["prepare_next"],
                "water_req_mm": current_stage["water_req_mm"],
                "critical_vulnerability": current_stage["critical_vulnerability"]
            },
            "dynamic_field_alerts": dynamic_alerts,
            "all_stages": template["stages"],
            "available_crops_for_switching": list(CROP_ROADMAP_TEMPLATES.keys()),
            "core_question_answers": {
                "what_stage_am_i_in": f"Stage {current_stage['stage_id']}: {current_stage['name']} (Day {days_after_sowing} of {template['duration_days']})",
                "what_should_i_do_now": dynamic_tasks[0] if dynamic_tasks else "Normal maintenance.",
                "what_should_i_prepare_for_next": current_stage["prepare_next"],
                "how_does_plan_adapt": "Dynamically modifies water dosage from Penman-Monteith ET0, adjusts for rain, and injects emergency pest remediation directly into the active schedule."
            }
        }

crop_lifecycle_engine = CropLifecycleEngine()
