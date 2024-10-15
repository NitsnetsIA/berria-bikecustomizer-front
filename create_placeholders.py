from PIL import Image, ImageDraw

def create_placeholder(filename, color):
    img = Image.new('RGB', (800, 600), color=color)
    draw = ImageDraw.Draw(img)
    draw.text((400, 300), f"Placeholder for {filename}", fill=(255, 255, 255))
    img.save(f"static/images/{filename}")

create_placeholder("MAKO-0-0-XX-XX-GRUPO1.png", (200, 200, 200))  # Light gray for layer 0
create_placeholder("MAKO-0-6-XX-XX-RUEDAS1.png", (100, 100, 100))  # Dark gray for layer 6

print("Placeholder images created successfully.")
