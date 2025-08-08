import React, { useEffect, useState } from 'react'
import { getAllSessions } from '@/api'
import ChatPlayground from '@/components/Chat/ChatPlayground';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { MessageSquare } from 'lucide-react';

interface Session {
  session_id: string;
  created_at: string;
  region_name: string | null;
  region_id: string | null;
}

const SessionsPage = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getAllSessions()
        setSessions(data)
      } catch (err) {
        setError('Failed to fetch sessions')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const handleViewChat = (session: Session) => {
    setSelectedSession(session)
    setIsChatOpen(true)
    // Store the session ID in localStorage when viewing
    localStorage.setItem('chat_session_id', session.session_id)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
    setSelectedSession(null)
    // Remove the session ID from localStorage when closing
    localStorage.removeItem('chat_session_id')
  }

  if (loading) {
    return <div className="p-4">Loading sessions...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="p-4">
      <div className="grid gap-4">
        {sessions.map((session) => (
          <div 
            key={session.session_id}
            className="bg-white p-4 rounded-lg shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Session ID: {session.session_id}</p>
                {/* <p className="text-sm text-gray-500">
                  Created: {new Date(session.created_at).toLocaleString()}
                </p> */}
                {session.region_name && (
                  <p className="text-sm text-gray-700">
                    Region: {session.region_name}
                  </p>
                )}
              </div>
              <Button
                onClick={() => handleViewChat(session)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                View Chat
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Sheet */}
      <Sheet open={isChatOpen} onOpenChange={(open) => !open && handleCloseChat()}>
        <SheetContent className="sm:max-w-[1200px] h-full p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Chat History - {selectedSession?.region_name}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseChat}
              >
                Close
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              {selectedSession && (
                <ChatPlayground 
                  sessionId={selectedSession.session_id}
                  regionId={selectedSession.region_id || undefined}
                />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default SessionsPage