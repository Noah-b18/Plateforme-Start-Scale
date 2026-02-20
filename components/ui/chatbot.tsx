'use client'

import * as React from 'react'
import { Send, MessageCircle, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getChatResponse } from '@/lib/core/chat'
import { TypingIndicator } from '@/components/ui/typing-indicator'

interface Message {
  text: string
  isUser: boolean
}

interface ChatbotProps {
  className?: string
}

export const Chatbot: React.FC<ChatbotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([
    { text: 'Bonjour! Comment puis-je vous aider aujourd\'hui?', isUser: false }
  ])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [isTyping, setIsTyping] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }
  }, [isOpen])

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = input.trim()
      setMessages(prev => [...prev, { text: userMessage, isUser: true }])
      setInput('')
      setIsLoading(true)
      setIsTyping(true)
      try {
        const botResponse = await getChatResponse(userMessage)
        setMessages(prev => [...prev, { text: botResponse, isUser: false }])
      } catch (error) {
        setMessages(prev => [...prev, { text: 'Désolé, une erreur est survenue. Veuillez réessayer.', isUser: false }])
      } finally {
        setIsLoading(false)
        setIsTyping(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleChat = () => setIsOpen(!isOpen)

  return (
    <div className={cn('fixed right-4 z-50', isOpen ? 'bottom-0' : 'bottom-4', className)}>
      {!isOpen && (
        <Button
          onClick={toggleChat}
          size="icon"
          className="rounded-full w-14 h-14 shadow-lg"
          aria-label="Ouvrir le chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
      {isOpen && (
        <Card className="w-80 h-[50vh] max-h-[50vh] flex flex-col shadow-xl bg-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white border-b border-gray-200">
            <CardTitle className="text-lg">Scaly</CardTitle>
            <Button
              onClick={toggleChat}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Fermer le chatbot"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden bg-white">
            <div
              className="h-full overflow-y-auto p-4 space-y-4 bg-white"
              role="log"
              aria-live="polite"
              aria-label="Messages du chatbot"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex',
                    message.isUser ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[70%] px-4 py-2 rounded-lg text-sm',
                      message.isUser
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-muted-foreground rounded-bl-none'
                    )}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
           <CardFooter className="flex gap-2 p-4 pt-0 bg-white border-t-0">
             <Input
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyPress={handleKeyPress}
               placeholder="Tapez votre message..."
               aria-label="Champ de saisie pour le message"
               className="flex-1"
               disabled={isLoading}
             />
             <Button
               onClick={handleSend}
               size="icon"
               aria-label="Envoyer le message"
               disabled={isLoading || !input.trim()}
             >
               <Send className="h-4 w-4" />
             </Button>
           </CardFooter>
        </Card>
      )}
    </div>
  )
}