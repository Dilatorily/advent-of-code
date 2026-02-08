document
  .querySelector('pre')
  .textContent.split('\n')
  .slice(0, -1)
  .map((present) => present.split('x').map((number) => parseInt(number, 10)))
  .reduce((sum, dimensions) => {
    const smallestDimensions = [...dimensions];
    smallestDimensions.splice(
      dimensions.findIndex((dimension) => dimension === Math.max(...dimensions)),
      1,
    );
    return (
      sum +
      smallestDimensions[0] * 2 +
      smallestDimensions[1] * 2 +
      dimensions[0] * dimensions[1] * dimensions[2]
    );
  }, 0);
