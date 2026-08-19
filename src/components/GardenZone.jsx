import { Shelf } from './Shelf.jsx'
import { splitIntoShelves } from '../utils/shelves.js'

export function GardenZone({ location, plants, now, t, onAdd, onPlantClick }) {
  const shelves = splitIntoShelves(plants)
  const isIndoor = location === 'indoor'

  return (
    <section className={`garden-zone garden-zone--${location}`}>
      <header className="garden-zone__header">
        <span className="garden-zone__icon" aria-hidden="true">
          {isIndoor ? '⌂' : '☀'}
        </span>
        <div>
          <h2>{t(isIndoor ? 'indoorRoom' : 'outdoorRoom')}</h2>
          <p>{t(isIndoor ? 'indoorRoomHint' : 'outdoorRoomHint')}</p>
        </div>
        <span className="garden-zone__count">
          {plants.length} {t(plants.length === 1 ? 'plantCountOne' : 'plantsCount')}
        </span>
      </header>

      <div className="garden-zone__scene">
        <div className="garden-zone__decor" aria-hidden="true">
          {isIndoor ? (
            <>
              <span className="room-window"><i /><i /></span>
              <span className="room-frame" />
            </>
          ) : (
            <>
              <span className="garden-cloud garden-cloud--one" />
              <span className="garden-cloud garden-cloud--two" />
              <span className="garden-hill garden-hill--one" />
              <span className="garden-hill garden-hill--two" />
            </>
          )}
        </div>

        <div className="zone-shelves">
          {shelves.map((shelfPlants, shelfIndex) => (
            <Shelf
              key={`${location}-${shelfIndex}`}
              plants={shelfPlants}
              now={now}
              onAdd={() => onAdd(location)}
              onPlantClick={onPlantClick}
              addLabel={`${t('emptySlot')} — ${t(isIndoor ? 'indoorRoom' : 'outdoorRoom')}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
