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

  const hasPathVisitedSmallCaveTwice = (path: string[]) => {
    const counts: Record<string, number> = {};
    path
      .filter((cave) => cave.toLocaleLowerCase() === cave && cave !== 'start')
      .forEach((cave) => {
        counts[cave] = (counts[cave] || 0) + 1;
      });
    const results = Object.values(counts).find((count) => count > 1) != null;
    return results;
  };

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

    currentCave.links
      .filter((link) => link.name !== 'start')
      .forEach((link) => {
        const newPath = [...currentPath, currentCave.name];
        const hasVisitedTwice = hasPathVisitedSmallCaveTwice(newPath);
        if (link.isBig || !hasVisitedTwice || !newPath.includes(link.name)) {
          findPaths(link, endCave, paths, newPath);
        }
      });
  };

  const paths: string[][] = [];
  findPaths(caves.start, caves.end, paths);
  return paths.length;
};
