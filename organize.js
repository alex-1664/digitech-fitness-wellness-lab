const fs = require('fs');
const path = require('path');

// Load configuration
const configPath = path.join(__dirname, 'folderConfig.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Log file
const logPath = path.join(__dirname, 'organize-log.txt');
fs.appendFileSync(logPath, `\n=== Run at ${new Date().toLocaleString()} ===\n`);

// Create folders recursively
function createFolders(folders) {
  for (const folder of Object.keys(folders)) {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      console.log(`Created folder: ${folder}`);
    }
  }
  // Create misc folder
  if (config.miscFolder && !fs.existsSync(config.miscFolder)) {
    fs.mkdirSync(config.miscFolder, { recursive: true });
    console.log(`Created misc folder: ${config.miscFolder}`);
  }
}

// Move files safely
function moveFiles(folders) {
  const allFiles = fs.readdirSync('.');
  for (const file of allFiles) {
    const ext = path.extname(file);
    const stat = fs.lstatSync(file);
    if (stat.isFile() && file !== 'organize.js' && file !== 'folderConfig.json') {
      let moved = false;
      for (const [folder, extensions] of Object.entries(folders)) {
        if (extensions.includes(ext)) {
          moveFileToFolder(file, folder);
          moved = true;
          break;
        }
      }
      if (!moved) {
        moveFileToFolder(file, config.miscFolder);
      }
    }
  }
}

// Function to move a file safely
function moveFileToFolder(file, folder) {
  const dest = path.join(folder, file);
  let finalDest = dest;
  let counter = 1;

  // Avoid overwriting
  while (fs.existsSync(finalDest)) {
    const name = path.parse(file).name;
    const ext = path.parse(file).ext;
    finalDest = path.join(folder, `${name}_${counter}${ext}`);
    counter++;
  }

  fs.renameSync(file, finalDest);
  console.log(`Moved ${file} → ${finalDest}`);
  fs.appendFileSync(logPath, `Moved ${file} → ${finalDest}\n`);
}

// Run
createFolders(config.folders);
moveFiles(config.folders);
console.log('Organization complete! Check organize-log.txt for details.');
