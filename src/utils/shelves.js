export const PLANTS_PER_SHELF = 4

export function splitIntoShelves(plants) {
  const shelves = []

  for (let index = 0; index < plants.length; index += PLANTS_PER_SHELF) {
    shelves.push(plants.slice(index, index + PLANTS_PER_SHELF))
  }

  if (shelves.length === 0 || shelves.at(-1).length === PLANTS_PER_SHELF) {
    shelves.push([])
  }

  return shelves
}
