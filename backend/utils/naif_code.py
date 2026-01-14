import re

PATTERNS = []


def normalise_name(body_name: str) -> list[str]:
    body_name = body_name.strip()

    match = re.match(r"([A-Za-z])\/(\d{4})\s+([A-Za-z])\s+(\d+)", body_name)
    if match:
        prefix, year, letter, number = match.groups()
        return [
            f"{prefix.lower()}{year}_{letter.lower()}{int(number):02d}",
            f"{prefix.lower()}{year}_{letter.lower()}_{int(number):02d}",
            f"{prefix.lower()}{year}_{letter.lower()}_{int(number)}",
            f"{prefix.lower()}{year}_{letter.lower()}{int(number)}",
        ]

    return [body_name.capitalize()]


def find_naif_code(text: str, input_name: str) -> int | None:
    if input_name.lower() == "megaclite":
        input_name = "Magaclite"
    normalized_names = normalise_name(input_name)

    for normalized_name in normalized_names:
        PATTERNS = []
        PATTERNS.append(
            re.compile(rf"\b{re.escape(normalized_name)}\b\s+(\d+)", re.IGNORECASE)
        )
        PATTERNS.append(
            re.compile(
                r"NAIF_BODY_NAME\s*\+=\s*\(\s*'"
                + re.escape(normalized_name)
                + r"'\s*\)\s*NAIF_BODY_CODE\s*\+=\s*\(\s*(\d+)\s*\)",
                re.IGNORECASE,
            )
        )
        # pattern = re.compile(
        #     rf"\b{re.escape(normalized_name)}\b\s+(\d+)", re.IGNORECASE
        # )

        for pattern in PATTERNS:
            match = pattern.search(text)
            if match:
                return int(match.group(1))
        # match = pattern.search(text)
        # if match:
        #     return int(match.group(1))
    return None
