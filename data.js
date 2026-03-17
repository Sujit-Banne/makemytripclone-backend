// In-memory data store for development
let users = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@makemytrip.com',
    password: '$2b$10$UnyYcuhRfUAmQ7GfjghqbeIBHcFH8oOqWj13CVrKxU8DmgaylRjOu', // hashed 'admin123'
    role: 'admin',
    createdAt: new Date()
  }
];

let posts = [
  {
    _id: '1',
    title: 'My Amazing Trip to Bali',
    content: 'Bali was incredible! The beaches, temples, and food were unforgettable.',
    userId: { _id: '1', name: 'Admin User', email: 'admin@makemytrip.com' },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let destinations = [
  {
    _id: '1',
    name: 'Bali',
    region: 'Asia',
    description: 'Beautiful island paradise with stunning beaches and culture.',
    highlights: ['Beaches', 'Temples', 'Volcanoes'],
    bestTime: 'April to October',
    category: 'international',
    image: '🏝️',
    createdAt: new Date()
  },
  {
    _id: '2',
    name: 'Goa',
    region: 'India',
    description: 'Famous for its beaches, nightlife, and Portuguese heritage.',
    highlights: ['Beaches', 'Nightlife', 'Colonial Architecture'],
    bestTime: 'November to May',
    category: 'domestic',
    image: '🏖️',
    createdAt: new Date()
  }
];

let hotels = [
  {
    _id: '1',
    name: 'Grand Bali Hotel',
    location: 'Bali',
    rating: 4.5,
    price: 150,
    image: '🏨',
    amenities: ['Pool', 'Spa', 'Restaurant'],
    type: 'resort',
    description: 'Luxury resort with ocean views',
    createdAt: new Date()
  }
];

let visas = [
  {
    _id: '1',
    country: 'Indonesia',
    visaType: 'Tourist Visa',
    processingTime: '3-5 days',
    fee: '$80',
    requirements: ['Passport', 'Photo', 'Application Form'],
    description: '30-day tourist visa for Indonesia',
    category: 'tourist',
    createdAt: new Date()
  }
];

let content = [
  {
    _id: '1',
    title: 'Top 10 Beaches in Bali',
    content: 'Discover the most beautiful beaches in Bali...',
    author: 'Travel Expert',
    category: 'guide',
    tags: ['bali', 'beaches', 'travel'],
    image: '🏖️',
    reads: 150,
    likes: 25,
    featured: true,
    createdAt: new Date()
  }
];

let flights = [
  {
    _id: '1',
    flightNumber: 'AI101',
    airline: 'Air India',
    departure: {
      airport: 'DEL',
      city: 'Delhi',
      country: 'India',
      date: new Date('2024-12-01'),
      time: '10:00'
    },
    arrival: {
      airport: 'DPS',
      city: 'Denpasar',
      country: 'Indonesia',
      date: new Date('2024-12-01'),
      time: '16:00'
    },
    duration: '6h 0m',
    aircraft: 'Boeing 737',
    seats: {
      economy: { total: 150, available: 120, price: 250 },
      business: { total: 20, available: 15, price: 800 },
      first: { total: 10, available: 8, price: 1500 }
    },
    status: 'scheduled',
    createdAt: new Date()
  }
];

module.exports = {
  users,
  posts,
  destinations,
  hotels,
  visas,
  content,
  flights
};