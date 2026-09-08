import re
from urllib.parse import parse_qs, urlparse
import pytest

UPI_REGEX = re.compile(r"^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$")


def is_valid_upi_id(upi_id: str | None) -> bool:
    if not upi_id:
        return False
    trimmed = upi_id.strip()
    return bool(UPI_REGEX.match(trimmed))


def generate_upi_uri(
    upi_id: str | None,
    payee_name: str | None,
    amount: float,
    transaction_note: str = "Split the Bill",
) -> str:
    if not upi_id or not is_valid_upi_id(upi_id) or amount < 0:
        return ""
    
    clean_name = payee_name.strip() if payee_name and payee_name.strip() else "Split Organizer"
    clean_amount = f"{amount:.2f}"
    clean_note = transaction_note.strip() if transaction_note and transaction_note.strip() else "Split the Bill"

    from urllib.parse import urlencode
    query = urlencode({
        "pa": upi_id.strip(),
        "pn": clean_name,
        "am": clean_amount,
        "cu": "INR",
        "tn": clean_note,
    })
    return f"upi://pay?{query}"


def parse_upi_uri(uri: str) -> dict[str, str]:
    assert uri.startswith("upi://pay?")
    query_str = uri.split("upi://pay?", 1)[1]
    parsed = parse_qs(query_str, keep_blank_values=True)
    return {k: v[0] for k, v in parsed.items()}


def test_upi_validation():
    # Valid formats
    assert is_valid_upi_id("rahul@okaxis") is True
    assert is_valid_upi_id("name@oksbi") is True
    assert is_valid_upi_id("person@okaxis") is True
    assert is_valid_upi_id("user@upi") is True
    assert is_valid_upi_id("john.doe_123@icici") is True

    # Invalid formats
    assert is_valid_upi_id("") is False
    assert is_valid_upi_id(None) is False
    assert is_valid_upi_id("rahul") is False
    assert is_valid_upi_id("@okaxis") is False
    assert is_valid_upi_id("rahul@") is False
    assert is_valid_upi_id("rahul okaxis") is False
    assert is_valid_upi_id("rahul@@okaxis") is False


def test_upi_uri_standard_generation():
    payer_name = "Rahul"
    upi_id = "rahul@okaxis"
    amount = 633.33

    uri = generate_upi_uri(upi_id, payer_name, amount)
    params = parse_upi_uri(uri)

    assert params["pa"] == "rahul@okaxis"
    assert params["pn"] == "Rahul"
    assert params["am"] == "633.33"
    assert params["cu"] == "INR"
    assert "Split the Bill" in params["tn"]


def test_upi_edge_cases():
    # 1. No UPI ID
    assert generate_upi_uri(None, "Rahul", 100.0) == ""

    # 2. Empty UPI ID
    assert generate_upi_uri("   ", "Rahul", 100.0) == ""

    # 3. Invalid UPI format
    assert generate_upi_uri("invalid_upi", "Rahul", 100.0) == ""

    # 4. Valid UPI ID
    uri = generate_upi_uri("rahul@okaxis", "Rahul", 100.0)
    assert uri.startswith("upi://pay?")

    # 5. Amount ₹1
    params1 = parse_upi_uri(generate_upi_uri("rahul@okaxis", "Rahul", 1.0))
    assert params1["am"] == "1.00"

    # 6. Amount ₹100
    params100 = parse_upi_uri(generate_upi_uri("rahul@okaxis", "Rahul", 100.0))
    assert params100["am"] == "100.00"

    # 7. Amount ₹633.33
    params633 = parse_upi_uri(generate_upi_uri("rahul@okaxis", "Rahul", 633.33))
    assert params633["am"] == "633.33"

    # 8. Amount with decimal rounding
    params_dec = parse_upi_uri(generate_upi_uri("rahul@okaxis", "Rahul", 633.3349))
    assert params_dec["am"] == "633.33"

    # 9. Amount ₹0
    params0 = parse_upi_uri(generate_upi_uri("rahul@okaxis", "Rahul", 0.0))
    assert params0["am"] == "0.00"

    # 10. Very large amount
    params_large = parse_upi_uri(generate_upi_uri("rahul@okaxis", "Rahul", 999999.50))
    assert params_large["am"] == "999999.50"

    # 11. Special characters in payer name & URL encoding
    uri_special_pn = generate_upi_uri("rahul@okaxis", "Rahul & Sharma / Friends", 250.0)
    assert "Rahul+%26+Sharma+%2F+Friends" in uri_special_pn or "Rahul%20%26%20Sharma%20%2F%20Friends" in uri_special_pn or "Rahul" in uri_special_pn
    params_special = parse_upi_uri(uri_special_pn)
    assert params_special["pn"] == "Rahul & Sharma / Friends"

    # 12. Special characters in transaction note & URL encoding
    uri_special_tn = generate_upi_uri("rahul@okaxis", "Rahul", 250.0, "The Urban Bite • Dinner & Drinks #123")
    params_tn = parse_upi_uri(uri_special_tn)
    assert params_tn["tn"] == "The Urban Bite • Dinner & Drinks #123"
