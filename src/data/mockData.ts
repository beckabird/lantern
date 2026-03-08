export interface Auction {
  id: string;
  title: string;
  location: string;
  activity: string;
  category: 'Romantic' | 'Cozy' | 'Playful' | 'Fancy' | 'Outdoor';
  currentBid: number;
  endsAt: number; // timestamp ms
  imageUrl: string;
  proposedTime: string;
  hostName: string;
}

export const MOCK_AUCTIONS: Auction[] = [
  {
    id: '1',
    title: 'Rooftop Dinner & Stargazing',
    location: 'The High Line, New York',
    activity: 'Private rooftop dinner with sommelier-selected wines, followed by guided stargazing with a professional telescope.',
    category: 'Romantic',
    currentBid: 120,
    endsAt: Date.now() + 3 * 60 * 60 * 1000,
    imageUrl: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=800&q=80',
    proposedTime: 'Saturday, 8:00 PM',
    hostName: 'Sophia',
  },
  {
    id: '2',
    title: 'Candlelit Café & Jazz Evening',
    location: 'The Blue Note, NYC',
    activity: 'Intimate candlelit dinner at a historic jazz café, followed by a live jazz performance in a private booth.',
    category: 'Cozy',
    currentBid: 85,
    endsAt: Date.now() + 5 * 60 * 60 * 1000,
    imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80',
    proposedTime: 'Friday, 7:30 PM',
    hostName: 'Marcus',
  },
  {
    id: '3',
    title: 'Craft Cocktails & Jazz Lounge',
    location: 'The Dead Rabbit, NYC',
    activity: 'Guided craft cocktail masterclass with award-winning mixologist, then settle into a velvet booth for the evening jazz set.',
    category: 'Playful',
    currentBid: 65,
    endsAt: Date.now() + 1.5 * 60 * 60 * 1000,
    imageUrl: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?w=800&q=80',
    proposedTime: 'Thursday, 9:00 PM',
    hostName: 'Elena',
  },
  {
    id: '4',
    title: 'Private Gallery Opening',
    location: 'Gagosian Gallery, Chelsea',
    activity: 'Exclusive after-hours tour of a private art collection, champagne reception, and a conversation with the featured artist.',
    category: 'Fancy',
    currentBid: 200,
    endsAt: Date.now() + 8 * 60 * 60 * 1000,
    imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80',
    proposedTime: 'Sunday, 6:00 PM',
    hostName: 'Alexandre',
  },
  {
    id: '5',
    title: 'Wine Tasting at Sunset',
    location: 'Brooklyn Bridge Park',
    activity: 'Curated wine tasting with a certified sommelier overlooking the Manhattan skyline as the sun sets over the river.',
    category: 'Romantic',
    currentBid: 95,
    endsAt: Date.now() + 4 * 60 * 60 * 1000,
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    proposedTime: 'Saturday, 5:30 PM',
    hostName: 'Isabelle',
  },
  {
    id: '6',
    title: "Chef's Kitchen Adventure",
    location: 'Institute of Culinary Education',
    activity: 'Private cooking lesson with a Michelin-starred chef — learn to craft a 3-course meal together, then enjoy the feast.',
    category: 'Outdoor',
    currentBid: 150,
    endsAt: Date.now() + 2 * 60 * 60 * 1000,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    proposedTime: 'Sunday, 2:00 PM',
    hostName: 'Jordan',
  },
];

export interface Conversation {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  previewText: string;
  timestamp: string;
  unread: number;
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: '1', name: 'Sophia', initials: 'S', avatarColor: '#8B5CF6', previewText: 'See you Saturday! 🕯️', timestamp: '2m', unread: 2 },
  { id: '2', name: 'Marcus', initials: 'M', avatarColor: '#EC4899', previewText: 'The jazz venue confirmed', timestamp: '1h', unread: 0 },
  { id: '3', name: 'Elena', initials: 'E', avatarColor: '#F59E0B', previewText: 'Can we move to 9:30?', timestamp: '3h', unread: 1 },
  { id: '4', name: 'Alexandre', initials: 'A', avatarColor: '#10B981', previewText: 'Gallery is confirmed ✓', timestamp: '1d', unread: 0 },
  { id: '5', name: 'Isabelle', initials: 'I', avatarColor: '#3B82F6', previewText: 'Excited for the wine tasting!', timestamp: '2d', unread: 0 },
];

export const MOCK_CHAT_MESSAGES: Record<string, Array<{id: string; text: string; fromMe: boolean; time: string}>> = {
  '1': [
    { id: '1', text: 'Hi! I just won your auction 🎉', fromMe: true, time: '5:00 PM' },
    { id: '2', text: 'Welcome! So excited to meet you 🕯️', fromMe: false, time: '5:01 PM' },
    { id: '3', text: 'The rooftop reservation is confirmed for Saturday at 8 PM', fromMe: false, time: '5:02 PM' },
    { id: '4', text: "Perfect! Can't wait 🌟", fromMe: true, time: '5:03 PM' },
    { id: '5', text: 'See you Saturday! 🕯️', fromMe: false, time: '5:04 PM' },
  ],
  '2': [
    { id: '1', text: 'Looking forward to the jazz evening!', fromMe: true, time: '3:00 PM' },
    { id: '2', text: 'Me too! I reserved a private booth', fromMe: false, time: '3:01 PM' },
    { id: '3', text: 'The jazz venue confirmed', fromMe: false, time: '3:02 PM' },
  ],
  '3': [
    { id: '1', text: 'Hey! About Thursday night...', fromMe: false, time: '2:00 PM' },
    { id: '2', text: 'Can we move to 9:30?', fromMe: false, time: '2:01 PM' },
    { id: '3', text: 'Of course! 9:30 works', fromMe: true, time: '2:10 PM' },
  ],
  '4': [
    { id: '1', text: 'The gallery opening is going to be spectacular', fromMe: false, time: '11:00 AM' },
    { id: '2', text: 'Gallery is confirmed ✓', fromMe: false, time: '11:01 AM' },
    { id: '3', text: 'I will be there', fromMe: true, time: '11:30 AM' },
  ],
  '5': [
    { id: '1', text: 'The view from Brooklyn Bridge Park is stunning', fromMe: false, time: 'Yesterday' },
    { id: '2', text: 'Excited for the wine tasting!', fromMe: false, time: 'Yesterday' },
    { id: '3', text: "I brought a great bottle of Barolo 🍷", fromMe: true, time: 'Yesterday' },
  ],
};

export const MOCK_TICKETS = [
  {
    id: 'T1',
    auctionId: '1',
    title: 'Rooftop Dinner & Stargazing',
    partner: 'Sophia',
    partnerInitials: 'S',
    partnerAvatarColor: '#8B5CF6',
    scheduledTime: 'Saturday, Dec 14 · 8:00 PM',
    tier: 'Burning Bright',
    location: 'The High Line, New York',
    status: 'upcoming' as const,
  },
  {
    id: 'T2',
    auctionId: '3',
    title: 'Craft Cocktails & Jazz Lounge',
    partner: 'Elena',
    partnerInitials: 'E',
    partnerAvatarColor: '#F59E0B',
    scheduledTime: 'Thursday, Dec 5 · 9:00 PM',
    tier: 'Starter Flame',
    location: 'The Dead Rabbit, NYC',
    status: 'past' as const,
  },
];
