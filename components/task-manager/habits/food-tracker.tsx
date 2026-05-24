"use client"

import { useState } from "react"
import { ArrowLeft, Search, Plus, Sparkles, Clock, X, Loader2, Check } from "lucide-react"

interface FoodTrackerProps {
  onBack?: () => void
}

interface FoodItem {
  id: string
  name: string
  portion: string
  category: string
  image: string
  addedAt?: string
}

export function FoodTracker({ onBack }: FoodTrackerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [todaysFoods, setTodaysFoods] = useState<FoodItem[]>([
    { id: "1", name: "Avena con leche", portion: "1 taza", category: "Desayuno", image: "oatmeal", addedAt: "8:30 AM" },
    { id: "2", name: "Manzana roja", portion: "1 pieza", category: "Snack", image: "apple", addedAt: "11:00 AM" },
    { id: "3", name: "Ensalada mixta", portion: "1 plato", category: "Almuerzo", image: "salad", addedAt: "1:30 PM" },
  ])

  const popularFoods: FoodItem[] = [
    { id: "p1", name: "Huevos revueltos", portion: "2 piezas", category: "Desayuno", image: "eggs" },
    { id: "p2", name: "Pan integral", portion: "2 rebanadas", category: "Desayuno", image: "bread" },
    { id: "p3", name: "Platano", portion: "1 pieza", category: "Fruta", image: "banana" },
    { id: "p4", name: "Yogurt natural", portion: "1 vaso", category: "Lacteo", image: "yogurt" },
    { id: "p5", name: "Pollo a la plancha", portion: "150g", category: "Proteina", image: "chicken" },
    { id: "p6", name: "Arroz blanco", portion: "1 taza", category: "Carbohidrato", image: "rice" },
  ]

  const aiSuggestedFoods: FoodItem[] = [
    { id: "ai1", name: "Salmon al horno", portion: "150g", category: "Proteina", image: "salmon" },
    { id: "ai2", name: "Quinoa con verduras", portion: "1 taza", category: "Grano", image: "quinoa" },
    { id: "ai3", name: "Aguacate", portion: "1/2 pieza", category: "Grasa saludable", image: "avocado" },
    { id: "ai4", name: "Espinacas salteadas", portion: "1 taza", category: "Verdura", image: "spinach" },
  ]

  // Food illustration component
  const FoodIllustration = ({ type }: { type: string }) => {
    const illustrations: Record<string, JSX.Element> = {
      oatmeal: (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <ellipse cx="30" cy="35" rx="22" ry="12" fill="#F5DEB3" />
          <ellipse cx="30" cy="32" rx="18" ry="10" fill="#DEB887" />
          <circle cx="24" cy="30" r="3" fill="#8B4513" />
          <circle cx="32" cy="28" r="2.5" fill="#FF6B6B" />
          <circle cx="36" cy="32" r="2" fill="#4ECDC4" />
          <path d="M15 40 Q30 50 45 40" stroke="#8B7355" strokeWidth="2" fill="none" />
        </svg>
      ),
      apple: (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <ellipse cx="30" cy="35" rx="16" ry="18" fill="#FF6B6B" />
          <path d="M30 17 Q35 10 32 5" stroke="#4A7C23" strokeWidth="3" fill="none" />
          <path d="M32 8 Q40 12 35 18" fill="#4A7C23" />
          <ellipse cx="24" cy="30" rx="3" ry="4" fill="#FF8888" opacity="0.5" />
        </svg>
      ),
      salad: (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <ellipse cx="30" cy="40" rx="24" ry="10" fill="#E8E8E8" />
          <ellipse cx="30" cy="35" rx="20" ry="12" fill="#90EE90" />
          <circle cx="22" cy="32" r="4" fill="#FF6347" />
          <circle cx="38" cy="34" r="3" fill="#FFD700" />
          <ellipse cx="30" cy="30" rx="8" ry="4" fill="#98FB98" />
          <circle cx="26" cy="38" r="2" fill="#9370DB" />
        </svg>
      ),
      eggs: (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <ellipse cx="22" cy="35" rx="12" ry="15" fill="#FFF8DC" />
          <ellipse cx="22" cy="33" rx="5" ry="5" fill="#FFD700" />
          <ellipse cx="38" cy="35" rx="12" ry="15" fill="#FFF8DC" />
          <ellipse cx="38" cy="33" rx="5" ry="5" fill="#FFD700" />
        </svg>
      ),
      bread: (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <rect x="10" y="20" width="40" height="25" rx="3" fill="#D2691E" />
          <rect x="12" y="22" width="36" height="21" rx="2" fill="#F5DEB3" />
          <ellipse cx="30" cy="15" rx="18" ry="8" fill="#8B4513" />
        </svg>
      ),
      banana: (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <path d="M15 45 Q10 30 20 15 Q35 10 45 20 Q50 35 40 45 Q30 50 15 45" fill="#FFE135" />
          <path d="M20 15 Q25 12 30 14" stroke="#8B7355" strokeWidth="2" fill="none" />
        </svg>
      ),
      yogurt: (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <rect x="15" y="15" width="30" height="35" rx="3" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="2" />
          <rect x="15" y="15" width="30" height="10" fill="#87CEEB" />
          <ellipse cx="30" cy="35" rx="8" ry="6" fill="#FFF8DC" />
        </svg>
      ),
      chicken: (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <ellipse cx="30" cy="35" rx="20" ry="12" fill="#DEB887" />
          <path d="M15 30 Q10 25 15 20 Q20 18 22 25" fill="#DEB887" />
          <ellipse cx="30" cy="33" rx="15" ry="8" fill="#D2B48C" />
          <line x1="25" y1="35" x2="25" y2="40" stroke="#8B4513" strokeWidth="1" />
          <line x1="35" y1="35" x2="35" y2="40" stroke="#8B4513" strokeWidth="1" />
        </svg>
      ),
      rice: (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <ellipse cx="30" cy="40" rx="20" ry="8" fill="#8B7355" />
          <ellipse cx="30" cy="35" rx="18" ry="12" fill="#FFFAF0" />
          <ellipse cx="25" cy="32" rx="3" ry="2" fill="#FFF8DC" />
          <ellipse cx="35" cy="34" rx="3" ry="2" fill="#FFF8DC" />
          <ellipse cx="30" cy="38" rx="3" ry="2" fill="#FFF8DC" />
        </svg>
      ),
      salmon: (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <ellipse cx="30" cy="35" rx="22" ry="12" fill="#FA8072" />
          <line x1="15" y1="30" x2="45" y2="30" stroke="#FF6B6B" strokeWidth="2" />
          <line x1="15" y1="35" x2="45" y2="35" stroke="#FF6B6B" strokeWidth="2" />
          <line x1="15" y1="40" x2="45" y2="40" stroke="#FF6B6B" strokeWidth="2" />
          <ellipse cx="30" cy="35" rx="18" ry="8" fill="none" stroke="#FFA07A" strokeWidth="1" />
        </svg>
      ),
      quinoa: (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <ellipse cx="30" cy="40" rx="20" ry="8" fill="#8B7355" />
          <ellipse cx="30" cy="35" rx="18" ry="12" fill="#F5DEB3" />
          <circle cx="22" cy="32" r="2" fill="#90EE90" />
          <circle cx="28" cy="35" r="2" fill="#FF6347" />
          <circle cx="35" cy="33" r="2" fill="#FFD700" />
          <circle cx="32" cy="38" r="2" fill="#90EE90" />
        </svg>
      ),
      avocado: (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <ellipse cx="30" cy="35" rx="16" ry="20" fill="#568203" />
          <ellipse cx="30" cy="35" rx="12" ry="16" fill="#9ACD32" />
          <circle cx="30" cy="38" r="6" fill="#8B4513" />
        </svg>
      ),
      spinach: (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <ellipse cx="25" cy="30" rx="12" ry="8" fill="#228B22" transform="rotate(-20 25 30)" />
          <ellipse cx="35" cy="35" rx="12" ry="8" fill="#32CD32" transform="rotate(20 35 35)" />
          <ellipse cx="30" cy="40" rx="10" ry="6" fill="#228B22" />
          <line x1="30" y1="25" x2="30" y2="45" stroke="#006400" strokeWidth="2" />
        </svg>
      ),
    }

    return illustrations[type] || (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <circle cx="30" cy="30" r="20" fill="#E8E8E8" />
        <text x="30" y="35" textAnchor="middle" fontSize="20">🍽️</text>
      </svg>
    )
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      setIsSearching(true)
      // Simular busqueda con IA
      setTimeout(() => {
        const allFoods = [...popularFoods, ...aiSuggestedFoods]
        const filtered = allFoods.filter(f => 
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.category.toLowerCase().includes(query.toLowerCase())
        )
        // Agregar resultados simulados de IA
        const aiResults: FoodItem[] = [
          { id: `ai-${Date.now()}`, name: `${query} casero`, portion: "1 porcion", category: "IA sugerido", image: "salad" },
        ]
        setSearchResults([...filtered, ...aiResults])
        setIsSearching(false)
      }, 800)
    } else {
      setSearchResults([])
    }
  }

  const addFood = (food: FoodItem) => {
    const newFood: FoodItem = {
      ...food,
      id: Date.now().toString(),
      addedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    }
    setTodaysFoods([...todaysFoods, newFood])
    setSearchQuery("")
    setSearchResults([])
  }

  const removeFood = (id: string) => {
    setTodaysFoods(todaysFoods.filter(f => f.id !== id))
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 pt-12 pb-8 px-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-white" />
          <span className="text-sm text-white/90">Busqueda inteligente con IA</span>
        </div>
        <h1 className="text-2xl font-semibold text-white">Registro de Comidas</h1>
        <p className="text-sm text-white/80 mt-1">Registra lo que comes y obtiene sugerencias</p>
      </div>

      <div className="px-6 py-4 -mt-4">
        {/* Search bar */}
        <div className="bg-card rounded-2xl border border-border/50 shadow-lg mb-6">
          <div className="flex items-center gap-3 p-4">
            {isSearching ? (
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-muted-foreground" />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar comida... (ej: pollo, ensalada)"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setSearchResults([]) }}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="border-t border-border/50 max-h-64 overflow-y-auto">
              {searchResults.map(food => (
                <button
                  key={food.id}
                  onClick={() => addFood(food)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center overflow-hidden">
                    <FoodIllustration type={food.image} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">{food.name}</p>
                    <p className="text-xs text-muted-foreground">{food.portion} - {food.category}</p>
                  </div>
                  <Plus className="w-4 h-4 text-emerald-500" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Today's foods */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Hoy - {todaysFoods.length} alimentos
            </h3>
          </div>
          
          <div className="space-y-2">
            {todaysFoods.map(food => (
              <div key={food.id} className="bg-card rounded-xl p-3 border border-border/50 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center overflow-hidden">
                  <FoodIllustration type={food.image} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{food.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{food.portion}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {food.addedAt}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => removeFood(food.id)}
                  className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-4 mb-6 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-medium text-foreground">Sugerencias IA para ti</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {aiSuggestedFoods.map(food => (
              <button
                key={food.id}
                onClick={() => addFood(food)}
                className="bg-card rounded-xl p-3 border border-border/50 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center overflow-hidden">
                  <FoodIllustration type={food.image} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-medium text-foreground truncate">{food.name}</p>
                  <p className="text-[10px] text-muted-foreground">{food.portion}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Popular foods */}
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Comidas populares
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {popularFoods.map(food => (
            <button
              key={food.id}
              onClick={() => addFood(food)}
              className="bg-card rounded-xl p-3 border border-border/50 flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                <FoodIllustration type={food.image} />
              </div>
              <p className="text-xs font-medium text-foreground text-center truncate w-full">{food.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
