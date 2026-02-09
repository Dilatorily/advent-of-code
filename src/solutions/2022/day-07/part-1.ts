interface FileSystemNode {
  parent?: FileSystemNode;
  size?: number;
  type: 'folder' | 'file';
  [key: string]: FileSystemNode | number | string | undefined;
}

const RESTRICTED_NAMES = ['parent', 'size', 'type'];

export const solution = (lines: string[]): number => {
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

  const calculateFolderSize = (folder: FileSystemNode): number => {
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

  calculateFolderSize(fileSystem);

  const folders: number[] = [];
  const getFoldersUnderLimit = (folder: FileSystemNode, limit = 100000): void => {
    if (folder.type !== 'folder') {
      return;
    }

    if ((folder.size ?? 0) < limit) {
      folders.push(folder.size ?? 0);
    }

    Object.keys(folder)
      .filter((name) => !RESTRICTED_NAMES.includes(name))
      .forEach((name) => {
        getFoldersUnderLimit(folder[name] as FileSystemNode);
      });
  };

  getFoldersUnderLimit(fileSystem);
  return folders.reduce((sum, size) => sum + size, 0);
};
