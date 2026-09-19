"""
AgriPilot - Farm-to-Market Autonomous Coordination Agent (Module 6.4.12)
Implements:
1. End-to-end coordination: Crop Readiness -> Harvester Booking -> Freight Logistics -> Mandi APMC Matching.
2. Evaluates regional market distances, net realized price after freight, and queue wait times.
3. Eliminates post-harvest delay and prevents distressed intermediary exploitation.
"""

from typing import Dict, Any, List
from datetime import datetime, timedelta

REGIONAL_MANDIS = [
    {
        "mandi_id": "APMC-INDORE",
        "name": "Indore Main Grain Terminal (Madhya Pradesh)",
        "distance_km": 42,
        "transit_hours": 1.5,
        "freight_cost_per_qtl": 45.0,
        "current_crop_price": {
            "Wheat": 2480.0,
            "Chickpea": 5850.0,
            "Soybean": 4600.0
        },
        "daily_arrivals_mt": 1400,
        "average_unloading_queue_hours": 2.5,
        "payment_settlement_speed": "Same Day e-NAM Direct Bank Transfer",
        "rating": 4.8
    },
    {
        "mandi_id": "APMC-UJJAIN",
        "name": "Ujjain Krishi Upaj Mandi",
        "distance_km": 68,
        "transit_hours": 2.2,
        "freight_cost_per_qtl": 70.0,
        "current_crop_price": {
            "Wheat": 2440.0,
            "Chickpea": 5780.0,
            "Soybean": 4520.0
        },
        "daily_arrivals_mt": 950,
        "average_unloading_queue_hours": 1.2,
        "payment_settlement_speed": "24 Hours e-NAM",
        "rating": 4.5
    },
    {
        "mandi_id": "APMC-DEWAS",
        "name": "Dewas Sub-Market Hub",
        "distance_km": 28,
        "transit_hours": 0.8,
        "freight_cost_per_qtl": 30.0,
        "current_crop_price": {
            "Wheat": 2410.0,
            "Chickpea": 5690.0,
            "Soybean": 4480.0
        },
        "daily_arrivals_mt": 520,
        "average_unloading_queue_hours": 0.8,
        "payment_settlement_speed": "Cash on Spot / 48 Hours Bank",
        "rating": 4.2
    }
]

LOGISTICS_FLEET = [
    {
        "vehicle_id": "TRUCK-MP-09-5412",
        "type": "TATA 407 (Medium Freight)",
        "capacity_tonnes": 4.5,
        "capacity_quintals": 45,
        "rate_per_km": 28.0,
        "driver_name": "Balwinder Singh",
        "driver_phone": "+91 98260 11422",
        "availability": "Available for booking",
        "location": "Indore Bypass Hub"
    },
    {
        "vehicle_id": "TROLLEY-JD-5050",
        "type": "John Deere Tractor Trolley (Twin Axle)",
        "capacity_tonnes": 8.0,
        "capacity_quintals": 80,
        "rate_per_km": 35.0,
        "driver_name": "Gurdeep Singh",
        "driver_phone": "+91 98261 44810",
        "availability": "Available for booking",
        "location": "North Farm Base"
    }
]

class FarmToMarketAgent:
    def __init__(self):
        pass

    def evaluate_harvest_and_logistics(
        self,
        crop: str = "Wheat",
        field_id: str = "FIELD-NORTH-01",
        field_area_ha: float = 2.4,
        maturity_pct: float = 95.0
    ) -> Dict[str, Any]:
        """
        Coordinates the complete farm-to-market journey:
        Checks harvest readiness -> matches regional APMC mandis -> calculates net realized revenue after freight -> suggests transport booking.
        """
        expected_yield_qtl_ha = 45.0 if crop == "Wheat" else 22.0
        total_estimated_quintals = round(field_area_ha * expected_yield_qtl_ha, 1)
        total_tonnes = round(total_estimated_quintals / 10.0, 1)

        # Analyze each mandi and calculate Net Realized Price = Price - Freight
        mandi_comparisons = []
        for mandi in REGIONAL_MANDIS:
            gross_price = mandi["current_crop_price"].get(crop, 2400.0)
            freight = mandi["freight_cost_per_qtl"]
            net_realized_price = gross_price - freight
            total_net_revenue = round(net_realized_price * total_estimated_quintals)

            mandi_comparisons.append({
                "mandi_id": mandi["mandi_id"],
                "mandi_name": mandi["name"],
                "distance_km": mandi["distance_km"],
                "transit_time": f"{mandi['transit_hours']} hrs",
                "gross_price_per_qtl": gross_price,
                "freight_per_qtl": freight,
                "net_realized_price_per_qtl": net_realized_price,
                "total_net_payout_inr": total_net_revenue,
                "queue_wait_hours": mandi["average_unloading_queue_hours"],
                "settlement": mandi["payment_settlement_speed"]
            })

        # Rank mandis by net payout
        mandi_comparisons.sort(key=lambda x: x["net_realized_price_per_qtl"], reverse=True)
        best_mandi = mandi_comparisons[0]

        # Recommend logistics based on volume
        recommended_vehicles = []
        rem_quintals = total_estimated_quintals
        for v in LOGISTICS_FLEET:
            if rem_quintals > 0:
                recommended_vehicles.append(v)
                rem_quintals -= v["capacity_quintals"]

        harvest_readiness_status = "Ready for Immediate Harvest" if maturity_pct >= 90.0 else "Approaching Maturity (Hold for 7-10 Days)"

        return {
            "crop": crop,
            "field_id": field_id,
            "field_area_ha": field_area_ha,
            "crop_maturity_pct": maturity_pct,
            "harvest_readiness_status": harvest_readiness_status,
            "total_estimated_production": {
                "tonnes": total_tonnes,
                "quintals": total_estimated_quintals
            },
            "best_mandi_recommendation": {
                "mandi_name": best_mandi["mandi_name"],
                "net_price_per_qtl": best_mandi["net_realized_price_per_qtl"],
                "total_expected_payout_inr": best_mandi["total_net_payout_inr"],
                "gain_over_lowest_mandi": best_mandi["total_net_payout_inr"] - mandi_comparisons[-1]["total_net_payout_inr"],
                "rationale": f"Delivers the highest net return after subtracting transport freight (₹{best_mandi['freight_per_qtl']}/Qtl)."
            },
            "all_mandi_comparisons": mandi_comparisons,
            "allocated_logistics": recommended_vehicles,
            "dispatch_checklist": [
                "1. Confirm combine harvester arrival 24 hours prior to dispatch.",
                "2. Conduct digital moisture check on grain sample (target < 13.5%).",
                "3. Generate e-NAM digital gate-pass for priority mandi entry.",
                "4. Dispatch vehicles at 05:00 AM to minimize queue wait at terminal gates."
            ]
        }

farm_to_market_agent = FarmToMarketAgent()
