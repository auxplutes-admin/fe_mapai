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
    localStorage.setItem('chat_session_id', session.session_id)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
    setSelectedSession(null)
    localStorage.removeItem('chat_session_id')
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse text-lg">Loading sessions...</div>
    </div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-lg text-red-500">{error}</div>
    </div>
  }

  return (
    <div className="mx-auto p-6">
      <div className="grid gap-4">
        {sessions.map((session) => (
          <div 
            key={session.session_id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {session.region_name ? (
                    <h3 className="text-lg font-semibold text-gray-900">
                      {session.region_name}
                    </h3>
                  ) : (
                    <h3 className="text-lg font-semibold text-gray-500">
                      General Session
                    </h3>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(session.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <Button
                onClick={() => handleViewChat(session)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-gray-100"
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
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-semibold">
                {selectedSession?.region_name || 'General Session'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseChat}
                className="hover:bg-gray-200"
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