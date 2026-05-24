import { generateText, Output } from 'ai'
import { z } from 'zod'

export async function POST(req: Request) {
  const formData = await req.formData()
  const image = formData.get('image') as File
  
  if (!image) {
    return Response.json({ error: 'No image provided' }, { status: 400 })
  }

  const bytes = await image.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')
  const mimeType = image.type || 'image/jpeg'

  const result = await generateText({
    model: 'google/gemini-3-flash',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            image: `data:${mimeType};base64,${base64}`,
          },
          {
            type: 'text',
            text: `Analiza esta imagen de comida y proporciona:
1. El nombre del plato o comida que ves (se especifico, por ejemplo "Huevos revueltos con salchicha" no solo "desayuno")
2. Una estimacion aproximada de las calorias totales
3. Los ingredientes principales que puedes identificar
4. El tamano aproximado de la porcion

Responde SOLO con un JSON valido en este formato exacto:
{
  "name": "nombre del plato",
  "calories": numero,
  "ingredients": ["ingrediente1", "ingrediente2"],
  "portion": "descripcion de la porcion",
  "confidence": "high" | "medium" | "low"
}

Si no puedes identificar la comida, responde con:
{
  "name": "No identificado",
  "calories": 0,
  "ingredients": [],
  "portion": "desconocido",
  "confidence": "low"
}`
          }
        ]
      }
    ],
    output: Output.object({
      schema: z.object({
        name: z.string(),
        calories: z.number(),
        ingredients: z.array(z.string()),
        portion: z.string(),
        confidence: z.enum(['high', 'medium', 'low'])
      })
    })
  })

  return Response.json({
    success: true,
    data: result.output
  })
}
