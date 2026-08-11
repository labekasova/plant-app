import { useState } from 'react'
import { plantTypes } from '../data/plantTypes.js'

const DAY_MS = 24 * 60 * 60 * 1000

export function PlantCare({ plant, now, t, onWater, onSaveNotes, onDelete }) {
  const [notes, setNotes] = useState(plant.notes ?? '')
  const type = plantTypes[plant.type] ?? plantTypes.succulent
  const isThirsty = now - plant.lastWatered >= plant.waterIntervalDays * DAY_MS

  return (
    <div className="plant-care">
      <div className="plant-care__status">
        <img src={type.image} alt="" />
        <div>
          <span className="plant-care__eyebrow">{t('status')}</span>
          <strong className={isThirsty ? 'is-thirsty' : 'is-happy'}>
            {isThirsty ? t('needsWater') : t('feelsGood')}
          </strong>
          <small>{plant.location === 'outdoor' ? `☀ ${t('outdoor')}` : `⌂ ${t('indoor')}`}</small>
        </div>
      </div>

      <button type="button" className="water-button" onClick={onWater}>
        <span className="water-button__drop" aria-hidden="true" />
        {t('waterButton')}
      </button>

      <label className="form-field">
        <span>{t('notes')}</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder={t('notesPlaceholder')}
          maxLength={500}
        />
      </label>

      <button type="button" className="secondary-button" onClick={() => onSaveNotes(notes)}>
        {t('saveButton')}
      </button>
      <button type="button" className="danger-button" onClick={onDelete}>
        {t('deleteButton')}
      </button>
    </div>
  )
}
