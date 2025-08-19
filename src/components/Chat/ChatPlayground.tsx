
// import React, { useState, useRef, useEffect } from 'react';
// import { Button } from '../ui/button';
// import { Textarea } from '../ui/textarea';
// import { Send, MessageSquare, Sparkles, Cpu, MapPin, RefreshCw } from 'lucide-react';
// import { sendChatMessage, chatBySessionId } from '@/api';
// import { v4 as uuidv4 } from 'uuid';

// const THEME = '#450275';
// const BG_DARK = '#2e014a';     // messages area background
// const CARD_DARK = '#22013a';   // bubble bg for AI + input bar
// const BORDER = 'rgba(255,255,255,0.12)';
// const TEXT_DIM = 'rgba(255,255,255,0.7)';

// interface Message {
//   id: string;
//   text: string;
//   sender: 'user' | 'ai';
//   timestamp: Date;
// }

// export type ProvinceDetection =
//   | { kind: 'none' }
//   | { kind: 'matched'; province: string }
//   | { kind: 'ambiguous'; options: string[] };

// interface ChatPlaygroundProps {
//   regionId?: string;
//   sessionId?: string;
//   onProvinceIntent?: (text: string) => ProvinceDetection;
//   pendingProvinceChoices?: string[] | null;
//   onChooseProvince?: (province: string) => void;
// }

// const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// const ChatPlayground: React.FC<ChatPlaygroundProps> = ({
//   regionId,
//   sessionId,
//   onProvinceIntent,
//   pendingProvinceChoices,
//   onChooseProvince,
// }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isHistoryLoading, setIsHistoryLoading] = useState(true);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     requestAnimationFrame(() => {
//       messagesEndRef.current?.scrollIntoView({ block: 'end' });
//     });
//   };

//   useEffect(() => {
//     const fetchChatHistory = async () => {
//       setIsHistoryLoading(true);
//       if (!sessionId) {
//         setIsHistoryLoading(false);
//         return;
//       }
//       try {
//         const history = await chatBySessionId({ session_id: sessionId });
//         if (history && Array.isArray(history)) {
//           const formatted: Message[] = [];
//           history.forEach((msg: any) => {
//             if (msg.prompt) {
//               formatted.push({
//                 id: `${msg.id}-prompt`,
//                 text: String(msg.prompt),
//                 sender: 'user',
//                 timestamp: new Date(msg.created_at),
//               });
//             }
//             if (msg.response) {
//               const clean = String(msg.response)
//                 .replace(/\*\*/g, '')
//                 .replace(/\n\n/g, '\n')
//                 .split('\n')
//                 .map((line: string) => {
//                   if (line.startsWith('- ')) return '• ' + line.substring(2);
//                   if (line.startsWith('* ')) return '• ' + line.substring(2);
//                   return line;
//                 })
//                 .join('\n');

//               formatted.push({
//                 id: `${msg.id}-response`,
//                 text: clean,
//                 sender: 'ai',
//                 timestamp: new Date(msg.created_at),
//               });
//             }
//           });
//           formatted.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
//           setMessages(formatted);
//         }
//       } catch (err) {
//         console.error('Error fetching chat history:', err);
//       } finally {
//         setIsHistoryLoading(false);
//       }
//     };

//     fetchChatHistory();
//   }, [sessionId]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async (messageText?: string) => {
//     const textToSend = (messageText ?? input).trim();
//     if (!textToSend) return;
//     if (!sessionId) {
//       console.error('No session ID available');
//       return;
//     }

//     // Province intent detection FIRST — per choice A, ask if ambiguous
//     const intent = onProvinceIntent?.(textToSend);

//     if (intent?.kind === 'ambiguous') {
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: uuidv4(),
//           text: 'Which province did you mean?',
//           sender: 'ai',
//           timestamp: new Date(),
//         },
//       ]);
//       setInput('');
//       return; // wait for user to select a chip
//     }

//     if (intent?.kind === 'matched') {
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: uuidv4(),
//           text: `Focusing on ${intent.province}.`,
//           sender: 'ai',
//           timestamp: new Date(),
//         },
//       ]);
//     }

//     const userMessage: Message = {
//       id: uuidv4(),
//       text: textToSend,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const response = await sendChatMessage({
//         regionId,
//         question: textToSend,
//         session_id: sessionId,
//       });

//       if (!response || !response.answer) throw new Error('No answer returned.');

