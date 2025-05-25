import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MessageSquare, Phone, Mail, Send, Settings, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  recipient: string;
  channel: 'whatsapp' | 'sms' | 'email';
  subject?: string;
  content: string;
  status: 'sent' | 'delivered' | 'failed';
  timestamp: string;
}

const MessagingSystem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [activeTab, setActiveTab] = useState('compose');
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle pre-filled data from navigation state
  useEffect(() => {
    if (location.state) {
      const { patient, prefilledRecipient, preferredChannel } = location.state;
      if (prefilledRecipient) {
        setRecipient(prefilledRecipient);
      }
      if (preferredChannel) {
        setSelectedChannel(preferredChannel);
      }
      if (patient) {
        setSubject(`Message for ${patient.first_name} ${patient.last_name}`);
      }
    }
  }, [location.state]);

  // Sample message history
  const [messageHistory] = useState<Message[]>([
    {
      id: '1',
      recipient: '+1234567890',
      channel: 'whatsapp',
      content: 'Reminder: Your appointment is tomorrow at 2 PM',
      status: 'delivered',
      timestamp: '2024-01-20 10:30 AM'
    },
    {
      id: '2',
      recipient: 'patient@email.com',
      channel: 'email',
      subject: 'Follow-up Appointment',
      content: 'Dear patient, please confirm your follow-up appointment.',
      status: 'sent',
      timestamp: '2024-01-20 09:15 AM'
    },
    {
      id: '3',
      recipient: '+0987654321',
      channel: 'sms',
      content: 'Your lab results are ready for pickup',
      status: 'delivered',
      timestamp: '2024-01-19 03:45 PM'
    }
  ]);

  const handleSendMessage = async () => {
    if (!recipient || !message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const channelActions = {
        whatsapp: () => {
          const formattedPhone = recipient.replace(/\D/g, '');
          window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
        },
        sms: () => {
          window.location.href = `sms:${recipient}?body=${encodeURIComponent(message)}`;
        },
        email: () => {
          const emailSubject = subject || 'Health Tracker Message';
          window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(message)}`;
        }
      };

      channelActions[selectedChannel]();

      toast({
        title: "Message Sent",
        description: `Message sent successfully via ${selectedChannel.toUpperCase()}`,
      });

      // Reset form
      setRecipient('');
      setSubject('');
      setMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'sms': return <Phone className="h-4 w-4 text-blue-600" />;
      case 'email': return <Mail className="h-4 w-4 text-purple-600" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/admin')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Communication Center
                </h1>
                <p className="text-sm text-gray-600">
                  Send messages via WhatsApp, SMS, and Email
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate('/admin', { state: { activeTab: 'settings' } })}
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose" className="flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Compose</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>History</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Templates</span>
            </TabsTrigger>
          </TabsList>

          {/* Compose Message */}
          <TabsContent value="compose">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  <span>Compose Message</span>
                </CardTitle>
                <CardDescription>
                  Send messages to patients via WhatsApp, SMS, or Email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Communication Channel</label>
                      <Select value={selectedChannel} onValueChange={(value: 'whatsapp' | 'sms' | 'email') => setSelectedChannel(value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whatsapp">
                            <div className="flex items-center space-x-2">
                              <MessageSquare className="w-4 h-4 text-green-600" />
                              <span>WhatsApp</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="sms">
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-blue-600" />
                              <span>SMS</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="email">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-purple-600" />
                              <span>Email</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        {selectedChannel === 'email' ? 'Email Address' : 'Phone Number'}
                      </label>
                      <Input
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder={
                          selectedChannel === 'email' 
                            ? 'patient@example.com' 
                            : '+1234567890'
                        }
                        className="mt-1"
                      />
                    </div>

                    {selectedChannel === 'email' && (
                      <div>
                        <label className="text-sm font-medium">Subject</label>
                        <Input
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Enter email subject"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="mt-1 min-h-[120px]"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {message.length}/160 characters
                      </p>
                    </div>

                    <Button 
                      onClick={handleSendMessage}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isLoading ? 'Sending...' : `Send via ${selectedChannel.toUpperCase()}`}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Message History */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Message History</CardTitle>
                <CardDescription>View all sent messages and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messageHistory.map((msg) => (
                    <div key={msg.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {getChannelIcon(msg.channel)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {msg.recipient}
                          </p>
                          <Badge className={getStatusColor(msg.status)}>
                            {msg.status}
                          </Badge>
                        </div>
                        {msg.subject && (
                          <p className="text-sm text-gray-600 mt-1">
                            Subject: {msg.subject}
                          </p>
                        )}
                        <p className="text-sm text-gray-800 mt-2">
                          {msg.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Message Templates */}
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Message Templates</CardTitle>
                <CardDescription>Pre-written messages for common scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Appointment Reminder",
                      content: "Hello {patient_name}, this is a reminder about your appointment on {date} at {time}. Reply Y to confirm."
                    },
                    {
                      title: "Follow-up Reminder",
                      content: "Hello {patient_name}, please don't forget your follow-up appointment on {date}. Your health is important to us!"
                    },
                    {
                      title: "Lab Results Ready",
                      content: "Good news! Your lab results are ready for pickup. Please visit our clinic during business hours."
                    },
                    {
                      title: "Medication Reminder",
                      content: "Don't forget to take your medication as prescribed. If you have any questions, please contact us."
                    }
                  ].map((template, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                         onClick={() => setMessage(template.content)}>
                      <h4 className="font-medium text-gray-900">{template.title}</h4>
                      <p className="text-sm text-gray-600 mt-2">{template.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MessagingSystem;
