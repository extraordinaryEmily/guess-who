// State management
let uploadedImages = [];

// DOM elements
const uploadSection = document.getElementById('upload-section');
const gameSection = document.getElementById('game-section');
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const fileCount = document.getElementById('file-count');
const startGameBtn = document.getElementById('start-game-btn');
const newGameBtn = document.getElementById('new-game-btn');
const gameBoard = document.getElementById('game-board');

// Default roster configurations
const DEFAULT_ROSTERS = {
    'genshin': 'default-rosters/genshin',
    'harry-potter': 'default-rosters/harry-potter',
    'furniture': 'default-rosters/furniture'
};

// Initialize
function init() {
    setupEventListeners();
    updateStartButton();
}

// Event listeners
function setupEventListeners() {
    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Click to upload
    uploadArea.addEventListener('click', (e) => {
        // Prevent double-triggering if clicking directly on the file input
        if (e.target !== fileInput) {
            fileInput.click();
        }
    });
    
    // Prevent file input clicks from bubbling up
    fileInput.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Start game button
    startGameBtn.addEventListener('click', startGame);

    // New game button
    newGameBtn.addEventListener('click', resetGame);

    // Roster buttons
    const rosterBtns = document.querySelectorAll('.roster-btn');
    rosterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const roster = btn.dataset.roster;
            loadDefaultRoster(roster);
        });
    });
}

// Handle file selection
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    processFiles(files);
}

// Handle drag over
function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('dragover');
}

// Handle drag leave
function handleDragLeave(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
}

// Handle drop
function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
        processFiles(imageFiles);
    }
}

// Process uploaded files
function processFiles(files) {
    uploadedImages = [];
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                uploadedImages.push({
                    src: e.target.result,
                    name: file.name,
                    flipped: false
                });
                
                updateFileCount();
                updateStartButton();
            };
            
            reader.readAsDataURL(file);
        }
    });
}

// Update file count display
function updateFileCount() {
    fileCount.textContent = uploadedImages.length;
}

// Update start button state
function updateStartButton() {
    if (uploadedImages.length > 0) {
        startGameBtn.disabled = false;
    } else {
        startGameBtn.disabled = true;
    }
}

// Start the game
function startGame() {
    if (uploadedImages.length === 0) return;
    
    // Hide upload section and show game section
    uploadSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    
    // Build the game board
    buildGameBoard();
}

// Build the game board with picture frames
function buildGameBoard() {
    // Clear existing board
    gameBoard.innerHTML = '';
    
    // Create picture frames for each image
    uploadedImages.forEach((image, index) => {
        const frame = createPictureFrame(image, index);
        gameBoard.appendChild(frame);
    });
}

// Create a picture frame element
function createPictureFrame(image, index) {
    const frame = document.createElement('div');
    frame.className = 'picture-frame';
    frame.dataset.index = index;
    
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.name;
    
    frame.appendChild(img);
    
    // Add click event to flip the frame
    frame.addEventListener('click', () => toggleFrame(index));
    
    return frame;
}

// Toggle frame flipped state
function toggleFrame(index) {
    uploadedImages[index].flipped = !uploadedImages[index].flipped;
    
    const frame = document.querySelector(`[data-index="${index}"]`);
    if (uploadedImages[index].flipped) {
        frame.classList.add('flipped');
    } else {
        frame.classList.remove('flipped');
    }
}

// Load default roster
async function loadDefaultRoster(rosterName) {
    const rosterPath = DEFAULT_ROSTERS[rosterName];
    
    try {
        // Clear any existing images
        uploadedImages = [];
        
        // Fetch the list of images in the roster directory
        const response = await fetch(rosterPath);
        
        if (!response.ok) {
            console.warn(`Could not load roster: ${rosterName}. Make sure images exist in ${rosterPath}/`);
            alert(`No images found in the ${rosterName} roster yet. Please add images to the ${rosterPath}/ folder.`);
            return;
        }
        
        // Parse the HTML to find image files
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
        
        // Filter for image files
        const imageFiles = links
            .map(link => link.getAttribute('href'))
            .filter(href => href && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(href));
        
        if (imageFiles.length === 0) {
            alert(`No images found in the ${rosterName} roster yet. Please add images to the ${rosterPath}/ folder.`);
            return;
        }
        
        // Load each image
        for (const imageFile of imageFiles) {
            const imagePath = `${rosterPath}/${imageFile}`;
            await loadImageFromUrl(imagePath);
        }
        
        updateFileCount();
        updateStartButton();
        
    } catch (error) {
        console.error('Error loading default roster:', error);
        alert(`Could not load the ${rosterName} roster. Make sure images are placed in the ${rosterPath}/ folder.`);
    }
}

// Load image from URL
function loadImageFromUrl(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            // Convert image to data URL
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            const dataUrl = canvas.toDataURL('image/png');
            const fileName = url.split('/').pop();
            
            uploadedImages.push({
                src: dataUrl,
                name: fileName,
                flipped: false
            });
            
            resolve();
        };
        
        img.onerror = () => {
            console.warn(`Failed to load image: ${url}`);
            resolve(); // Continue even if one image fails
        };
        
        img.src = url;
    });
}

// Reset game
function resetGame() {
    // Clear uploaded images
    uploadedImages = [];
    
    // Clear game board
    gameBoard.innerHTML = '';
    
    // Reset file input
    fileInput.value = '';
    
    // Update UI
    updateFileCount();
    updateStartButton();
    
    // Show upload section and hide game section
    gameSection.classList.add('hidden');
    uploadSection.classList.remove('hidden');
}

// Initialize the app
init();

