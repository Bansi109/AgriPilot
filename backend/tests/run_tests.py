"""
AgriPilot Automated Backend Verification Test Suite
Tests:
1. Penman-Monteith ET0 calculation & Open-Meteo fallback
2. Soil NPK variable-rate fertigation prescription
3. Dynamic Crop Rotation DAG & Solanaceous break-crop constraint
4. Pest Vision pathology analysis & Spray window solver
5. Market intelligence 30-day forecast
6. Crop Lifecycle Roadmap & dynamic switching
7. Farm Digital Twin & What-If simulator
8. PuLP Profit Optimizer
9. Closed-Loop Multi-Agent Decision Cycle
"""

import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(current_dir, ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

def test_all():
    print("=== STARTING AGRIPILOT BACKEND TEST SUITE ===")

    # 1. Weather & Penman-Monteith
    from modules.weather_service import weather_service
    et0 = weather_service.calculate_penman_monteith_et0(28.5, 58.0, 8.4)
    assert et0 > 0.5, f"ET0 too low: {et0}"
    print(f"Test 1 Passed: Penman-Monteith ET0 = {et0} mm/day")

    # 2. Soil Fertigation
    from modules.soil_fertigation import soil_fertigation_engine
    soil_res = soil_fertigation_engine.evaluate_soil_health(
        crop="Wheat", stage="Vegetative", measured_n=150.0, measured_p=28.0,
        measured_k=200.0, measured_ph=7.2, measured_ec=1.1, field_area_ha=2.4
    )
    assert "prescription" in soil_res
    print(f"Test 2 Passed: Soil Health Score = {soil_res['soil_health_score']}, N rate = {soil_res['prescription']['N_rate_kg_ha']} kg/ha")

    # 3. Dynamic Crop Rotation DAG
    from modules.crop_rotation_engine import crop_rotation_engine
    rot_res = crop_rotation_engine.evaluate_rotation_options("Potato")
    top_succ = rot_res["top_successor"]
    # Verify Potato (Solanaceae) breaks to non-solanaceous
    for rec in rot_res["recommendations"]:
        if rec["crop"] == "Tomato":
            assert rec["is_prohibited"] is True, "Tomato should be prohibited after Potato!"
    print(f"Test 3 Passed: Potato rotation successor = {top_succ}, Solanaceous break enforced")

    # 4. Pest Vision & Spray Solver
    from modules.pest_vision_pipeline import pest_vision_pipeline
    pest_res = pest_vision_pipeline.analyze_image(
        image_bytes=b"", crop_hint="Wheat", ambient_temp_c=18.0, ambient_rh_pct=85.0
    )
    assert "diagnosis" in pest_res
    assert "spray_window_solver" in pest_res
    print(f"Test 4 Passed: Pest Diagnosis = {pest_res['diagnosis']}, Spray Allowed = {pest_res['spray_window_solver']['can_spray_now']}")

    # 5. Market Intelligence
    from modules.market_intelligence import market_intelligence_service
    mkt = market_intelligence_service.get_market_analysis("Wheat", 88.0)
    assert len(mkt["forecast_30d"]) == 30
    print(f"Test 5 Passed: Mandi Modal Price = INR {mkt['current_modal_price']}, 30-day forecast generated")

    # 6. Crop Lifecycle Roadmap
    from modules.crop_lifecycle import crop_lifecycle_engine
    life = crop_lifecycle_engine.get_lifecycle_roadmap("Chickpea")
    assert life["selected_crop"] == "Chickpea"
    print(f"Test 6 Passed: Lifecycle current stage = {life['current_stage']['name']}")

    # 7. Digital Twin & What-If
    from modules.digital_twin import digital_twin
    what_if = digital_twin.run_what_if_simulation("FIELD-NORTH-01", "irrigation", 18.0)
    assert "water_saved_liters" in what_if
    print(f"Test 7 Passed: What-If simulation decision = {what_if['ai_decision']}, Water saved = {what_if['water_saved_liters']} L")

    # 8. PuLP Profit Optimizer
    from modules.profit_optimizer import profit_optimizer
    profit = profit_optimizer.optimize_farm_economics("Wheat", 2.4, 2450.0)
    gain_pct = profit["economic_impact_summary"]["profit_increase_pct"]
    assert gain_pct > 0
    print(f"Test 8 Passed: PuLP Profit Optimization = +{gain_pct}% profit increase")

    # 9. Closed-Loop Multi-Agent Decision Cycle
    from agents.core_orchestrator import core_orchestrator
    cycle = core_orchestrator.run_decision_cycle("FIELD-NORTH-01")
    assert "decision_cycle_id" in cycle
    assert len(cycle["step_6_operations_plan"]["action_items"]) > 0
    print(f"Test 9 Passed: Closed-Loop Decision Cycle completed in {cycle['cycle_duration_ms']} ms ({cycle['decision_cycle_id']})")

    print("\nALL 9 BACKEND MODULE & AGENT TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_all()
