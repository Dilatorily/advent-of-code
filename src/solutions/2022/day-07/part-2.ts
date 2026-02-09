interface FileSystemNode {
  parent?: FileSystemNode;
  size?: number;
  type: 'folder' | 'file';
  [key: string]: FileSystemNode | number | string | undefined;
}

const TOTAL_DISK_SPACE = 70000000;
const UNUSED_DISK_SPACE = 30000000;
const RESTRICTED_NAMES = ['parent', 'size', 'type'];

export const solution = (lines: string[]) => {
  const fileSystem: FileSystemNode = { type: 'folder' };
  let cursor = fileSystem;

  lines
    .filter((line) => line.length > 0)
    .forEach((output) => {
      if (output.startsWith('$ cd ')) {
        const [, folder] = output.split('$ cd ');

        if (folder === '/') {
          cursor = fileSystem;
        } else if (folder === '..') {
          cursor = cursor.parent ?? fileSystem;
        } else {
          cursor = cursor[folder] as FileSystemNode;
        }
      } else if (output.startsWith('dir ')) {
        const [, folder] = output.split('dir ');
        cursor[folder] = { parent: cursor, type: 'folder' };
      } else if (!output.startsWith('$ ls')) {
        const [size, file] = output.split(' ');
        cursor[file] = { size: parseInt(size, 10), type: 'file' };
      }
    });

  const calculateFolderSize = (folder: FileSystemNode) => {
    Object.keys(folder)
      .filter((name) => !RESTRICTED_NAMES.includes(name))
      .forEach((name) => {
        const child = folder[name] as FileSystemNode;
        if (child.type === 'folder') {
          child.size = calculateFolderSize(child);
        }
      });

    return Object.keys(folder)
      .filter((name) => !RESTRICTED_NAMES.includes(name))
      .reduce((sum, name) => {
        const child = folder[name] as FileSystemNode;
        return sum + (child.size ?? 0);
      }, 0);
  };

  fileSystem.size = calculateFolderSize(fileSystem);

  const minimumFolderSize = UNUSED_DISK_SPACE - (TOTAL_DISK_SPACE - (fileSystem.size ?? 0));
  const folders: FileSystemNode[] = [];
  const parseFolders = (folder: FileSystemNode): void => {
    if (folder.type !== 'folder') {
      return;
    }

    folders.push(folder);

    Object.keys(folder)
      .filter((name) => !RESTRICTED_NAMES.includes(name))
      .forEach((name) => {
        parseFolders(folder[name] as FileSystemNode);
      });
  };
  parseFolders(fileSystem);

  const folder = folders
    .sort((a, b) => (a.size ?? 0) - (b.size ?? 0))
    .find((f) => (f.size ?? 0) >= minimumFolderSize);
  return folder?.size ?? 0;
};
