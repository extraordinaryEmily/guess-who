# Guess Who Game

A beautiful, minimal web application that recreates the classic "Guess Who" game board with your own images.

## Features

- 🎨 **Modern, Minimal UI** - Clean design with smooth animations
- 📤 **Easy Upload** - Drag & drop or click to upload multiple images
- 🎮 **Default Rosters** - Pre-configured themed rosters (Genshin, Harry Potter, Furniture)
- 🖼️ **Picture Frames** - Images displayed in bordered picture frames
- 🎯 **Interactive Board** - Click on images to flip/eliminate them
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- ✨ **Smooth Animations** - Beautiful transitions and hover effects

## How to Use

1. **Upload Images**
   - Click on the upload area or drag and drop your image files
   - You can select multiple images at once
   - All common image formats are supported (JPG, PNG, GIF, WebP, etc.)
   - **OR** use one of the default roster buttons (Genshin, Harry Potter, Furniture)

2. **Create Game Board**
   - Once images are uploaded, click the "Create Game Board" button
   - Your images will be displayed in a grid with picture frames

3. **Play the Game**
   - Click on any image to "flip" it (mark as eliminated)
   - Click again to unflip it
   - Flipped images will be grayed out with an X mark

4. **Start Over**
   - Click "New Game" to reset and upload new images

## Getting Started

Simply open `index.html` in your web browser. No installation or build process required!

### Local Development

If you want to run a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (npx)
npx serve
```

Then open your browser to `http://localhost:8000`

## Default Rosters

The app includes three pre-configured roster themes. To add images to a roster:

1. **Add image files** to the corresponding directory:
   - `default-rosters/genshin/` - For Genshin Impact characters
   - `default-rosters/harry-potter/` - For Harry Potter characters
   - `default-rosters/furniture/` - For furniture items
   
   Supported formats: JPG, PNG, GIF, WebP, SVG

2. **Generate the manifest** by running:
   ```bash
   node generate-rosters.js
   ```
   This automatically scans all roster folders and creates/updates `rosters.json`

3. **Commit both** the images and `rosters.json` to your repository

4. Users can then click the corresponding button on the main page to load that roster

**Example workflow:**
```bash
# Add your images
cp my-images/*.png default-rosters/genshin/

# Generate the manifest
node generate-rosters.js

# Commit everything
git add default-rosters/ rosters.json
git commit -m "Add Genshin roster images"
git push
```

**Note:** You never need to manually edit the image list - the `generate-rosters.js` script automatically discovers all images!

## Files

- `index.html` - Main HTML structure
- `styles.css` - All styling and animations
- `script.js` - Image upload and game logic
- `default-rosters/` - Folder for default roster images
- `generate-rosters.js` - Script to auto-generate roster manifest
- `rosters.json` - Auto-generated list of all roster images
- `README.md` - This file

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Customization

Feel free to customize the appearance by modifying `styles.css`:
- Change the gradient colors
- Adjust picture frame styles
- Modify grid spacing and sizes
- Update animations and transitions

## Tips

- For best results, use images with similar aspect ratios
- The game board automatically adjusts to accommodate any number of images
- Images are stored in browser memory only - they're not uploaded to any server

## License

Free to use and modify as you wish!

Enjoy your Guess Who game! 🎮

