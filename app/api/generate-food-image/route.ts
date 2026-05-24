import { generateText } from 'ai'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  if (!prompt) {
    return Response.json({ error: 'No prompt provided' }, { status: 400 })
  }

  const result = await generateText({
    model: 'google/gemini-3.1-flash-image-preview',
    prompt: `Generate a professional, appetizing food photography image: ${prompt}. 
The image should be well-lit, on a clean background, shot from above or at a 45-degree angle. 
Make it look delicious and Instagram-worthy. High resolution, 4K quality appearance.`,
  })

  const images = []
  if (result.files) {
    for (const file of result.files) {
      if (file.mediaType?.startsWith('image/')) {
        images.push({
          base64: file.base64,
          mediaType: file.mediaType,
        })
      }
    }
  }

  return Response.json({
    success: true,
    text: result.text,
    images,
  })
}
