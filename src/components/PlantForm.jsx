import { useState } from 'react'
import { plantTypes } from '../data/plantTypes.js'

const initialForm = {
  name: '',
  type: 'succulent',
  waterIntervalDays: 3,
  location: 'indoor',
  notes: '',
}

export function PlantForm({ t, onSubmit }) {
  const [form, setForm] = useState(initialForm)

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const name = form.name.trim()
    if (!name) return
    onSubmit({ ...form, name })
  }

  return (
    <form className="plant-form" onSubmit={handleSubmit}>
      <fieldset className="form-section">
        <legend>{t('plantType')}</legend>
        <div className="plant-type-grid">
          {Object.entries(plantTypes).map(([type, data]) => (
            <button
              key={type}
              type="button"
              className={`plant-type-card ${form.type === type ? 'is-selected' : ''}`}
              onClick={() => update('type', type)}
              aria-pressed={form.type === type}
            >
              <img src={data.image} alt="" />
              <span>{t(data.labelKey)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>{t('location')}</legend>
        <div className="location-grid">
          <button
            type="button"
            className={`location-option location-option--indoor ${form.location === 'indoor' ? 'is-selected' : ''}`}
            onClick={() => update('location', 'indoor')}
            aria-pressed={form.location === 'indoor'}
          >
            <span aria-hidden="true">⌂</span> {t('indoor')}
          </button>
          <button
            type="button"
            className={`location-option location-option--outdoor ${form.location === 'outdoor' ? 'is-selected' : ''}`}
            onClick={() => update('location', 'outdoor')}
            aria-pressed={form.location === 'outdoor'}
          >
            <span aria-hidden="true">☀</span> {t('outdoor')}
          </button>
        </div>
      </fieldset>

      <label className="form-field">
        <span>{t('potName')}</span>
        <input
          autoFocus
          type="text"
          value={form.name}
          onChange={(event) => update('name', event.target.value)}
          placeholder={t('namePlaceholder')}
          maxLength={15}
          required
        />
      </label>

      <label className="form-field">
        <span>{t('waterInterval')}</span>
        <input
          type="number"
          min="1"
          max="30"
          value={form.waterIntervalDays}
          onChange={(event) => update('waterIntervalDays', Number(event.target.value))}
          required
        />
      </label>

      <button className="primary-button" type="submit" disabled={!form.name.trim()}>
        {t('plantButton')}
      </button>
    </form>
  )
}
