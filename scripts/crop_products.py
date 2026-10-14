import os
from PIL import Image

src_folder = r"C:\Users\azeez\.gemini\antigravity-ide\brain\6c9c2a6c-4435-47f0-80b3-ecd0a0cb90e9\.user_uploaded"
dest_folder = r"c:\Users\azeez\Downloads\moneyfox-version2-main (1)\moneyfox-version2-main\public\images\products"
os.makedirs(dest_folder, exist_ok=True)

products = [
    {
        "id": "chill-black",
        "file": "media_1791718461383.png",
        "crops": {
            "front": (0, 0, 335, 335),
            "back": (345, 0, 678, 335),
            "left": (685, 0, 1024, 335),
            "right": (0, 340, 320, 678),
            "top": (345, 340, 678, 678),
            "bottom": (685, 340, 1024, 678),
        }
    },
    {
        "id": "corner-black",
        "file": "media_1791718461458.png",
        "crops": {
            "front": (0, 0, 335, 335),
            "back": (345, 0, 678, 335),
            "left": (685, 0, 1024, 335),
            "right": (0, 340, 320, 678),
            "top": (345, 340, 678, 678),
            "bottom": (685, 340, 1024, 678),
        }
    },
    {
        "id": "better-black",
        "file": "media_1791718461632.jpg",
        "crops": {
            "front": (0, 0, 335, 405),
            "back": (345, 0, 678, 405),
            "left": (685, 0, 1024, 405),
            "right": (0, 410, 320, 815),
            "top": (345, 410, 678, 815),
            "bottom": (685, 410, 1024, 815),
        }
    },
    {
        "id": "better-purple",
        "file": "media_1791718461680.jpg",
        "crops": {
            "front": (0, 0, 335, 345),
            "back": (345, 0, 678, 345),
            "left": (685, 0, 1024, 345),
            "right": (0, 350, 320, 695),
            "top": (345, 350, 678, 695),
            "bottom": (685, 350, 1024, 695),
        }
    },
    {
        "id": "corner-navy",
        "file": "media_1791718461754.jpg",
        "crops": {
            "front": (0, 0, 335, 335),
            "back": (345, 0, 678, 335),
            "left": (685, 0, 1024, 335),
            "right": (0, 340, 320, 678),
            "top": (345, 340, 678, 678),
            "bottom": (685, 340, 1024, 678),
        }
    },
]

for p in products:
    p_dir = os.path.join(dest_folder, p["id"])
    os.makedirs(p_dir, exist_ok=True)
    img_path = os.path.join(src_folder, p["file"])
    orig_img = Image.open(img_path).convert("RGB")
    
    orig_img.save(os.path.join(p_dir, "sheet.jpg"), quality=95)
    
    for angle, box in p["crops"].items():
        cropped = orig_img.crop(box)
        out_path = os.path.join(p_dir, f"{angle}.jpg")
        cropped.save(out_path, quality=95)
        print(f"Saved {p['id']} {angle}: {cropped.size}")

print("All product angle crops saved with clean borders!")
