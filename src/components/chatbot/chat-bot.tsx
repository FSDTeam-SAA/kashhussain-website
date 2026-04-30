"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MessageSquareText, Send, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { VehicleCheckData } from "@/app/(website)/vehicle-check/[regNumber]/_components/vehicle-check.types"
import Image from "next/image"

import aiImage from "../../../public/assets/images/ai_prompt.png"

type MotSummaryData = VehicleCheckData["motHistory"];

interface Message {
  sender: "user" | "bot"
  text: string
}

type Props = {
  motHistory?: MotSummaryData | null;
  data?: VehicleCheckData | null;
};



export function ChatBot({
  data,
  // motHistory,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // LocalStorage Key based on vehicle registration
  const storageKey = `chatbot_msgs_vehicle_${data?.registrationNumber || 'default'}`

  // Load initial messages from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          setMessages(JSON.parse(saved))
        } catch (error) {
          console.error("Failed to parse chat messages from localStorage:", error)
        }
      }
    }
  }, [storageKey])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages))
    }
  }, [messages, storageKey])

  // Handle outside click to close the chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    
    // Add User Message to UI
    const currentMessages: Message[] = [...messages, { sender: "user", text: userMessage }]
    setMessages(currentMessages)
    setInput("")
    setIsLoading(true)

    // Construct the previous chat pairs from UI messages (excluding the message we just added)
    const prevChatPairs: Array<{ user_query: string; ai_response: string }> = []
    let tempUserQuery = ""
    for (let i = 0; i < currentMessages.length - 1; i++) {
       const msg = currentMessages[i]
       if (msg.sender === "user") {
           tempUserQuery = msg.text
       } else if (msg.sender === "bot" && tempUserQuery) {
           prevChatPairs.push({ user_query: tempUserQuery, ai_response: msg.text })
           tempUserQuery = ""
       }
    }

    // Explicitly grab the Last 2 Chat pairs (as requested setup in LocalStorage-based history)
    const lastTwoPairs = prevChatPairs.slice(-2)

    const payload = {
      motor_info: data || {},
      // mot_info: motHistory || {},
      // milleage_info: motHistory || {},
      user_query: userMessage,
      previous_chat: lastTwoPairs,
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CHATBOT_URL}/ai/analysis/motor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json"
        },
        body: JSON.stringify(payload), 
      })

      const resData = await response.json()

      console.log("Bot response:", response)

      if (resData?.status && resData?.message) {
        setMessages((prev) => [...prev, { sender: "bot", text: resData.message }])
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I am having trouble understanding that." }])
      }
    } catch (error) {
      console.error("Error sending message to the bot:", error)
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, there was a network error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-tr from-blue-700 to-blue-500 border-none transition-transform hover:scale-105"
        >
          <MessageSquareText className="h-7 w-7 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div ref={chatRef} className="animate-in fade-in slide-in-from-bottom-5 duration-200 ease-out">
          <Card className="bg-white w-[340px] sm:w-[380px] h-[580px] sm:h-[620px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden rounded-2xl">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-4 flex flex-row justify-between items-center flex-shrink-0 shadow-sm border-b-0 space-y-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  {/* <MessageSquareText className="h-4 w-4 text-white" /> */}
                  <Image src={aiImage} alt="ai" width={300} height={300} className="w-10 h-10 rounded-full"/>
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] leading-tight text-white">AI Assistant</h3>
                  <p className="text-[11px] text-blue-100 font-medium tracking-wide flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                    </span>
                    Online
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-white/90 hover:bg-white/10 hover:text-white rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>

            {/* Chat Area */}
            <CardContent className="p-4 flex-grow overflow-y-auto bg-gray-50 flex flex-col">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 mb-4">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                    <MessageSquareText className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-gray-800">Hi there! 👋</p>
                    <p className="text-xs text-gray-500 px-4">Ask me anything about this vehicle. I am ready to help!</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                     <button onClick={() => setInput("What is the mileage?")} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs rounded-full hover:bg-blue-50 transition-colors shadow-sm">What is the mileage?</button>
                     <button onClick={() => setInput("Is it ULEZ compliant?")} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs rounded-full hover:bg-blue-50 transition-colors shadow-sm">Is it ULEZ compliant?</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={cn(
                        "max-w-[85%] p-3 rounded-2xl text-[14px] leading-relaxed relative",
                        msg.sender === "user"
                          ? "bg-blue-600 text-white ml-auto rounded-tr-sm shadow-sm"
                          : "bg-white text-gray-800 rounded-tl-sm shadow-[0_2px_5px_rgba(0,0,0,0.06)] border border-gray-100",
                      )}
                    >
                      {msg.text.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i !== msg.text.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="bg-white border border-gray-100 shadow-[0_2px_5px_rgba(0,0,0,0.06)] max-w-fit px-4 py-3 rounded-2xl rounded-tl-sm">
                      <div className="flex items-center space-x-1.5 h-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-1" />
                </div>
              )}
            </CardContent>

            {/* Input Form */}
            <CardFooter className="p-3 bg-white border-t border-gray-100 flex-shrink-0 relative">
              <form onSubmit={handleSendMessage} className="flex relative w-full items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  className="w-full h-[45px] text-sm bg-gray-100/80 border-transparent rounded-full pl-5 pr-14 outline-none focus:bg-gray-100 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 placeholder:text-gray-400 disabled:opacity-50"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 shadow-md flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:scale-100 hover:scale-105"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-[15px] w-[15px] ml-0.5 text-white" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
