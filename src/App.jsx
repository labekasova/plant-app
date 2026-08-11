import { useEffect, useMemo, useState } from 'react'
import { Modal } from './components/Modal.jsx'
import { PlantCare } from './components/PlantCare.jsx'
import { PlantForm } from './components/PlantForm.jsx'
import { Shelf } from './components/Shelf.jsx'
import { translations } from './data/translations.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'

const SHELVES = [0, 1, 2]
const GRASS = [
  [42, -8], [31, 16], [47, -14], [29, 12], [38, 8], [52, -4], [44, 7],
  [50, -7], [35, 14], [29, -12], [43, 9], [37, -6], [31, 3], [49, 13],
  [34, -10], [44, 6], [28, -3], [51, -11], [38, 14], [46, -5], [33, 8],
  [48, 4], [36, -14], [43, 11], [30, -5], [50, 8],
]

function App() {
  const [plants, setPlants] = useLocalStorage('plant-app:v0.1:plants', [])
  const [language, setLanguage] = useLocalStorage('plant-app:v0.1:language', 'ru')
  const [selectedShelf, setSelectedShelf] = useState(null)
  const [selectedPlantId, setSelectedPlantId] = useState(null)
  const [now, setNow] = useState(Date.now())

  const t = (key) => translations[language]?.[key] ?? key
  const selectedPlant = useMemo(
    () => plants.find((plant) => plant.id === selectedPlantId) ?? null,
    [plants, selectedPlantId],
  )

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const addPlant = (form) => {
    const plant = {
      ...form,
      id: crypto.randomUUID(),
      shelfIndex: selectedShelf,
      lastWatered: Date.now(),
    }
    setPlants((current) => [...current, plant])
    setSelectedShelf(null)
  }

  const updatePlant = (id, changes) => {
    setPlants((current) =>
      current.map((plant) => (plant.id === id ? { ...plant, ...changes } : plant)),
    )
  }

  const deletePlant = (id) => {
    setPlants((current) => current.filter((plant) => plant.id !== id))
    setSelectedPlantId(null)
  }

  return (
    <main className="garden-app">
      <div className="sun" aria-hidden="true" />

      <nav className="language-switch" aria-label="Language">
        {['ru', 'en'].map((lang) => (
          <button
            key={lang}
            type="button"
            className={language === lang ? 'is-active' : ''}
            onClick={() => setLanguage(lang)}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </nav>

      <header className="garden-header">
        <h1>{t('title')}</h1>
        <p>{t('subtitle')}</p>
      </header>

      <div className="shelves">
        {SHELVES.map((shelfIndex) => (
          <Shelf
            key={shelfIndex}
            plants={plants.filter((plant) => plant.shelfIndex === shelfIndex)}
            now={now}
            onAdd={() => setSelectedShelf(shelfIndex)}
            onPlantClick={setSelectedPlantId}
            addLabel={t('emptySlot')}
          />
        ))}
      </div>

      <div className="grass" aria-hidden="true">
        {GRASS.map(([height, rotation], index) => (
          <i key={index} style={{ height, transform: `rotate(${rotation}deg)` }} />
        ))}
      </div>

      {selectedShelf !== null && (
        <Modal title={t('addPlantTitle')} onClose={() => setSelectedShelf(null)}>
          <PlantForm t={t} onSubmit={addPlant} />
        </Modal>
      )}

      {selectedPlant && (
        <Modal
          title={`${t('careTitle')} ${selectedPlant.name}`}
          onClose={() => setSelectedPlantId(null)}
        >
          <PlantCare
            plant={selectedPlant}
            now={now}
            t={t}
            onWater={() => {
              updatePlant(selectedPlant.id, { lastWatered: Date.now() })
              setNow(Date.now())
            }}
            onSaveNotes={(notes) => {
              updatePlant(selectedPlant.id, { notes })
              setSelectedPlantId(null)
            }}
            onDelete={() => deletePlant(selectedPlant.id)}
          />
        </Modal>
      )}
    </main>
  )
}

export default App
