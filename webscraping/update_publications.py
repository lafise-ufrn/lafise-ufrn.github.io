from pathlib import Path
import subprocess
import sys

def ensure(package):
    try:
        __import__(package)
    except ImportError:
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", package]
        )

ensure("scholarly")

import json
from scholarly import scholarly

AUTHOR_ID = "0aEa27QAAAAJ"

author = scholarly.search_author_id(AUTHOR_ID)
author = scholarly.fill(author, sections=["publications"])

publications = []

for pub in author["publications"]:

    # Baixa os detalhes da publicação
    pub = scholarly.fill(pub)

    bib = pub.get("bib", {})

    publications.append({

        "title": bib.get("title", ""),

        "authors": bib.get("author", ""),

        "journal": (
            bib.get("journal")
            or bib.get("conference")
            or bib.get("booktitle")
            or ""
        ),

        "year": int(bib.get("pub_year", 0)),

        "abstract": bib.get("abstract", ""),

        "citations": pub.get("num_citations", 0),

        "url": pub.get("pub_url", ""),

        "doi": ""

    })

publications.sort(
    key=lambda p: p["year"],
    reverse=True
)

with open("../lafise_lab_website/data/publications.json", "w", encoding="utf-8") as f:

    json.dump(
        publications,
        f,
        ensure_ascii=False,
        indent=4
    )

print(f"{len(publications)} publications saved.")