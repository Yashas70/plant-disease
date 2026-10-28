"""
Central place for disease → advisory + pesticide mapping.

Keys in DISEASE_ADVISORY must match your class / folder names from class_indices.json.

All other diseases fall back to DEFAULT_ADVISORY.
"""

DEFAULT_ADVISORY = {
    "pesticide_name": "General Fungicide (Safe Option)",
    "pesticide_info": (
        "Dose: 2 g per liter\n"
        "Interval: Every 10–12 days\n"
        "Safety: Wear gloves and mask.\n"
        "Organic: Neem oil 3 ml per liter as preventive spray."
    ),
    "pesticide_image": "default_pesticide.png",
    "organic_note": "",
}

# ---------- PlantVillage classes (38) with pesticide + image ----------
DISEASE_ADVISORY = {
    # 🍎 Apple
    "Apple___Apple_scab": {
        "pesticide_name": "Mancozeb fungicide",
        "pesticide_info": (
            "Dose: 2–2.5 g per liter\n"
            "Interval: Every 10–14 days during disease period\n"
            "Practice: Remove fallen infected leaves and mummified fruits."
        ),
        "pesticide_image": "apple_rot.png",
        "organic_note": ""
    },
    "Apple___Black_rot": {
        "pesticide_name": "Captan / Mancozeb fungicide",
        "pesticide_info": (
            "Spray at early fruit development stage as per local recommendation.\n"
            "Prune and destroy cankered branches and mummified fruits."
        ),
        "pesticide_image": "apple_rot.png",
        "organic_note": ""
    },
    "Apple___Cedar_apple_rust": {
        "pesticide_name": "Rust fungicide",
        "pesticide_info": (
            "Use fungicides effective on rust where registered.\n"
            "Remove nearby juniper hosts where practical."
        ),
        "pesticide_image": "rust.png",
        "organic_note": ""
    },
    "Apple___healthy": {
        "pesticide_name": "No pesticides needed",
        "pesticide_info": (
            "Orchard appears healthy. Maintain pruning, sanitation and balanced nutrition."
        ),
        "pesticide_image": "healthy.png",
        "organic_note": ""
    },

    # 🫐 Blueberry
    "Blueberry___healthy": {
        "pesticide_name": "No pesticides needed",
        "pesticide_info": "Plants appear healthy. Maintain mulching and acidic soil conditions.",
        "pesticide_image": "healthy.png",
        "organic_note": ""
    },

    # 🍒 Cherry
    "Cherry_(including_sour)___Powdery_mildew": {
        "pesticide_name": "Mildew fungicide",
        "pesticide_info": (
            "Dose: 2 g per liter\n"
            "Interval: 10–14 days\n"
            "Practice: Improve aeration of canopy by pruning."
        ),
        "pesticide_image": "mildew.png",
        "organic_note": ""
    },
    "Cherry_(including_sour)___healthy": {
        "pesticide_name": "No pesticides needed",
        "pesticide_info": "Trees healthy. Maintain regular pruning and sanitation.",
        "pesticide_image": "healthy.png",
        "organic_note": ""
    },

    # 🌽 Corn / Maize
    "Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot": {
        "pesticide_name": "Blight fungicide",
        "pesticide_info": (
            "Dose: 2 g per liter\n"
            "Interval: 10–12 days\n"
            "Practice: Follow crop rotation and avoid dense planting."
        ),
        "pesticide_image": "blight.png",
        "organic_note": ""
    },
    "Corn_(maize)___Common_rust_": {
        "pesticide_name": "Rust fungicide",
        "pesticide_info": (
            "Dose: 2 g per liter\n"
            "Interval: 10–12 days\n"
            "Prefer resistant hybrids where available."
        ),
        "pesticide_image": "rust.png",
        "organic_note": ""
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "pesticide_name": "Kavach Fungicide",
        "pesticide_info": (
            "Dose: 2 g per liter\n"
            "Interval: 10–12 days\n"
            "Safety: Avoid spraying in strong wind."
        ),
        "pesticide_image": "Kavach.png",
        "organic_note": "Neem oil 3 ml per liter as a safer preventive spray."
    },
    "Corn_(maize)___healthy": {
        "pesticide_name": "No pesticides needed",
        "pesticide_info": (
            "Crop looks healthy. Maintain balanced fertilizer, irrigation "
            "and regular field scouting."
        ),
        "pesticide_image": "healthy.png",
        "organic_note": "Use compost / FYM to maintain soil health."
    },

    # 🍇 Grape
    "Grape___Black_rot": {
        "pesticide_name": "Systhane",
        "pesticide_info": (
            "Dose: 1 ml per liter\n"
            "Interval: 7–10 days\n"
            "Safety: Avoid spraying near harvest."
        ),
        "pesticide_image": "systhane.png",
        "organic_note": ""
    },
    "Grape___Esca_(Black_Measles)": {
        "pesticide_name": "Amistar (Strobilurin group)",
        "pesticide_info": (
            "Prune and remove affected wood. Apply fungicide as per local "
            "guidance where registered."
        ),
        "pesticide_image": "Amistar.png",
        "organic_note": ""
    },
    "Grape___healthy": {
        "pesticide_name": "No pesticides needed",
        "pesticide_info": (
            "Maintain good canopy management, avoid waterlogging and "
            "monitor regularly."
        ),
        "pesticide_image": "healthy.png",
        "organic_note": ""
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "pesticide_name": "Blight fungicide",
        "pesticide_info": (
            "Dose: 2 g per liter\n"
            "Interval: 7–10 days\n"
            "Remove heavily infected leaves."
        ),
        "pesticide_image": "blight.png",
        "organic_note": ""
    },

    # 🍊 Orange
    "Orange___Haunglongbing_(Citrus_greening)": {
        "pesticide_name": "Vector management + nutrition",
        "pesticide_info": (
            "Control psyllid vectors; apply balanced nutrient sprays.\n"
            "Remove severely affected trees where recommended."
        ),
        "pesticide_image": "potato.png",
        "organic_note": ""
    },

    # 🍑 Peach
    "Peach___Bacterial_spot": {
        "pesticide_name": "Indofil M-45",
        "pesticide_info": (
            "Dose: 2.5 g per liter\n"
            "Interval: 10–12 days\n"
            "Prune and destroy infected twigs and fruits."
        ),
        "pesticide_image": "indofil_m45.png",
        "organic_note": ""
    },
    "Peach___healthy": {
        "pesticide_name": "No pesticides needed",
        "pesticide_info": "Trees healthy. Maintain clean orchard and regular sanitation pruning.",
        "pesticide_image": "healthy.png",
        "organic_note": ""
    },

    # 🌶 Pepper
    "Pepper_bell___Bacterial_spot": {
        "pesticide_name": "Antracol",
        "pesticide_info": (
            "Dose: 3 g per liter\n"
            "Interval: 10 days\n"
            "Avoid overhead irrigation; work in field when foliage is dry."
        ),
        "pesticide_image": "antracol.png",
        "organic_note": ""
    },
    "Pepper_bell___healthy": {
        "pesticide_name": "No pesticides needed",
        "pesticide_info": "Maintain good spacing and weed control.",
        "pesticide_image": "healthy.png",
        "organic_note": ""
    },

    # 🥔 Potato
    "Potato___Early_blight": {
        "pesticide_name": "Indofil M-45",
        "pesticide_info": (
            "Dose: 2.5 g per liter\n"
            "Interval: 10 days\n"
            "Remove lower infected leaves and ensure good aeration."
        ),
        "pesticide_image": "indofil_m45.png",
        "organic_note": ""
    },
    "Potato___Late_blight": {
        "pesticide_name": "Ridomil Gold (Metalaxyl + Mancozeb)",
        "pesticide_info": (
            "Dose: 2 g per liter\n"
            "Interval: 7–10 days in high disease pressure\n"
            "Avoid late evening irrigation."
        ),
        "pesticide_image": "ridomil_gold.png",
        "organic_note": "Where allowed, copper fungicides approved for organic farming can be used preventively."
    },
    "Potato___healthy": {
        "pesticide_name": "No pesticides needed",
        "pesticide_info": "Healthy crop. Maintain timely irrigation and earthing up.",
        "pesticide_image": "healthy.png",
        "organic_note": ""
    },

    # Other crops – only healthy classes
    "Raspberry___healthy": {
        "pesticide_name": "No pesticides needed",
        "pesticide_info": "Plants appear healthy.",
        "pesticide_image": "healthy.png",
        "organic_note": ""
    },
    "Soybean___healthy": {
        "pesticide_name": "No pesticides needed",
        "pesticide_info": "Maintain crop rotation and weed management.",
        "pesticide_image": "healthy.png",
        "organic_note": ""
    },
    "Strawberry___healthy": {
        "pesticide_name": "No pesticides needed",
        "pesticide_info": "Avoid waterlogging and keep beds weed-free.",
        "pesticide_image": "healthy.png",
        "organic_note": ""
    },
    "Strawberry___Leaf_scorch": {
        "pesticide_name": "General Fungicide",
        "pesticide_info": (
            "Remove scorched leaves; improve drainage and avoid overhead irrigation."
        ),
        "pesticide_image": "rust.png",
        "organic_note": "Increase organic matter and mulching to reduce stress."
    },

    # 🎃 Squash
    "Squash___Powdery_mildew": {
        "pesticide_name": "Mildew fungicide",
        "pesticide_info": (
            "Dose: 2 g per liter\n"
            "Interval: 7–10 days\n"
            "Improve air movement around plants."
        ),
        "pesticide_image": "mildew.png",
        "organic_note": "Neem oil or sulphur dust (where permitted) can be used in early infection."
    },

    # 🍅 Tomato
    "Tomato___Bacterial_spot": {
        "pesticide_name": "Antracol",
        "pesticide_info": (
            "Dose: 3 g per liter\n"
            "Interval: 7–10 days\n"
            "Use disease-free seed and avoid overhead irrigation."
        ),
        "pesticide_image": "antracol.png",
        "organic_note": ""
    },
    "Tomato___Early_blight": {
        "pesticide_name": "Blight fungicide",
        "pesticide_info": (
            "Dose: 2 g per liter\n"
            "Interval: 7–10 days\n"
            "Remove older infected leaves."
        ),
        "pesticide_image": "blight.png",
        "organic_note": ""
    },
    "Tomato___Late_blight": {
        "pesticide_name": "Ridomil Gold (Metalaxyl + Mancozeb)",
        "pesticide_info": (
            "Dose: 2 g per liter\n"
            "Interval: 7–10 days\n"
            "Avoid dense planting and water on foliage."
        ),
        "pesticide_image": "ridomil_gold.png",
        "organic_note": "Copper-based fungicides allowed in organic systems may provide some protection."
    },
    "Tomato___Leaf_Mold": {
        "pesticide_name": "Systhane",
        "pesticide_info": (
            "Dose: 1 ml per liter\n"
            "Interval: 7–10 days\n"
            "Reduce humidity in polyhouse conditions."
        ),
        "pesticide_image": "systhane.png",
        "organic_note": ""
    },
    "Tomato___Septoria_leaf_spot": {
        "pesticide_name": "Spot fungicide",
        "pesticide_info": (
            "Dose: 2 g per liter\n"
            "Interval: 7–10 days\n"
            "Remove lower leaves and use mulching to reduce splash."
        ),
        "pesticide_image": "spot.png",
        "organic_note": ""
    },
    "Tomato___Spider_mites_Two-spotted_spider_mite": {
        "pesticide_name": "Neem oil (mite control)",
        "pesticide_info": (
            "Dose: 3 ml per liter\n"
            "Spray on underside of leaves. Avoid high sun hours."
        ),
        "pesticide_image": "healthy.png",
        "organic_note": "Neem oil is a commonly used organic option for mite management."
    },
    "Tomato___Target_Spot": {
        "pesticide_name": "Blight fungicide",
        "pesticide_info": (
            "Dose: 2 g per liter\n"
            "Interval: 7–10 days\n"
            "Maintain crop rotation."
        ),
        "pesticide_image": "blight.png",
        "organic_note": ""
    },
    "Tomato___Tomato_mosaic_virus": {
        "pesticide_name": "No direct fungicide",
        "pesticide_info": (
            "Remove infected plants; disinfect tools and avoid handling when plants are wet.\n"
            "Use virus-free seed/seedlings."
        ),
        "pesticide_image": "healthy.png",
        "organic_note": ""
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "pesticide_name": "Whitefly management",
        "pesticide_info": (
            "Use yellow sticky traps; insect-proof nets and, where necessary, "
            "recommended insecticides for whitefly."
        ),
        "pesticide_image": "healthy.png",
        "organic_note": "Neem oil and sticky traps are safer options for whitefly suppression."
    },
}


def get_advisory(disease_label: str) -> dict:
    """Safely return advisory dict for a given raw disease label."""
    adv = DISEASE_ADVISORY.get(disease_label)
    if adv is None:
        print(f"[DEBUG] No specific advisory for '{disease_label}', using DEFAULT_ADVISORY.")
        return DEFAULT_ADVISORY
    print(f"[DEBUG] Advisory found for '{disease_label}' -> image={adv.get('pesticide_image')}")
    return adv
