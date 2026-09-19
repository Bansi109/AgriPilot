"""
AgriPilot - Core Closed-Loop Multi-Agent Orchestrator (Section 6.8)
Executes the integrated 8-step decision cycle:
Step 1: Crop Lifecycle Intelligence (Defines baseline needs)
Step 2: Farm Digital Twin (Observes live virtual state)
Step 3: Specialist Agent Marketplace (Specialized analysis)
Step 4: Crisis & Risk Detection Agent (Identifies emergencies)
Step 5: What-If Simulation & Profit Optimizer (Simulates tradeoffs)
Step 6: Autonomous Operations Planner (Generates executable schedule)
Step 7: Farm-to-Market Autonomous Agent (Coordinates post-harvest logistics)
Step 8: Execution Orchestration & Seasonal Knowledge Graph (Hardware trigger, SMS alert, memory feedback)
"""

from typing import Dict, Any, List, Optional
from datetime import datetime

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

from agents.marketplace.specialist_agents import agent_marketplace
from agents.risk_detection_agent import risk_detection_agent
from agents.action_planning_agent import action_planning_agent
from agents.execution_orchestration_agent import execution_orchestration_agent

class CoreClosedLoopOrchestrator:
    def __init__(self):
        self.last_cycle_result = None
        self.cycle_count = 0

    def run_decision_cycle(
        self,
        field_id: str = "FIELD-NORTH-01",
        farmer_phone: str = "+91 98765 43210",
        preferred_language: str = "Hindi",
        simulate_action_dispatch: bool = True
    ) -> Dict[str, Any]:
        """
        Executes the integrated 8-step closed-loop agricultural decision cycle.
        """
        self.cycle_count += 1
        cycle_start_time = datetime.now()

        # Step 1: Crop Lifecycle Intelligence (6.4.6)
        field = digital_twin.get_field_by_id(field_id) or digital_twin.get_all_fields()[0]
        crop = field["crop"]
        soil_moisture = field["soil_moisture_pct"]
        sowing_date = field["sowing_date"]

        lifecycle_data = crop_lifecycle_engine.get_lifecycle_roadmap(
            crop=crop,
            sowing_date_str=sowing_date,
            current_soil_moisture=soil_moisture
        )

        # Step 2: Farm Digital Twin (6.4.7)
        twin_state = digital_twin.get_field_by_id(field_id)

        # Step 3: Specialist Agent Marketplace (6.4.8)
        marketplace_data = agent_marketplace.run_all(twin_state)
        weather_output = marketplace_data["agents"]["weather"]["raw_data"]
        soil_output = marketplace_data["agents"]["soil"]["raw_data"]
        pest_output = marketplace_data["agents"]["pest"]["raw_data"]

        # Step 4: Crisis & Risk Detection (6.4.9)
        risk_report = risk_detection_agent.evaluate_field_risks(
            field_telemetry=twin_state,
            weather_data=weather_output,
            pest_data={"diagnosis_key": "Yellow_Rust", "diagnosis": "Yellow Rust", "severity_percentage": 12.4} if "Yellow Rust" in twin_state.get("active_pest_status", "") else None
        )

        # If critical incident detected, register in crisis management
        active_incident = None
        if risk_report["needs_immediate_action"]:
            for flag in risk_report["flagged_risks"]:
                active_incident = crisis_management_system.create_incident(
                    incident_type=flag["type"],
                    severity=flag["severity"],
                    field_id=field_id,
                    field_name=twin_state["name"],
                    trigger_condition=flag["details"],
                    telemetry={"moisture_pct": soil_moisture, "anomaly_score": risk_report["anomaly_score"]},
                    recommended_actions=[flag["action_prompt"]],
                    assigned_worker="Ramesh Kumar (Farm Technician)",
                    assigned_equipment="Smart Solenoid Valve & Backpack Sprayer"
                )
                break

        # Step 5: What-If Simulation & Profit Optimization (6.4.7 & 6.4.11)
        what_if_result = digital_twin.run_what_if_simulation(
            field_id=field_id,
            scenario_type="irrigation",
            incoming_rain_mm_72h=weather_output.get("next_72h_rain_mm", 18.0)
        )

        profit_result = profit_optimizer.optimize_farm_economics(
            crop=crop,
            field_area_ha=twin_state["area_ha"],
            target_mandi_price_inr_qtl=marketplace_data["agents"]["market"]["metrics"]["modal_price_inr_qtl"]
        )

        # Step 6: Autonomous Operations Planner (6.4.10)
        # Formulate action plan via Action Planning Agent
        plan = action_planning_agent.formulate_action_plan(
            risk_report=risk_report,
            soil_rx=soil_output,
            spray_solution=pest_output,
            water_saved_liters=what_if_result.get("water_saved_liters", 0)
        )

        # Update schedule if rain disruption occurs
        if weather_output.get("rain_alert_72h", False):
            planner_replan = operations_planner.trigger_rain_replan(weather_output.get("next_72h_rain_mm", 18.0))
        else:
            planner_replan = {"replan_summary": "Standard schedule maintained"}

        # Step 7: Farm-to-Market Agent (6.4.12)
        f2m_result = farm_to_market_agent.evaluate_harvest_and_logistics(
            crop=crop,
            field_id=field_id,
            field_area_ha=twin_state["area_ha"],
            maturity_pct=lifecycle_data["growth_progress_percentage"]
        )

        # Step 8: Execution Orchestration & Seasonal Knowledge Graph (6.4.13 & 6.5/6.6)
        if simulate_action_dispatch:
            execution_result = execution_orchestration_agent.execute_plan(
                plan=plan,
                farmer_phone=farmer_phone,
                preferred_language=preferred_language
            )
        else:
            execution_result = {"status": "Pending Manual Trigger"}

        # Retrieve relevant seasonal memory insights
        kg_context = seasonal_knowledge_graph.query_context(field_id=field_id, crop=crop)

        cycle_duration_ms = int((datetime.now() - cycle_start_time).total_seconds() * 1000)

        result = {
            "decision_cycle_id": f"CYCLE-2026-{self.cycle_count:04d}",
            "executed_at": cycle_start_time.strftime("%Y-%m-%d %H:%M:%S"),
            "cycle_duration_ms": cycle_duration_ms,
            "field_id": field_id,
            "field_name": twin_state["name"],
            "crop": crop,
            "step_1_crop_lifecycle": {
                "stage": lifecycle_data["current_stage"]["name"],
                "progress_pct": lifecycle_data["growth_progress_percentage"],
                "days_after_sowing": lifecycle_data["days_after_sowing"],
                "days_until_harvest": lifecycle_data["days_until_harvest"],
                "active_care_tasks": lifecycle_data["current_stage"]["active_care_tasks"]
            },
            "step_2_digital_twin_state": twin_state,
            "step_3_marketplace_status": {
                "overall_status": marketplace_data["overall_status"],
                "active_agents": marketplace_data["total_specialist_agents"]
            },
            "step_4_risk_assessment": {
                "anomaly_score": risk_report["anomaly_score"],
                "threat_tier": risk_report["threat_tier"],
                "flagged_risks": risk_report["flagged_risks"]
            },
            "step_5_simulation_and_profit": {
                "what_if_decision": what_if_result["ai_decision"],
                "what_if_explanation": what_if_result["explanation"],
                "water_saved_liters": what_if_result["water_saved_liters"],
                "cost_saved_inr": what_if_result["cost_saved_inr"],
                "net_profit_increase_pct": profit_result["economic_impact_summary"]["profit_increase_pct"],
                "profit_increase_inr_ha": profit_result["economic_impact_summary"]["profit_increase_inr_ha"]
            },
            "step_6_operations_plan": {
                "plan_id": plan["plan_id"],
                "urgency": plan["overall_urgency"],
                "action_items": plan["optimized_actions"]
            },
            "step_7_farm_to_market": {
                "harvest_status": f2m_result["harvest_readiness_status"],
                "best_mandi": f2m_result["best_mandi_recommendation"]["mandi_name"],
                "net_price_per_qtl": f2m_result["best_mandi_recommendation"]["net_price_per_qtl"],
                "expected_payout_inr": f2m_result["best_mandi_recommendation"]["total_expected_payout_inr"]
            },
            "step_8_execution_and_memory": {
                "execution_status": execution_result.get("closed_loop_status", "Success"),
                "channels_dispatched": execution_result.get("total_channels_activated", 0),
                "seasonal_insights": kg_context
            }
        }

        self.last_cycle_result = result
        return result

core_orchestrator = CoreClosedLoopOrchestrator()
