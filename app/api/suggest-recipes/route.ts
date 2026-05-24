import { generateText, Output } from 'ai'
import { z } from 'zod'

export async function POST(req: Request) {
  const { ingredients } = await req.json()
  
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return Response.json({ error: 'No ingredients provided' }, { status: 400 })
  }

  const result = await generateText({
    model: 'openai/gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: `Basandote en estos ingredientes que tengo disponibles: ${ingredients.join(', ')}

Sugiere 6 recetas que puedo preparar. Incluye recetas variadas (desayuno, almuerzo, cena, snacks).

Para cada receta proporciona:
- Nombre del plato
- Descripcion corta (1 linea)
- Tiempo de preparacion aproximado
- Dificultad (facil, media, dificil)
- Calorias aproximadas
- Una descripcion visual detallada para generar una imagen del plato terminado

Responde SOLO con un JSON valido.`
      }
    ],
    output: Output.object({
      schema: z.object({
        recipes: z.array(z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          prepTime: z.string(),
          difficulty: z.enum(['facil', 'media', 'dificil']),
          calories: z.number(),
          imagePrompt: z.string()
        }))
      })
    })
  })

  return Response.json({
    success: true,
    recipes: result.output?.recipes || []
  })
}
