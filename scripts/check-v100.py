from pathlib import Path

root = Path("staging/v100")

required = [
    "index.html",
    "render.yaml",
    "assets/v100-calm.css",
    "services/index.html",
    "services/starlink.html",
    "services/networking.html",
    "services/smart-home-security.html",
    "services/tv-mounting.html",
    "services/audio-video.html",
]

missing = [
    name for name in required
    if not (root / name).is_file()
]

print("V100 staging verification")
print(f"Required files present: {len(required) - len(missing)}/{len(required)}")

if missing:
    print("Still needed:")
    for name in missing:
        print(" -", name)
    print("Migration incomplete — current homepage remains unchanged.")
else:
    print("Core files present. Full asset validation still required.")
