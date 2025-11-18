#!/usr/bin/env node

/**
 * This script automatically scans the default-rosters directories
 * and generates a rosters.json file with all image filenames.
 * 
 * Run this script whenever you add/remove images from the roster folders:
 * node generate-rosters.js
 */

const fs = require('fs');
const path = require('path');

const ROSTERS_DIR = './default-rosters';
const OUTPUT_FILE = './rosters.json';

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

function getImagesInDirectory(dirPath) {
    try {
        const files = fs.readdirSync(dirPath);
        return files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return IMAGE_EXTENSIONS.includes(ext);
        }).sort();
    } catch (error) {
        console.warn(`Warning: Could not read directory ${dirPath}`);
        return [];
    }
}

function generateRostersManifest() {
    const rosters = {};
    
    // Get all subdirectories in default-rosters
    const rosterNames = fs.readdirSync(ROSTERS_DIR).filter(file => {
        return fs.statSync(path.join(ROSTERS_DIR, file)).isDirectory();
    });
    
    // For each roster, get all images
    rosterNames.forEach(rosterName => {
        const rosterPath = path.join(ROSTERS_DIR, rosterName);
        const images = getImagesInDirectory(rosterPath);
        
        rosters[rosterName] = {
            path: `default-rosters/${rosterName}`,
            images: images
        };
        
        console.log(`✓ ${rosterName}: ${images.length} images found`);
    });
    
    // Write to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(rosters, null, 2));
    console.log(`\n✓ Generated ${OUTPUT_FILE}`);
    console.log(`Total rosters: ${Object.keys(rosters).length}`);
}

// Run the script
try {
    generateRostersManifest();
} catch (error) {
    console.error('Error generating rosters manifest:', error);
    process.exit(1);
}

