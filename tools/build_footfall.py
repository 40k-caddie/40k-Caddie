"""Footfall data: prune the BSData 11th edition files for the in-app list builder.

Usage: python build_footfall.py <bsdata_dir> <out_dir>

Keeps the BattleScribe structure (entries, links, constraints, modifiers, conditions,
costs, categories, profiles, associations) so the app's engine can read the real rules.
Drops: Legends, Crusade, Boarding Actions, comments, page refs, publications.
Writes one minified file per catalogue, plus index.json listing the factions and the
libraries each one needs.
"""
import glob
import json
import os
import re
import sys

DROP_KEYS = {"publicationId", "page", "comment", "authorName", "readme", "publications", "xmlns",
             "battleScribeVersion", "import", "defaultSelectionEntryId", "gameSystemRevision",
             "authorContact", "authorUrl"}
# exact names only: "Crusader Squad" and similar must survive
CRUSADE = re.compile(r"(?i)^(crusade|crusade force|crusade army|crusade relics|crusade points|crusade:.*|battle honours|"
                     r"battle scars|experience points|order of battle|requisitions?|weapon modifications|"
                     r"legendary veterans|blackstone fragments|boarding actions?|.*\(unbound adversaries\))$")
LEGENDS = re.compile(r"(?i)\[legends\]|^show legends$")


def dropped(node):
    n = node.get("name") or node.get("childName") or ""
    return bool(LEGENDS.search(n) or CRUSADE.search(n))


def prune(o):
    if isinstance(o, list):
        out = []
        for v in o:
            if isinstance(v, dict) and "name" in v and dropped(v) and "conditions" not in v:
                continue
            p = prune(v)
            if p not in (None, {}, []):
                out.append(p)
        return out
    if isinstance(o, dict):
        out = {}
        for k, v in o.items():
            if k in DROP_KEYS:
                continue
            if v in (None, "", [], {}) or v is False:
                continue
            p = prune(v)
            if p in (None, {}, []):
                continue
            out[k] = p
        return out
    if isinstance(o, str):
        return o.strip()
    return o


def main():
    src, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    index = {"factions": [], "libraries": [], "system": "system.json"}
    try:
        import subprocess
        sha, when = subprocess.check_output(["git", "-C", src, "log", "-1", "--format=%h %cI"], text=True).split()
        index["source"] = {"repo": "BSData/wh40k-11e", "commit": sha, "date": when[:10]}
    except Exception:
        pass
    total = 0
    for f in sorted(glob.glob(os.path.join(src, "*.json"))):
        data = json.load(open(f, encoding="utf-8"))
        kind = "gameSystem" if "gameSystem" in data else "catalogue"
        body = data[kind]
        if kind == "gameSystem":
            body["forceEntries"] = [x for x in body.get("forceEntries", []) if x.get("name") == "Army Roster"]
            body["costTypes"] = [x for x in body.get("costTypes", []) if not CRUSADE.search(x.get("name", ""))]
            name = "system.json"
        else:
            name = re.sub(r"[^a-z0-9]+", "-", body["name"].lower()).strip("-") + ".json"
            libs = [l.get("targetId") for l in body.get("catalogueLinks", [])]
            rec = {"name": body["name"], "id": body["id"], "file": name, "libs": libs}
            (index["libraries"] if body.get("library") else index["factions"]).append(rec)
        p = prune(body)
        s = json.dumps(p, ensure_ascii=False, separators=(",", ":"))
        open(os.path.join(out, name), "w", encoding="utf-8").write(s)
        total += len(s)
    ids = {r["id"]: r["file"] for r in index["factions"] + index["libraries"]}
    for r in index["factions"] + index["libraries"]:
        r["libs"] = [ids[i] for i in r["libs"] if i in ids]
    json.dump(index, open(os.path.join(out, "index.json"), "w"), ensure_ascii=False, separators=(",", ":"))
    print(f"{len(index['factions'])} factions, {len(index['libraries'])} libraries, {total / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