//       const formattedAnswer = String(response.answer)
//         .replace(/\*\*/g, '')
//         .replace(/\n\n/g, '\n')
//         .split('\n')
//         .map((line: string) => {
//           if (line.startsWith('- ')) return '• ' + line.substring(2);
//           if (line.startsWith('* ')) return '• ' + line.substring(2);
//           return line;
//         })
//         .join('\n');

//       const aiMessage: Message = {
//         id: uuidv4(),
//         text: formattedAnswer,
//         sender: 'ai',
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, aiMessage]);
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: uuidv4(),
//           text: error instanceof Error ? error.message : 'Sorry, there was an error processing your request.',
//           sender: 'ai',
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const shortSession = sessionId ? sessionId.slice(0, 6) : '—';

//   return (
//     <div className="flex flex-col h-[calc(100vh-200px)]" style={{ background: BG_DARK }}>
//       {/* Header */}
//       <div className="px-4 py-3 border-b flex items-center justify-between" style={{ background: THEME, borderColor: BORDER }}>
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'rgba(255,255,255,0.12)', border: `1px solid ${BORDER}` }}>
//             <Cpu className="w-5 h-5 text-white" />
//           </div>
//           <div className="leading-tight">
//             <div className="flex items-center gap-2">
//               <span className="text-white font-semibold tracking-wide">Assistant</span>
//               <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: `1px solid ${BORDER}` }}>
//                 <MapPin className="w-3 h-3" />
//                 {regionId || 'No region'}
//               </span>
//             </div>
//             <div className="text-[11px]" style={{ color: TEXT_DIM }}>
//               Session <span className="font-mono text-white/90">#{shortSession}</span>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center gap-2 text-xs" style={{ color: 'white' }}>
//           <div className="hidden sm:flex items-center gap-1">
//             <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
//             <span>{isLoading ? 'Thinking…' : 'Ready'}</span>
//           </div>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto px-4 py-5">
//         {/* Empty state */}
//         {messages.length === 0 && !isHistoryLoading ? (
//           <div className="mx-auto max-w-[36rem] text-center">
//             <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${BORDER}` }}>
//               <MessageSquare className="w-7 h-7 text-white" />
//             </div>
//             <h4 className="text-xl font-semibold text-white mb-2">How can I help?</h4>
//             <p className="text-sm mb-5" style={{ color: 'white' }}>
//               Ask about this region’s background, risks, actors, or anything else.
//             </p>
//           </div>
//         ) : null}

//         {/* History skeleton */}
//         {isHistoryLoading && (
//           <div className="space-y-3 animate-pulse">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="flex gap-3">
//                 <div className="w-8 h-8 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
//                 <div className="flex-1">
//                   <div className="h-3 w-1/2 rounded mb-2" style={{ background: 'rgba(255,255,255,0.10)' }} />
//                   <div className="h-3 w-2/3 rounded" style={{ background: 'rgba(255,255,255,0.10)' }} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Messages */}
//         <div className="space-y-3">
//           {messages.map((m) => {
//             const mine = m.sender === 'user';
//             return (
//               <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
//                 <div className="flex items-end gap-3 max-w-[85%]">
//                   {!mine && (
//                     <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.10)', border: `1px solid ${BORDER}` }}>
//                       <Sparkles className="w-4 h-4 text-white" />
//                     </div>
//                   )}
//                   <div
//                     className={['rounded-2xl p-4 shadow-lg whitespace-pre-line leading-relaxed'].join(' ')}
//                     style={{
//                       background: mine ? 'linear-gradient(135deg, #6a22c1, #450275)' : CARD_DARK,
//                       color: 'white',
//                       border: `1px solid ${BORDER}`,
//                     }}
//                   >
//                     <p className="text-[14px]">{m.text}</p>
//                     <p className="text-[11px] mt-2" style={{ color: TEXT_DIM }}>
//                       {formatTime(m.timestamp)}
//                     </p>
//                   </div>
//                   {mine && (
//                     <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6a22c1, #450275)', border: `1px solid ${BORDER}` }}>
//                       <span className="text-white text-xs font-medium">U</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}

