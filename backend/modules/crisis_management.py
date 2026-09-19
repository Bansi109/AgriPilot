"""
AgriPilot - Farm Crisis Response & Incident Management Engine (Module 6.4.9)
Implements:
1. Automated anomaly detection triggering structured emergency incidents.
2. Incident life-cycle management: Detected -> Escalated -> Action Assigned -> Resolved.
3. Rapid mitigation protocols for waterlogging, heat stress, pest outbreaks, and hardware failures.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid

INITIAL_INCIDENTS = [
    {
        "incident_id": "INC-2026-042",
        "type": "Potential Waterlogging Hazard",
        "severity": "High",
        "affected_field_id": "FIELD-NORTH-01",
        "affected_field_name": "North Plot — Alpha Ridge",
        "detected_at": "2026-09-18 16:45:00",
        "trigger_condition": "Soil moisture reading at 88.5% with 22mm unseasonal storm predicted in next 18 hours.",
        "current_telemetry": {"moisture_pct": 88.5, "soil_ec": 1.45, "temp_c": 24.2},
        "recommended_actions": [
            "Immediately shut off primary irrigation valve VALVE-N1-01.",
            "Open drainage sluice gates on North-West furrow to prevent root-zone hypoxia.",
            "Postpone all scheduled fertilizer injections to eliminate nitrate runoff."
        ],
        "assigned_worker": "Ramesh Kumar (Farm Technician)",
        "assigned_equipment": "Perimeter Drainage Pump P-03",
        "escalation_status": "Escalated to Agronomist",
        "resolution_status": "Investigating",
        "agronomist_notes": "Agronomist Dr. Verma notified via SMS escalation. Furrow inspection scheduled for 08:00 AM."
    },
    {
        "incident_id": "INC-2026-041",
        "type": "Leaf Disease Outbreak (Yellow Rust)",
        "severity": "Critical",
        "affected_field_id": "FIELD-NORTH-01",
        "affected_field_name": "North Plot — Alpha Ridge",
        "detected_at": "2026-09-17 11:20:00",
        "trigger_condition": "Drone visual scan detected linear yellow pustule clusters on flag leaves (>12% foliar severity).",
        "current_telemetry": {"severity_pct": 12.4, "rh_pct": 82.0, "temp_c": 16.5},
        "recommended_actions": [
            "Spot spray Propiconazole 25% EC @ 1 ml/L on focus patches.",
            "Verify spray weather window: wind < 12 km/h and zero rain forecast.",
            "Check Pre-Harvest Interval (PHI) compliance (14 days minimum)."
        ],
        "assigned_worker": "Suresh Patel (Sprayer Operator)",
        "assigned_equipment": "Battery Backpack Sprayer Unit #2",
        "escalation_status": "Action Approved",
        "resolution_status": "In Progress",
        "agronomist_notes": "Spray window verified by Weather Agent. Execution scheduled for dawn (06:30 AM)."
    },
    {
        "incident_id": "INC-2026-039",
        "type": "Smart Drip Valve Flow Meter Anomaly",
        "severity": "Medium",
        "affected_field_id": "FIELD-SOUTH-02",
        "affected_field_name": "South Plot — Delta Basin",
        "detected_at": "2026-09-15 09:10:00",
        "trigger_condition": "Telemetry mismatch: Valve VALVE-S2-02 commanded OPEN, but inline flow meter reported 0.0 LPM.",
        "current_telemetry": {"commanded_state": "OPEN", "measured_flow_lpm": 0.0, "line_pressure_bar": 0.2},
        "recommended_actions": [
            "Inspect main line sand filter for particulate clogging.",
            "Check solenoid 24V DC wiring and valve coil impedance.",
            "Reroute critical irrigation via auxiliary manual bypass valve B-2."
        ],
        "assigned_worker": "Anil Singh (Irrigation Specialist)",
        "assigned_equipment": "Maintenance Toolset & Multimeter",
        "escalation_status": "Resolved",
        "resolution_status": "Resolved",
        "agronomist_notes": "Clogged disc filter cleaned and backflushed. Inline flow restored to nominal 115 LPM."
    }
]

class CrisisManagementSystem:
    def __init__(self):
        self.incidents = list(INITIAL_INCIDENTS)

    def get_all_incidents(self) -> List[Dict[str, Any]]:
        return sorted(self.incidents, key=lambda x: x["detected_at"], reverse=True)

    def create_incident(
        self,
        incident_type: str,
        severity: str,
        field_id: str,
        field_name: str,
        trigger_condition: str,
        telemetry: Dict[str, Any],
        recommended_actions: List[str],
        assigned_worker: str = "Unassigned",
        assigned_equipment: str = "Standard Farm Tools"
    ) -> Dict[str, Any]:
        incident_id = f"INC-2026-{len(self.incidents) + 43:03d}"
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        new_incident = {
            "incident_id": incident_id,
            "type": incident_type,
            "severity": severity,
            "affected_field_id": field_id,
            "affected_field_name": field_name,
            "detected_at": now_str,
            "trigger_condition": trigger_condition,
            "current_telemetry": telemetry,
            "recommended_actions": recommended_actions,
            "assigned_worker": assigned_worker,
            "assigned_equipment": assigned_equipment,
            "escalation_status": "Escalated to Agronomist" if severity in ["Critical", "High"] else "Auto-Managed",
            "resolution_status": "Investigating",
            "agronomist_notes": "Incident registered by Risk Detection Agent stream buffer."
        }
        self.incidents.insert(0, new_incident)
        return new_incident

    def update_incident_status(
        self,
        incident_id: str,
        resolution_status: str,
        agronomist_notes: str = ""
    ) -> Optional[Dict[str, Any]]:
        for inc in self.incidents:
            if inc["incident_id"] == incident_id:
                inc["resolution_status"] = resolution_status
                if agronomist_notes:
                    inc["agronomist_notes"] = agronomist_notes
                if resolution_status == "Resolved":
                    inc["escalation_status"] = "Resolved"
                    inc["resolved_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                return inc
        return None

crisis_management_system = CrisisManagementSystem()
