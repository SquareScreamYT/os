data = {
  "name": "root",
  "files": [],
  "subfolders": {
    "Documents": {
      "name": "Documents",
      "files": [],
      "subfolders": {
        "Work": {
          "name": "Work",
          "files": [
            {
              "name": "Project1.py",
              "content": "print('hello world')"
            }
          ],
          "subfolders": {}
        },
        "Personal": {
          "name": "Personal",
          "files": [
            {
              "name": "Project2.py",
              "content": "print('hello world')"
            }
          ],
          "subfolders": {}
        }
      }
    }
  }
};

function findFolder(path) {
  if (!path || path === '/') return data;
  
  const parts = path.split('/').filter(part => part);
  let current = data;
  
  for (const part of parts) {
    if (!current.subfolders[part]) {
      return null;
    }
    current = current.subfolders[part];
  }
  
  return current;
}

function findFileParent(path) {
  const parts = path.split('/').filter(part => part);
  const fileName = parts.pop();
  const folderPath = parts.join('/');
  
  const folder = findFolder(folderPath);
  if (!folder) return { folder: null, fileName: null };
  
  return { folder, fileName };
}

function addFolder(path, folderName) {
  const parentFolder = findFolder(path);
  
  if (!parentFolder) {
    console.error(`Parent folder not found: ${path}`);
    return false;
  }
  
  if (parentFolder.subfolders[folderName]) {
    console.error(`Folder already exists: ${folderName}`);
    return false;
  }
  
  parentFolder.subfolders[folderName] = {
    name: folderName,
    files: [],
    subfolders: {}
  };
  
  return true;
}

function removeFolder(path, folderName) {
  const parentFolder = findFolder(path);
  
  if (!parentFolder) {
    console.error(`Parent folder not found: ${path}`);
    return false;
  }
  
  if (!parentFolder.subfolders[folderName]) {
    console.error(`Folder does not exist: ${folderName}`);
    return false;
  }
  
  delete parentFolder.subfolders[folderName];
  return true;
}

function moveFolder(sourcePath, folderName, destinationPath) {
  const sourceParent = findFolder(sourcePath);
  const destParent = findFolder(destinationPath);
  
  if (!sourceParent) {
    console.error(`Source folder not found: ${sourcePath}`);
    return false;
  }
  
  if (!destParent) {
    console.error(`Destination folder not found: ${destinationPath}`);
    return false;
  }
  
  if (!sourceParent.subfolders[folderName]) {
    console.error(`Folder to move does not exist: ${folderName}`);
    return false;
  }
  
  if (destParent.subfolders[folderName]) {
    console.error(`Folder already exists at destination: ${folderName}`);
    return false;
  }
  
  destParent.subfolders[folderName] = sourceParent.subfolders[folderName];
  delete sourceParent.subfolders[folderName];
  
  return true;
}

function addFile(path, fileName, content = "") {
  const folder = findFolder(path);
  
  if (!folder) {
    console.error(`Folder not found: ${path}`);
    return false;
  }
  
  if (folder.files.some(file => file.name === fileName)) {
    console.error(`File already exists: ${fileName}`);
    return false;
  }
  
  folder.files.push({
    name: fileName,
    content: content
  });
  
  return true;
}

function removeFile(path, fileName) {
  const folder = findFolder(path);
  
  if (!folder) {
    console.error(`Folder not found: ${path}`);
    return false;
  }
  
  const fileIndex = folder.files.findIndex(file => file.name === fileName);
  
  if (fileIndex === -1) {
    console.error(`File not found: ${fileName}`);
    return false;
  }
  
  folder.files.splice(fileIndex, 1);
  return true;
}

function moveFile(sourcePath, fileName, destinationPath) {
  const sourceFolder = findFolder(sourcePath);
  const destFolder = findFolder(destinationPath);
  
  if (!sourceFolder) {
    console.error(`Source folder not found: ${sourcePath}`);
    return false;
  }
  
  if (!destFolder) {
    console.error(`Destination folder not found: ${destinationPath}`);
    return false;
  }
  
  const fileIndex = sourceFolder.files.findIndex(file => file.name === fileName);
  
  if (fileIndex === -1) {
    console.error(`File not found: ${fileName}`);
    return false;
  }
  
  if (destFolder.files.some(file => file.name === fileName)) {
    console.error(`File already exists at destination: ${fileName}`);
    return false;
  }
  
  const fileToMove = sourceFolder.files[fileIndex];
  destFolder.files.push(fileToMove);
  sourceFolder.files.splice(fileIndex, 1);
  
  return true;
}

function editFile(path, fileName, newContent) {
  const folder = findFolder(path);
  
  if (!folder) {
    console.error(`Folder not found: ${path}`);
    return false;
  }
  
  const file = folder.files.find(file => file.name === fileName);
  
  if (!file) {
    console.error(`File not found: ${fileName}`);
    return false;
  }
  
  file.content = newContent;
  return true;
}

function displayTree(node = data, indent = 0) {
  console.log('.'.repeat(indent) + '📁' + node.name);
  
  for (const file of node.files) {
    console.log('.'.repeat(indent + 2) + '📄' + file.name);
    if (file.content) {
      console.log('.'.repeat(indent + 4) + '📝 ' + file.content);
    }
  }
  
  for (const folderName in node.subfolders) {
    displayTree(node.subfolders[folderName], indent + 2);
  }
}

// Example Use:
// addFolder('', 'Pictures');
// addFile('Pictures', 'Image.png', "#000000");
// moveFolder('', 'Pictures', 'Documents');
// removeFile('Documents/Work', 'Project1.py');
// editFile('Documents/Personal', 'Project2.py', 'print("updated content")');

displayTree();
