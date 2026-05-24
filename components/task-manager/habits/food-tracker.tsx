"use client"

import { useState } from "react"
import { ArrowLeft, Search, Plus, Sparkles, Clock, X, Loader2, ChefHat, Utensils, ImageIcon } from "lucide-react"

interface FoodTrackerProps {
  onBack?: () => void
}

interface FoodItem {
  id: string
  name: string
  portion: string
  category: string
  imageUrl?: string
  addedAt?: string
  calories?: number
}

interface Recipe {
  id: string
  name: string
  description: string
  prepTime: string
  difficulty: 'facil' | 'media' | 'dificil'
  calories: number
  imagePrompt: string
  generatedImage?: string
}

export function FoodTracker({ onBack }: FoodTrackerProps) {
  const [activeTab, setActiveTab] = useState<'log' | 'recipes'>('log')
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [todaysFoods, setTodaysFoods] = useState<FoodItem[]>([
    { id: "1", name: "Avena con leche", portion: "1 taza", category: "Desayuno", addedAt: "8:30 AM", calories: 280 },
    { id: "2", name: "Manzana roja", portion: "1 pieza", category: "Snack", addedAt: "11:00 AM", calories: 95 },
    { id: "3", name: "Ensalada mixta", portion: "1 plato", category: "Almuerzo", addedAt: "1:30 PM", calories: 320 },
  ])

  // Recipe suggestion state
  const [ingredients, setIngredients] = useState<string[]>([])
  const [newIngredient, setNewIngredient] = useState("")
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false)
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([])
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set())

  const popularFoods: FoodItem[] = [
    { id: "p1", name: "Huevos revueltos", portion: "2 piezas", category: "Desayuno", calories: 180 },
    { id: "p2", name: "Pan integral", portion: "2 rebanadas", category: "Desayuno", calories: 160 },
    { id: "p3", name: "Platano", portion: "1 pieza", category: "Fruta", calories: 105 },
    { id: "p4", name: "Yogurt natural", portion: "1 vaso", category: "Lacteo", calories: 150 },
    { id: "p5", name: "Pollo a la plancha", portion: "150g", category: "Proteina", calories: 231 },
    { id: "p6", name: "Arroz blanco", portion: "1 taza", category: "Carbohidrato", calories: 206 },
  ]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      setIsSearching(true)
      setTimeout(() => {
        const filtered = popularFoods.filter(f => 
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.category.toLowerCase().includes(query.toLowerCase())
        )
        setSearchResults(filtered)
        setIsSearching(false)
      }, 300)
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

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()])
      setNewIngredient("")
    }
  }

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient))
  }

  const getSuggestedRecipes = async () => {
    if (ingredients.length === 0) return
    
    setIsLoadingRecipes(true)
    try {
      const response = await fetch('/api/suggest-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSuggestedRecipes(data.recipes || [])
        
        // Generar imagenes para las recetas
        data.recipes?.forEach((recipe: Recipe) => {
          generateRecipeImage(recipe)
        })
      }
    } catch (error) {
      console.error('Error getting recipes:', error)
    } finally {
      setIsLoadingRecipes(false)
    }
  }

  const generateRecipeImage = async (recipe: Recipe) => {
    setLoadingImages(prev => new Set(prev).add(recipe.id))
    
    try {
      const response = await fetch('/api/generate-food-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: recipe.imagePrompt })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.images?.[0]) {
          setSuggestedRecipes(prev => prev.map(r => 
            r.id === recipe.id 
              ? { ...r, generatedImage: `data:${data.images[0].mediaType};base64,${data.images[0].base64}` }
              : r
          ))
        }
      }
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setLoadingImages(prev => {
        const next = new Set(prev)
        next.delete(recipe.id)
        return next
      })
    }
  }

  const addRecipeToLog = (recipe: Recipe) => {
    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: recipe.name,
      portion: "1 porcion",
      category: "Receta IA",
      calories: recipe.calories,
      imageUrl: recipe.generatedImage,
      addedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    }
    setTodaysFoods([...todaysFoods, newFood])
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facil': return 'text-green-500 bg-green-500/10'
      case 'media': return 'text-amber-500 bg-amber-500/10'
      case 'dificil': return 'text-red-500 bg-red-500/10'
      default: return 'text-muted-foreground bg-secondary'
    }
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
          <span className="text-sm text-white/90">Sugerencias con IA</span>
        </div>
        <h1 className="text-2xl font-semibold text-white">Registro de Comidas</h1>
        <p className="text-sm text-white/80 mt-1">Registra lo que comes y obtiene recetas</p>
      </div>

      <div className="px-6 py-4 -mt-4">
        {/* Tabs */}
        <div className="bg-card rounded-2xl p-1 border border-border/50 shadow-lg mb-6 flex">
          <button
            onClick={() => setActiveTab('log')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'log' 
                ? 'bg-emerald-500 text-white' 
                : 'text-muted-foreground'
            }`}
          >
            <Utensils className="w-4 h-4 inline mr-2" />
            Mi Registro
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'recipes' 
                ? 'bg-emerald-500 text-white' 
                : 'text-muted-foreground'
            }`}
          >
            <ChefHat className="w-4 h-4 inline mr-2" />
            Recetas IA
          </button>
        </div>

        {activeTab === 'log' ? (
          <>
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
                  placeholder="Buscar comida..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(""); setSearchResults([]) }}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="border-t border-border/50 max-h-64 overflow-y-auto">
                  {searchResults.map(food => (
                    <button
                      key={food.id}
                      onClick={() => addFood(food)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <span className="text-lg">🍽️</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">{food.name}</p>
                        <p className="text-xs text-muted-foreground">{food.portion} - {food.calories} kcal</p>
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
                <span className="text-xs text-emerald-500 font-medium">
                  {todaysFoods.reduce((sum, f) => sum + (f.calories || 0), 0)} kcal
                </span>
              </div>
              
              <div className="space-y-2">
                {todaysFoods.map(food => (
                  <div key={food.id} className="bg-card rounded-xl p-3 border border-border/50 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center overflow-hidden">
                      {food.imageUrl ? (
                        <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">🍽️</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{food.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{food.portion}</span>
                        {food.calories && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                            <span>{food.calories} kcal</span>
                          </>
                        )}
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

            {/* Popular foods */}
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Comidas populares
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {popularFoods.map(food => (
                <button
                  key={food.id}
                  onClick={() => addFood(food)}
                  className="bg-card rounded-xl p-3 border border-border/50 flex items-center gap-2"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <span className="text-lg">🍽️</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs font-medium text-foreground truncate">{food.name}</p>
                    <p className="text-[10px] text-muted-foreground">{food.calories} kcal</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Ingredients input */}
            <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-lg mb-6">
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-emerald-500" />
                Que ingredientes tienes?
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Agrega los ingredientes que tienes disponibles y la IA te sugerira recetas con fotos reales.
              </p>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                  placeholder="ej: pollo, arroz, tomate..."
                  className="flex-1 bg-secondary rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button
                  onClick={addIngredient}
                  className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Ingredients list */}
              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {ingredients.map((ing, idx) => (
                    <span 
                      key={idx} 
                      className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {ing}
                      <button onClick={() => removeIngredient(ing)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={getSuggestedRecipes}
                disabled={ingredients.length === 0 || isLoadingRecipes}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoadingRecipes ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando recetas...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Sugerir recetas con IA
                  </>
                )}
              </button>
            </div>

            {/* Suggested recipes */}
            {suggestedRecipes.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Recetas sugeridas ({suggestedRecipes.length})
                </h3>
                <div className="space-y-3">
                  {suggestedRecipes.map(recipe => (
                    <div key={recipe.id} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                      {/* Recipe image */}
                      <div className="w-full h-40 bg-secondary relative overflow-hidden">
                        {loadingImages.has(recipe.id) ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-2" />
                              <p className="text-xs text-muted-foreground">Generando imagen 4K...</p>
                            </div>
                          </div>
                        ) : recipe.generatedImage ? (
                          <img 
                            src={recipe.generatedImage} 
                            alt={recipe.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-foreground">{recipe.name}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{recipe.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {recipe.prepTime}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                            {recipe.difficulty}
                          </span>
                          <span className="text-xs text-amber-500 font-medium">
                            {recipe.calories} kcal
                          </span>
                        </div>

                        <button
                          onClick={() => addRecipeToLog(recipe)}
                          className="w-full py-2.5 border border-emerald-500 text-emerald-500 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Agregar a mi registro
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestedRecipes.length === 0 && !isLoadingRecipes && (
              <div className="text-center py-12">
                <ChefHat className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Agrega ingredientes y la IA te sugerira recetas deliciosas con imagenes generadas
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
