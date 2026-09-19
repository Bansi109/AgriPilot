"""
AgriPilot - Autonomous Farm Operations Planner (Module 6.4.10)
Implements:
1. Dynamic conversion of AI recommendations into practical daily & weekly executable farm schedules.
2. Resource-aware scheduling (machinery, labor, water budget, weather windows).
3. Automated dynamic re-planning on environmental disruptions (e.g. rain moving pesticide spraying).
"""

from typing import Dict, Any, List
from datetime import datetime, timedelta

DEFAULT_SCHEDULE = [
    {
        "task_id": "TASK-OP-101",
        "title": "Precision Drip Fertigation (Split N + K Injection)",
        "field_id": "FIELD-NORTH-01",
        "field_name": "North Plot — Alpha Ridge",
        "crop": "Wheat",
        "scheduled_date": "2026-09-20",
        "time_slot": "06:00 - 07:30 AM",
        "category": "Fertigation",
        "priority": "High",
        "assigned_worker": "Ramesh Kumar",
        "assigned_equipment": "Smart Drip Valve VALVE-N1-01 + Venturi Injector",
        "water_volume_liters": 15000,
        "fertilizer_dosage": "Urea (42 kg) + SOP (28 kg) dissolved in 250L tank",
        "weather_dependency": "Calm wind, no heavy rain",
        "status": "Scheduled",
        "can_reschedule": True
    },
    {
        "task_id": "TASK-OP-102",
        "title": "Targeted Prophylactic Fungicide Spray (Yellow Rust Containment)",
        "field_id": "FIELD-NORTH-01",
        "field_name": "North Plot — Alpha Ridge",
        "crop": "Wheat",
        "scheduled_date": "2026-09-20",
        "time_slot": "07:45 - 09:15 AM",
        "category": "Pest & Disease Control",
        "priority": "Critical",
        "assigned_worker": "Suresh Patel",
        "assigned_equipment": "Battery Backpack Sprayer Unit #2",
        "water_volume_liters": 450,
        "fertilizer_dosage": "Propiconazole 25% EC @ 1 ml/L (450 ml total)",
        "weather_dependency": "Wind < 12 km/h, Temp < 30°C, Rain 0mm within 6h",
        "status": "Scheduled",
        "can_reschedule": True
    },
    {
        "task_id": "TASK-OP-103",
        "title": "Terminal Shoot Nipping & Bird Perch Installation",
        "field_id": "FIELD-SOUTH-02",
        "field_name": "South Plot — Delta Basin",
        "crop": "Chickpea",
        "scheduled_date": "2026-09-21",
        "time_slot": "08:00 - 11:30 AM",
        "category": "Crop Canopy Care",
        "priority": "Medium",
        "assigned_worker": "Pooja Devi & Team (3 Workers)",
        "assigned_equipment": "Hand Pruning Shears & Bamboo Perches",
        "water_volume_liters": 0,
        "fertilizer_dosage": "None (Mechanical)",
        "weather_dependency": "Dry weather",
        "status": "Scheduled",
        "can_reschedule": True
    },
    {
        "task_id": "TASK-OP-104",
        "title": "Soil Moisture Tensiometer Cross-Calibration",
        "field_id": "FIELD-EAST-03",
        "field_name": "East Terraced Orchard",
        "crop": "Cotton",
        "scheduled_date": "2026-09-22",
        "time_slot": "10:00 - 11:00 AM",
        "category": "Telemetry Maintenance",
        "priority": "Low",
        "assigned_worker": "Anil Singh",
        "assigned_equipment": "Handheld Soil Penetrometer & Calibration Kit",
        "water_volume_liters": 0,
        "fertilizer_dosage": "None",
        "weather_dependency": "Any",
        "status": "Scheduled",
        "can_reschedule": True
    },
    {
        "task_id": "TASK-OP-105",
        "title": "Pheromone Trap Lure Replacement (Pink Bollworm)",
        "field_id": "FIELD-EAST-03",
        "field_name": "East Terraced Orchard",
        "crop": "Cotton",
        "scheduled_date": "2026-09-23",
        "time_slot": "07:00 - 08:30 AM",
        "category": "Pest & Disease Control",
        "priority": "High",
        "assigned_worker": "Suresh Patel",
        "assigned_equipment": "Gossyplure Rubber Septa Traps (8 Units)",
        "water_volume_liters": 0,
        "fertilizer_dosage": "None",
        "weather_dependency": "Any",
        "status": "Scheduled",
        "can_reschedule": True
    }
]

class OperationsPlanner:
    def __init__(self):
        self.schedule = list(DEFAULT_SCHEDULE)

    def get_schedule(self) -> List[Dict[str, Any]]:
        return self.schedule

    def add_operation(self, task: Dict[str, Any]) -> Dict[str, Any]:
        task_id = f"TASK-OP-{len(self.schedule) + 106}"
        task["task_id"] = task_id
        task["status"] = "Scheduled"
        self.schedule.append(task)
        return task

    def update_task_status(self, task_id: str, new_status: str) -> Optional[Dict[str, Any]]:
        for task in self.schedule:
            if task["task_id"] == task_id:
                task["status"] = new_status
                return task
        return None

    def trigger_rain_replan(self, rain_event_mm: float) -> Dict[str, Any]:
        """
        Dynamically adjusts operations schedule when sudden rain is detected:
        1. Moves foliar spraying to 48 hours later.
        2. Cancels or postpones irrigation operations.
        3. Prioritizes drainage furrow inspection.
        """
        replan_log = []
        for task in self.schedule:
            if "Spraying" in task["title"] or task["category"] == "Pest & Disease Control":
                old_date = task["scheduled_date"]
                # Shift by 2 days
                try:
                    dt = datetime.strptime(old_date, "%Y-%m-%d") + timedelta(days=2)
                    new_date = dt.strftime("%Y-%m-%d")
                except Exception:
                    new_date = "2026-09-22"
                task["scheduled_date"] = new_date
                task["status"] = "Rescheduled (Rain Disruption)"
                replan_log.append(f"Rescheduled '{task['title']}' from {old_date} to {new_date} to prevent chemical wash-off.")

            elif "Fertigation" in task["title"] or "Irrigation" in task["title"]:
                task["status"] = "Postponed (Soil Saturated by Rain)"
                replan_log.append(f"Postponed '{task['title']}' to prevent groundwater nutrient leaching.")

        # Insert emergency drainage task
        drain_task = {
            "task_id": f"TASK-OP-{len(self.schedule) + 200}",
            "title": "Emergency Drainage Sluice Gate Verification",
            "field_id": "FIELD-ALL",
            "field_name": "All Farm Plots",
            "crop": "All",
            "scheduled_date": datetime.now().strftime("%Y-%m-%d"),
            "time_slot": "Immediate (Post-Storm)",
            "category": "Crisis Response",
            "priority": "Critical",
            "assigned_worker": "Ramesh Kumar & Anil Singh",
            "assigned_equipment": "Furrow Trencher",
            "water_volume_liters": 0,
            "fertilizer_dosage": "None",
            "weather_dependency": "Immediate",
            "status": "Active / Dispatched",
            "can_reschedule": False
        }
        self.schedule.insert(0, drain_task)

        return {
            "success": True,
            "trigger_rainfall_mm": rain_event_mm,
            "replan_summary": replan_log,
            "new_tasks_added": [drain_task["title"]],
            "total_active_tasks": len(self.schedule)
        }

operations_planner = OperationsPlanner()
