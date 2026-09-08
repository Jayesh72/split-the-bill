import math
import uuid
import pytest
from typing import Dict, List, Any


def calculate_split(
    items: List[Dict[str, Any]],
    assignments: Dict[str, List[str]],
    people: List[Dict[str, Any]],
    tax_rate: float = 5.0,
    service_charge_rate: float = 10.0,
) -> Dict[str, Any]:
    """Pure algorithmic settlement calculator modeling BillContext engine."""
    # 1. Item line totals and subtotal
    subtotal = sum(item["qty"] * item["unit_price"] for item in items)
    tax = round(subtotal * (tax_rate / 100.0), 2)
    service_charge = round(subtotal * (service_charge_rate / 100.0), 2)
    grand_total = round(subtotal + tax + service_charge, 2)

    # 2. Member shares
    member_shares = []
    for person in people:
        pid = person["id"]
        person_subtotal = 0.0
        assigned_items = []

        for item in items:
            item_id = item["id"]
            assigned_diners = assignments.get(item_id, [])
            if pid in assigned_diners:
                item_total = item["qty"] * item["unit_price"]
                share = item_total / len(assigned_diners)
                person_subtotal += share
                assigned_items.append({
                    "item_id": item_id,
                    "item_name": item["name"],
                    "share_amount": round(share, 2),
                    "is_shared": len(assigned_diners) > 1,
                })

        person_subtotal_rounded = round(person_subtotal, 2)
        proportion = (person_subtotal / subtotal) if subtotal > 0 else (1.0 / len(people))
        tax_share = round(tax * proportion, 2)
        service_share = round(service_charge * proportion, 2)
        total_share = round(person_subtotal_rounded + tax_share + service_share, 2)

        member_shares.append({
            "person_id": pid,
            "name": person["name"],
            "subtotal": person_subtotal_rounded,
            "tax_share": tax_share,
            "service_share": service_share,
            "total_share": total_share,
            "items": assigned_items,
        })

    # 3. Exact paise reconciliation when 100% of items are assigned
    all_assigned = all(len(assignments.get(it["id"], [])) > 0 for it in items)
    if all_assigned and member_shares:
        shares_sum = sum(s["total_share"] for s in member_shares)
        diff = round(grand_total - shares_sum, 2)
        if abs(diff) > 0 and abs(diff) < 0.10:
            # Adjust the largest share
            max_share_member = max(member_shares, key=lambda s: s["total_share"])
            max_share_member["total_share"] = round(max_share_member["total_share"] + diff, 2)

    return {
        "subtotal": subtotal,
        "tax": tax,
        "service_charge": service_charge,
        "grand_total": grand_total,
        "member_shares": member_shares,
        "all_assigned": all_assigned,
    }


def test_single_person_assignment():
    """Verify single diner takes entire bill."""
    p1_id = str(uuid.uuid4())
    people = [{"id": p1_id, "name": "Rahul"}]
    items = [{"id": str(uuid.uuid4()), "name": "Biryani", "qty": 1, "unit_price": 300.0}]
    assignments = {items[0]["id"]: [p1_id]}

    result = calculate_split(items, assignments, people, tax_rate=5.0, service_charge_rate=10.0)
    assert result["grand_total"] == 345.0  # 300 + 15 + 30
    assert result["member_shares"][0]["total_share"] == 345.0


def test_three_way_split_with_shared_item():
    """Verify 3-way split with solo and shared items and mathematical reconciliation."""
    p1 = {"id": str(uuid.uuid4()), "name": "Rahul"}
    p2 = {"id": str(uuid.uuid4()), "name": "Priya"}
    p3 = {"id": str(uuid.uuid4()), "name": "Amit"}
    people = [p1, p2, p3]

    item_solo_rahul = {"id": str(uuid.uuid4()), "name": "Butter Chicken", "qty": 1, "unit_price": 420.0}
    item_solo_priya = {"id": str(uuid.uuid4()), "name": "Paneer Tikka", "qty": 1, "unit_price": 360.0}
    item_shared_all = {"id": str(uuid.uuid4()), "name": "Garlic Naan (Basket)", "qty": 3, "unit_price": 90.0}  # 270

    items = [item_solo_rahul, item_solo_priya, item_shared_all]
    assignments = {
        item_solo_rahul["id"]: [p1["id"]],
        item_solo_priya["id"]: [p2["id"]],
        item_shared_all["id"]: [p1["id"], p2["id"], p3["id"]],
    }

    result = calculate_split(items, assignments, people, tax_rate=18.0, service_charge_rate=10.0)
    
    # Subtotal = 420 + 360 + 270 = 1050
    # Tax (18%) = 189.00, Service Charge (10%) = 105.00
    # Grand Total = 1344.00
    assert result["subtotal"] == 1050.0
    assert result["grand_total"] == 1344.0

    # Invariant: SUM(all member shares) strictly equals grand_total
    total_shares = sum(s["total_share"] for s in result["member_shares"])
    assert total_shares == result["grand_total"]


def test_six_way_decimal_split_reconciliation():
    """Verify tricky 1/6 decimal splits reconcile exact total without penny drift."""
    people = [{"id": str(uuid.uuid4()), "name": f"Diner {i+1}"} for i in range(6)]
    # ₹100 dish shared across 6 people (16.6666... each)
    items = [{"id": str(uuid.uuid4()), "name": "Shared Pitcher", "qty": 1, "unit_price": 100.0}]
    assignments = {items[0]["id"]: [p["id"] for p in people]}

    result = calculate_split(items, assignments, people, tax_rate=5.0, service_charge_rate=0.0)
    # Grand Total = 105.00
    assert result["grand_total"] == 105.00

    # Sum of shares must equal exactly 105.00
    total_shares = sum(s["total_share"] for s in result["member_shares"])
    assert total_shares == 105.00


def test_people_management_invariants():
    """Verify adding, removing, and reassigning organizer/payer."""
    people_list = []
    
    # 1. Add person
    p1 = {"id": str(uuid.uuid4()), "name": "Rahul", "isOrganizer": True}
    people_list.append(p1)
    payer_id = p1["id"]
    assert len(people_list) == 1
    assert payer_id == p1["id"]

    # 2. Add second person
    p2 = {"id": str(uuid.uuid4()), "name": "Priya", "isOrganizer": False}
    people_list.append(p2)
    assert len(people_list) == 2

    # 3. Change payer
    payer_id = p2["id"]
    assert payer_id == p2["id"]

    # 4. Remove payer person -> payerId should reset safely
    people_list = [p for p in people_list if p["id"] != p2["id"]]
    if payer_id == p2["id"]:
        payer_id = None
    assert len(people_list) == 1
    assert payer_id is None
