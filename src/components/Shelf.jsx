import { PlantPot } from './PlantPot.jsx'

export function Shelf({ plants, now, onAdd, onPlantClick, addLabel }) {
  const isFull = plants.length >= 4

  return (
    <section className="shelf">
      <div className="shelf__stage">
        {plants.map((plant) => (
          <PlantPot
            key={plant.id}
            plant={plant}
            now={now}
            onClick={() => onPlantClick(plant.id)}
          />
        ))}

        {!isFull && (
          <button type="button" className="add-slot" onClick={onAdd} aria-label={addLabel}>
            <span aria-hidden="true">+</span>
          </button>
        )}
      </div>

      <div className="shelf__board" aria-hidden="true">
        <span className="shelf__top" />
        <span className="shelf__edge">
          <i />
          <i />
          <i />
        </span>
      </div>
      <span className="shelf__leg shelf__leg--left" aria-hidden="true" />
      <span className="shelf__leg shelf__leg--right" aria-hidden="true" />
    </section>
  )
}
