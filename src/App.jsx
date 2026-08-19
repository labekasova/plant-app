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
const STARS = [
  [5, 12, 2, 0.2], [12, 31, 3, 1.1], [18, 8, 2, 1.8], [24, 22, 2, 0.7],
  [31, 13, 3, 2.2], [38, 35, 2, 1.4], [44, 17, 2, 0.3], [51, 29, 3, 2.7],
  [58, 9, 2, 1.7], [64, 39, 2, 0.8], [71, 18, 3, 2.4], [77, 32, 2, 1.2],
  [83, 11, 2, 0.5], [89, 28, 3, 2.1], [95, 16, 2, 1.5], [8, 48, 2, 2.6],
  [21, 42, 3, 0.9], [35, 54, 2, 1.9], [49, 46, 2, 0.4], [61, 58, 3, 2.3],
  [74, 49, 2, 1.3], [87, 56, 2, 0.6], [94, 44, 3, 1.6],
]

function App() {
  const [plants, setPlants] = useLocalStorage('plant-app:v0.1:plants', [])
  const [language, setLanguage] = useLocalStorage('plant-app:v0.1:language', 'ru')
  const [theme, setTheme] = useLocalStorage('plant-app:v0.2:theme', 'light')
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
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#11120f' : '#ffffff')
  }, [theme])

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
    <main className="garden-app" data-theme={theme}>
      <div className="night-sky" aria-hidden="true">
        {STARS.map(([left, top, size, delay], index) => (
          <i
            key={index}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>

      <div className="celestial-body" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <div className="top-controls">
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
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          aria-label={theme === 'dark' ? t('lightTheme') : t('darkTheme')}
          title={theme === 'dark' ? t('lightTheme') : t('darkTheme')}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
            </svg>
          )}
        </button>
      </div>

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
