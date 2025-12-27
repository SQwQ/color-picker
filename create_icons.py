from PIL import Image
import sys

# Get filename from command line argument, default to newAvatar.png
if len(sys.argv) > 1:
    filename = sys.argv[1]
else:
    filename = 'newAvatar.png'

# Open the source image
source_path = f'icons/{filename}'
print(f'Using source image: {source_path}')

source = Image.open(source_path)

# Convert to RGBA if not already
source = source.convert('RGBA')

# The image should be square already, but let's ensure it
width, height = source.size

# Create a square version centered if needed
if width != height:
    min_dim = min(width, height)
    left = (width - min_dim) // 2
    top = (height - min_dim) // 2
    right = left + min_dim
    bottom = top + min_dim
    square = source.crop((left, top, right, bottom))
else:
    square = source

# Resize to different icon sizes with high-quality resampling
sizes = [16, 32, 48, 128]

for size in sizes:
    resized = square.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(f'icons/icon{size}.png', 'PNG', optimize=True)
    print(f'Created icon{size}.png')

print('All icons created successfully!')
