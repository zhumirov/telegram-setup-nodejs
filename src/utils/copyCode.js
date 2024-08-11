import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ignore from 'ignore';

// Utility to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define source directory and output file
const sourceDir = path.join(__dirname, '../..');  // Root project directory
const outputFile = path.join(__dirname, 'all_code.txt');  // Output file path

// Function to read .gitignore and create ignore patterns
function getIgnorePatterns(gitignorePath) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    return ignore().add(gitignore).add([
        '.gitignore',
        'package-lock.json',
        'src/utils/copyCode.js'
    ]);
}

// Read and parse .gitignore
const ig = getIgnorePatterns(path.join(sourceDir, '.gitignore'));

// Get all files and directories in the source directory
const getAllFiles = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            fileList = getAllFiles(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    });
    return fileList;
};

const allFiles = getAllFiles(sourceDir).map(file => path.relative(sourceDir, file));

// Filter files based on .gitignore patterns
const filesToCopy = allFiles.filter(file => !ig.ignores(file));

// Concatenate files into one output file
const concatenateFiles = (files, outputPath) => {
    const outputStream = fs.createWriteStream(outputPath, { flags: 'w' });

    files.forEach(file => {
        const filePath = path.join(sourceDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        outputStream.write(`\nfile name: ${file}\n`);
        outputStream.write('\n```\n');
        outputStream.write(fileContent);
        outputStream.write('\n```\n');
    });

    outputStream.end();
};

concatenateFiles(filesToCopy, outputFile);
console.log('Files concatenated successfully!');