//           {isLoading && (
//             <div className="flex justify-start">
//               <div className="flex items-end gap-3 max-w-[85%]">
//                 <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.10)', border: `1px solid ${BORDER}` }}>
//                   <Sparkles className="w-4 h-4 text-black" />
//                 </div>
//                 <div className="rounded-2xl p-4" style={{ background: CARD_DARK, border: `1px solid ${BORDER}` }}>
//                   <div className="flex items-center gap-1">
//                     <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" />
//                     <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
//                     <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Ambiguity quick-reply chips */}
//           {pendingProvinceChoices?.length ? (
//             <div className="mt-3 flex flex-wrap gap-2">
//               {pendingProvinceChoices.map((opt) => (
//                 <Button
//                   key={opt}
//                   variant="secondary"
//                   size="sm"
//                   onClick={() => {
//                     onChooseProvince?.(opt);
//                     setMessages((prev) => [
//                       ...prev,
//                       {
//                         id: uuidv4(),
//                         text: `Okay — focusing on ${opt}.`,
//                         sender: 'ai',
//                         timestamp: new Date(),
//                       },
//                     ]);
//                   }}
//                   style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)' }}
//                 >
//                   {opt}
//                 </Button>
//               ))}
//             </div>
//           ) : null}

//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* Input Area */}
//       <div className="p-3 border-t sticky bottom-0" style={{ background: CARD_DARK, borderColor: BORDER }}>
//         <div className="flex gap-3">
//           <div className="flex-1">
//             <div className="relative rounded-2xl shadow-inner" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, backdropFilter: 'blur(6px)' }}>
//               <Textarea
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Type your message…  ⏎ to send"
//                 className="resize-none pr-12 pl-4 py-3 min-h-[52px] max-h-40 border-0 bg-transparent text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0"
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSendMessage();
//                   }
//                 }}
//                 rows={4}
//               />
//               <Button
//                 onClick={() => handleSendMessage()}
//                 disabled={isLoading || !input.trim()}
//                 className="absolute right-2 bottom-2 h-10 w-10 p-0 rounded-full shadow-lg disabled:opacity-50"
//                 style={{ background: THEME }}
//                 aria-label="Send message"
//               >
//                 <Send className="w-5 h-5 text-white" />
//               </Button>
//             </div>
//             <div className="flex items-center justify-between mt-2">
//               <div className="text-[11px]" style={{ color: TEXT_DIM }}>
//                 Press <span className="px-1 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.10)' }}>Enter</span> to send,{' '}
//                 <span className="px-1 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.10)' }}>Shift</span> + Enter for newline
//               </div>
//               <div className="text-[11px]" style={{ color: TEXT_DIM }}>
//                 {regionId ? (
//                   <span className="inline-flex items-center gap-1">
//                     <MapPin className="w-3 h-3" /> {regionId}
//                   </span>
//                 ) : (
//                   <span className="text-white/80">Select a region to start</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPlayground;


import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Send, MessageSquare, Sparkles, Cpu, MapPin, RefreshCw, Download } from 'lucide-react';
import { sendChatMessage, chatBySessionId } from '@/api';
import { v4 as uuidv4 } from 'uuid';

const THEME = '#450275';
const BG_DARK = '#2e014a';     // messages area background
const CARD_DARK = '#22013a';   // bubble bg for AI + input bar
const BORDER = 'rgba(255,255,255,0.12)';
const TEXT_DIM = 'rgba(255,255,255,0.7)';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export type ProvinceDetection =
  | { kind: 'none' }
  | { kind: 'matched'; province: string }
  | { kind: 'ambiguous'; options: string[] };

interface ChatPlaygroundProps {
  regionId?: string;
  sessionId?: string;
  onProvinceIntent?: (text: string) => ProvinceDetection;
  pendingProvinceChoices?: string[] | null;
  onChooseProvince?: (province: string) => void;
}

