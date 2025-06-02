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

    match = re.match(r"([A-Za-z])\/(\d{4})\s+([A-Za-z])\s+(\d+)", body_name)
    if match:
        prefix, year, letter, number = match.groups()
        # return f"{prefix.lower()}{year}_{letter.lower()}{int(number):02d}"
        return [f"{prefix.lower()}{year}_{letter.lower()}{int(number):02d}" , f"{prefix.lower()}{year}_{letter.lower()}_{int(number):02d}" , f"{prefix.lower()}{year}_{letter.lower()}_{int(number)}"]

    
    return [body_name.capitalize()]

def find_naif_code(text: str, input_name: str):
    if input_name.lower() == "megaclite":
        input_name = "Magaclite"
    normalized_names = normalise_name(input_name)

    for normalized_name in normalized_names:
        pattern = re.compile(rf"\b{re.escape(normalized_name)}\b\s+(\d+)", re.IGNORECASE)

        match = pattern.search(text)
        if match:
            return int(match.group(1))
    return None
