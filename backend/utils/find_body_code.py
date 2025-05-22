import re


# def find_body_code(text: str, target_name: str):
#     target_name = target_name.replace(" ", "_")

#     target_name_escaped = re.escape(target_name)
#     pattern = rf"NAIF_BODY_NAME\s+\+=\s+\(\s*'{target_name_escaped}'\s*\)\s*NAIF_BODY_CODE\s+\+=\s+\(\s*(\d+)\s*\)"

#     match = re.search(pattern, text, re.DOTALL)

#     if match:
#         return int(match.group(1))
#     else:
#         return None
def normalise_name(body_name: str) -> str:
    body_name = body_name.strip()

    match = re.match(r"([A-Za-z])/(\d{4})\s+([A-Za-z])\s+(\d+)", body_name)
    if match:
        prefix, year, letter, number = match.groups()
        return f"{prefix.lower()}{year}_{letter.lower()}{int(number):02d}"

    return body_name.capitalize()

# def normalise_name(body_name: str) -> str:

#     m = re.match(r"s(\d{4})s(\d{1,2})", body_name, re.IGNORECASE)
#     if m:
#         year, num = m.groups()
#         return f"S{year}_s{int(num):02d}"
#     else:
#         return body_name.capitalize()

def find_naif_code(text: str, input_name: str):
    normalized = normalise_name(input_name)

    pattern = re.compile(rf"\b{re.escape(normalized)}\b\s+(\d+)", re.IGNORECASE)

    match = pattern.search(text)
    if match:
        return int(match.group(1))
    return None
