'use server'

export async function getChatResponse(message: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OpenRouter API key is not configured')
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'Start-Scale Chatbot',
      },
      body: JSON.stringify({
        model: 'xiaomi/mimo-v2-flash:free',
        messages: [
          {
            role: 'system',
            content: 'Vous êtes un assistant virtuel professionnel pour Start-Scale, la plateforme dédiée aux jeunes entrepreneurs. Start-Scale aide les jeunes à transformer leurs idées en startups réussies grâce à des modules éducatifs interactifs, un système de gamification avec points XP et niveaux, et un réseau de mentors expérimentés. Répondez toujours en français de manière professionnelle, factuelle et concise. Fournissez des informations directes sans enthousiasme excessif. Ne suggérez des actions que si explicitement demandé. IMPORTANT : Limitez vos réponses à maximum 30 mots.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 100,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.'
  } catch (error) {
    console.error('Error calling OpenRouter API:', error)
    throw new Error('Erreur lors de la génération de la réponse.')
  }
}