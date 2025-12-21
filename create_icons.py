from PIL import Image

# Open the source image
source = Image.open('icons/color-meow.png')

# Convert to RGBA if not already
source = source.convert('RGBA')

# Get the main character area (crop out the text at bottom)
# The image appears to be approximately 1024x1024, and we want to focus on the character
width, height = source.size
# Crop to remove bottom text area - estimate about 15% from bottom
crop_height = int(height * 0.80)
cropped = source.crop((0, 0, width, crop_height))

# Create a square version centered
min_dim = min(cropped.size)
left = (cropped.width - min_dim) // 2
top = (cropped.height - min_dim) // 2
right = left + min_dim
bottom = top + min_dim
square = cropped.crop((left, top, right, bottom))

# Resize to different icon sizes with high-quality resampling
sizes = [16, 32, 48, 128]

for size in sizes:
    resized = square.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(f'icons/icon{size}.png', 'PNG', optimize=True)
    print(f'Created icon{size}.png')

print('All icons created successfully!')
