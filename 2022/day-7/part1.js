const RESTRICTED_NAMES = ['parent', 'size', 'type'];
const fileSystem = { type: 'folder' };
let cursor = fileSystem;

document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .forEach((output) => {
    if (output.startsWith('$ cd ')) {
      const [, folder] = output.split('$ cd ');

      if (folder === '/') {
        cursor = fileSystem;
      } else if (folder === '..') {
        cursor = cursor.parent;
      } else {
        cursor = cursor[folder];
      }
    } else if (output.startsWith('dir ')) {
      const [, folder] = output.split('dir ');
      cursor[folder] = { parent: cursor, type: 'folder' };
    } else if (!output.startsWith('$ ls')) {
      const [size, file] = output.split(' ');
      cursor[file] = { size: parseInt(size, 10), type: 'file' };
    }
  });

const calculateFolderSize = (folder) => {
  Object.keys(folder)
    .filter((name) => !RESTRICTED_NAMES.includes(name))
    .forEach((name) => {
      const child = folder[name];
      if (child.type === 'folder') {
        child.size = calculateFolderSize(child);
      }
    });

  return Object.keys(folder)
    .filter((name) => !RESTRICTED_NAMES.includes(name))
    .reduce((sum, name) => sum + folder[name].size, 0);
};

calculateFolderSize(fileSystem);

const folders = [];
const getFoldersUnderLimit = (folder, limit = 100000) => {
  if (folder.type !== 'folder') {
    return;
  }

  if (folder.size < limit) {
    folders.push(folder.size);
  }

  Object.keys(folder)
    .filter((name) => !RESTRICTED_NAMES.includes(name))
    .forEach((name) => getFoldersUnderLimit(folder[name]));
};

getFoldersUnderLimit(fileSystem);
folders.reduce((sum, size) => sum + size, 0);
