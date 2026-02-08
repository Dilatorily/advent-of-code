const links = document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((link) => link.split('-'));
const caves = [...new Set(links.flat())]
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

const findPaths = (currentCave, endCave, paths, currentPath = []) => {
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

const paths = [];
findPaths(caves.start, caves.end, paths);
console.log(paths.length);