const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const ChatPlayground: React.FC<ChatPlaygroundProps> = ({
  regionId,
  sessionId,
  onProvinceIntent,
  pendingProvinceChoices,
  onChooseProvince,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ block: 'end' });
    });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      setIsHistoryLoading(true);
      if (!sessionId) {
        setIsHistoryLoading(false);
        return;
      }
      try {
        const history = await chatBySessionId({ session_id: sessionId });
        if (history && Array.isArray(history)) {
          const formatted: Message[] = [];
          history.forEach((msg: any) => {
            if (msg.prompt) {
              formatted.push({
                id: `${msg.id}-prompt`,
                text: String(msg.prompt),
                sender: 'user',
                timestamp: new Date(msg.created_at),
              });
            }
            if (msg.response) {
              const clean = String(msg.response)
                .replace(/\*\*/g, '')
                .replace(/\n\n/g, '\n')
                .split('\n')
                .map((line: string) => {
                  if (line.startsWith('- ')) return '• ' + line.substring(2);
                  if (line.startsWith('* ')) return '• ' + line.substring(2);
                  return line;
                })
                .join('\n');

              formatted.push({
                id: `${msg.id}-response`,
                text: clean,
                sender: 'ai',
                timestamp: new Date(msg.created_at),
              });
            }
          });
          formatted.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          setMessages(formatted);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchChatHistory();
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = (messageText ?? input).trim();
    if (!textToSend) return;
    if (!sessionId) {
      console.error('No session ID available');
      return;
    }

    // Province intent detection FIRST — per choice A, ask if ambiguous
    const intent = onProvinceIntent?.(textToSend);

    if (intent?.kind === 'ambiguous') {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: 'Which province did you mean?',
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
      setInput('');
      return; // wait for user to select a chip
    }

    if (intent?.kind === 'matched') {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: `Focusing on ${intent.province}.`,
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    }

    const userMessage: Message = {
      id: uuidv4(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        regionId,
        question: textToSend,
        session_id: sessionId,
      });

      if (!response || !response.answer) throw new Error('No answer returned.');

      const formattedAnswer = String(response.answer)
        .replace(/\*\*/g, '')
        .replace(/\n\n/g, '\n')
        .split('\n')
        .map((line: string) => {
          if (line.startsWith('- ')) return '• ' + line.substring(2);
          if (line.startsWith('* ')) return '• ' + line.substring(2);
          return line;
        })
        .join('\n');

      const aiMessage: Message = {
        id: uuidv4(),
        text: formattedAnswer,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: error instanceof Error ? error.message : 'Sorry, there was an error processing your request.',
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const shortSession = sessionId ? sessionId.slice(0, 6) : '—';

  // ---------- PDF HELPERS (A4 plain text) ----------
  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const addLinesWithPaging = (
    doc: any,
    lines: string[],
    opts: { x: number; y: number; maxWidth: number; lineHeight: number; marginBottom: number }
  ) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = opts.y;

    for (const line of lines) {
      const wrapped = doc.splitTextToSize(line, opts.maxWidth);
      for (const w of wrapped) {
        if (y > pageHeight - opts.marginBottom) {
          doc.addPage();
          y = opts.marginBottom; // top margin == marginBottom
        }
        doc.text(w, opts.x, y);
        y += opts.lineHeight;
      }
    }
    return y;
  };

  const exportChatToPdf = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    doc.setFont('Helvetica', 'normal');

    // Title
    doc.setFontSize(16);
    doc.text(`Chat Export — ${regionId ?? 'No region'}`, margin, y);
    y += 22;

    doc.setFontSize(10);
    doc.text(`Session: ${sessionId ?? '—'}    Exported: ${formatDate(new Date())}`, margin, y);
    y += 18;

    doc.setDrawColor(180);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;

    // Messages
    doc.setFontSize(12);
    const lineHeight = 16;

    messages.forEach((m) => {
      doc.setFont('Helvetica', 'bold');
      const who = m.sender === 'user' ? 'USER' : 'ASSISTANT';
      y = addLinesWithPaging(doc, [`${who}  [${formatDate(m.timestamp)}]`], {
        x: margin, y, maxWidth, lineHeight, marginBottom: margin
      });
      y += 2;

      doc.setFont('Helvetica', 'normal');
      y = addLinesWithPaging(doc, [m.text], {
        x: margin, y, maxWidth, lineHeight, marginBottom: margin
      });

      y += 10;
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    });

    const fileRegion = (regionId && regionId.trim()) ? regionId.trim() : 'no-region';
    doc.save(`chat-${fileRegion}.pdf`);
  };

  const exportMessageToPdf = async (m: Message) => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 48;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const who = m.sender === 'user' ? 'USER' : 'ASSISTANT';

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`${who} — ${regionId ?? 'No region'}`, margin, y);
    y += 22;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Timestamp: ${formatDate(m.timestamp)}    Session: ${sessionId ?? '—'}`, margin, y);
    y += 18;

    doc.setDrawColor(180);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;

    doc.setFontSize(12);
    const lineHeight = 16;

    y = addLinesWithPaging(doc, [m.text], {
      x: margin, y, maxWidth, lineHeight, marginBottom: margin
    });

    const fileRegion = (regionId && regionId.trim()) ? regionId.trim() : 'no-region';
    doc.save(`chat-${fileRegion}.pdf`);
  };
  // ---------- END PDF HELPERS ----------

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]" style={{ background: BG_DARK }}>
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ background: THEME, borderColor: BORDER }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'rgba(255,255,255,0.12)', border: `1px solid ${BORDER}` }}>
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold tracking-wide">Assistant</span>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: `1px solid ${BORDER}` }}>
                <MapPin className="w-3 h-3" />
                {regionId || 'No region'}
              </span>
            </div>
            <div className="text-[11px]" style={{ color: TEXT_DIM }}>
              Session <span className="font-mono text-white/90">#{shortSession}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs" style={{ color: 'white' }}>
          <div className="hidden sm:flex items-center gap-1">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Thinking…' : 'Ready'}</span>
          </div>

          {/* Export whole chat */}
          <Button
            onClick={exportChatToPdf}
            className="ml-2 h-8 px-3 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.12)', border: `1px solid ${BORDER}`, color: '#fff' }}
            aria-label="Export entire chat to PDF"
            title="Export entire chat to PDF"
          >
            <Download className="w-4 h-4 mr-1" />
            Export All to PDF
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {/* Empty state */}
        {messages.length === 0 && !isHistoryLoading ? (
          <div className="mx-auto max-w-[36rem] text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${BORDER}` }}>
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">How can I help?</h4>
            <p className="text-sm mb-5" style={{ color: 'white' }}>
              Ask about this region’s background, risks, actors, or anything else.
            </p>
          </div>
        ) : null}

        {/* History skeleton */}
        {isHistoryLoading && (
          <div className="space-y-3 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
                <div className="flex-1">
                  <div className="h-3 w-1/2 rounded mb-2" style={{ background: 'rgba(255,255,255,0.10)' }} />
                  <div className="h-3 w-2/3 rounded" style={{ background: 'rgba(255,255,255,0.10)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="space-y-3">
          {messages.map((m) => {
            const mine = m.sender === 'user';
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-end gap-3 max-w-[85%]">
                  {!mine && (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.10)', border: `1px solid ${BORDER}` }}>
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Bubble wrapper with hover export */}
                  <div className="relative group">
                    <div
                      className={['rounded-2xl p-4 shadow-lg whitespace-pre-line leading-relaxed'].join(' ')}
                      style={{
                        background: mine ? 'linear-gradient(135deg, #6a22c1, #450275)' : CARD_DARK,
                        color: 'white',
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      <p className="text-[14px]">{m.text}</p>
                      <p className="text-[11px] mt-2" style={{ color: TEXT_DIM }}>
                        {formatTime(m.timestamp)}
                      </p>
                    </div>

                    {/* Hover-only export button */}
                    <Button
                      onClick={() => exportMessageToPdf(m)}
                      className="absolute -top-2 -right-2 h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      style={{ background: 'rgba(255,255,255,0.12)', border: `1px solid ${BORDER}` }}
                      aria-label="Export this message to PDF"
                      title="Export to PDF"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </Button>
                  </div>

                  {mine && (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6a22c1, #450275)', border: `1px solid ${BORDER}` }}>
                      <span className="text-white text-xs font-medium">U</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-end gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.10)', border: `1px solid ${BORDER}` }}>
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <div className="rounded-2xl p-4" style={{ background: CARD_DARK, border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ambiguity quick-reply chips */}
          {pendingProvinceChoices?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {pendingProvinceChoices.map((opt) => (
                <Button
                  key={opt}
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onChooseProvince?.(opt);
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: uuidv4(),
                        text: `Okay — focusing on ${opt}.`,
                        sender: 'ai',
                        timestamp: new Date(),
                      },
                    ]);
                  }}
                  style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  {opt}
                </Button>
              ))}
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 border-t sticky bottom-0" style={{ background: CARD_DARK, borderColor: BORDER }}>
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="relative rounded-2xl shadow-inner" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, backdropFilter: 'blur(6px)' }}>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message…  ⏎ to send"
                className="resize-none pr-12 pl-4 py-3 min-h-[52px] max-h-40 border-0 bg-transparent text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={4}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 bottom-2 h-10 w-10 p-0 rounded-full shadow-lg disabled:opacity-50"
                style={{ background: THEME }}
                aria-label="Send message"
              >
                <Send className="w-5 h-5 text-white" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-[11px]" style={{ color: TEXT_DIM }}>
                Press <span className="px-1 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.10)' }}>Enter</span> to send,{' '}
                <span className="px-1 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.10)' }}>Shift</span> + Enter for newline
              </div>
              <div className="text-[11px]" style={{ color: TEXT_DIM }}>
                {regionId ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {regionId}
                  </span>
                ) : (
                  <span className="text-white/80">Select a region to start</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPlayground;
