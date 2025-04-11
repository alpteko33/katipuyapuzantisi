#!/bin/bash

# Create icons directory if it doesn't exist
mkdir -p icons

# Convert SVG to different size PNGs
convert -background none -resize 16x16 src/icons/icon.svg icons/icon16.png
convert -background none -resize 48x48 src/icons/icon.svg icons/icon48.png
convert -background none -resize 128x128 src/icons/icon.svg icons/icon128.png 