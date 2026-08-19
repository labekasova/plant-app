import { plantTypes } from '../data/plantTypes.js'

const DAY_MS = 24 * 60 * 60 * 1000

export function PlantPot({ plant, now, onClick }) {
  const type = plantTypes[plant.type] ?? plantTypes.succulent
  const isThirsty = now - plant.lastWatered >= plant.waterIntervalDays * DAY_MS
  const nameLength = [...plant.name].length
  const nameSize = nameLength >= 13 ? 'is-tiny' : nameLength >= 9 ? 'is-small' : ''

  return (
    <button
      type="button"
      className="plant-pot"
      onClick={onClick}
      aria-label={plant.name}
    >
      {isThirsty && <span className="water-drop" aria-label="Нужно полить" />}
      <img className="plant-pot__plant" src={type.image} alt="" />
      <span className="plant-pot__container">
        <span className="plant-pot__shine" />
        <span className={`plant-pot__label ${nameSize}`} title={plant.name}>
          <span aria-hidden="true">{plant.location === 'outdoor' ? '☀' : '⌂'}</span>
          <span className="plant-pot__name">{plant.name}</span>
        </span>
      </span>
      <span className="plant-pot__shadow" />
    </button>
  )
}
