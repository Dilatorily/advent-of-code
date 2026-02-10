interface Cave {
  isBig: boolean;
  links: Cave[];
  name: string;
}

export const solution = (lines: string[]) => {
  const links = lines.map((link) => link.split('-'));
  const caves: Record<string, Cave> = [...new Set(links.flat())]
    .map((cave) => ({
      isBig: cave.toLocaleUpperCase() === cave,
      links: [],
      name: cave,
    }))
    .reduce((graph, cave) => Object.assign(graph, { [cave.name]: cave }), {});

  links.forEach(([linkStart, linkEnd]) => {
    const start = caves[linkStart];
    const end = caves[linkEnd];

    start.links.push(end);
    end.links.push(start);
  });

  const findPaths = (
    currentCave: Cave,
    endCave: Cave,
    paths: string[][],
    currentPath: string[] = [],
  ) => {
    if (currentCave === endCave) {
      paths.push(currentPath);
      return;
    }

    currentCave.links.forEach((link) => {
      const newPath = [...currentPath, currentCave.name];
      if (link.isBig || !newPath.includes(link.name)) {
        findPaths(link, endCave, paths, newPath);
      }
    });
  };

  const paths: string[][] = [];
  findPaths(caves.start, caves.end, paths);
  return paths.length;
};
