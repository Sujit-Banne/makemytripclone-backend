require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Destination = require('./models/Destination');
const Hotel = require('./models/Hotel');
const Visa = require('./models/Visa');
const Content = require('./models/Content');
const Flight = require('./models/Flight');
const User = require('./models/User');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const connectWithUri = async (uri) => {
      await mongoose.connect(uri);
      console.log(`Connected to MongoDB: ${uri.startsWith('mongodb://127.0.0.1') ? 'local' : 'remote'}`);
    };

    if (process.env.MONGO_URI) {
      try {
        await connectWithUri(process.env.MONGO_URI);
      } catch (err) {
        console.warn('Could not connect to provided MongoDB URI, falling back to in-memory MongoDB.');
        const mongod = await MongoMemoryServer.create();
        await connectWithUri(mongod.getUri());
      }
    } else {
      const mongod = await MongoMemoryServer.create();
      await connectWithUri(mongod.getUri());
    }

    // Clear existing data
    await Destination.deleteMany({});
    await Hotel.deleteMany({});
    await Visa.deleteMany({});
    await Content.deleteMany({});
    await Flight.deleteMany({});
    await User.deleteMany({ role: 'user' }); // Only clear regular users, keep admin if exists
    console.log('Cleared existing data');

    // Seed Destinations
    const destinations = [
      // International
      {
        name: "Europe",
        region: "Europe",
        description: "Explore the rich history, culture, and cuisine of Europe. From Paris to Rome, discover iconic destinations.",
        highlights: ["Historical Sites", "Cultural Heritage", "Cuisine", "Architecture"],
        bestTime: "April to October",
        category: "international"
      },
      {
        name: "Asia",
        region: "Asia",
        description: "Experience the diverse cultures, ancient temples, and modern cities of Asia. From Japan to Thailand.",
        highlights: ["Ancient Temples", "Modern Cities", "Diverse Cultures", "Cuisine"],
        bestTime: "November to March",
        category: "international"
      },
      {
        name: "Americas",
        region: "Americas",
        description: "Discover the vast landscapes and vibrant cultures of North and South America. From NYC to Rio.",
        highlights: ["Natural Wonders", "Urban Exploration", "Adventure Sports", "Cultural Diversity"],
        bestTime: "December to April",
        category: "international"
      },
      // Domestic
      {
        name: "North India",
        region: "North India",
        description: "Experience the majestic Himalayas, ancient temples, and vibrant culture of North India.",
        highlights: ["Himalayas", "Ancient Temples", "Cultural Heritage", "Adventure Sports"],
        bestTime: "March to June, September to December",
        category: "domestic"
      },
      {
        name: "South India",
        region: "South India",
        description: "Discover the spice gardens, backwaters, and ancient temples of South India.",
        highlights: ["Backwaters", "Spice Gardens", "Ancient Temples", "Beaches"],
        bestTime: "October to May",
        category: "domestic"
      },
      {
        name: "Coastal India",
        region: "Coastal India",
        description: "Relax on pristine beaches, enjoy seafood, and explore coastal forts and lighthouses.",
        highlights: ["Pristine Beaches", "Seafood", "Coastal Forts", "Marine Life"],
        bestTime: "October to May",
        category: "domestic"
      }
    ];

    await Destination.insertMany(destinations);
    console.log('Destinations seeded');

    // Seed Hotels
    const hotels = [
      // Domestic Hotels
      {
        name: "Taj Mahal Palace",
        location: "Mumbai, Maharashtra",
        rating: 4.8,
        price: 15000,
        amenities: ["WiFi", "Pool", "Spa", "Restaurant"],
        type: "hotel",
        category: "domestic",
        description: "Luxury heritage hotel in the heart of Mumbai"
      },
      {
        name: "ITC Grand Chola",
        location: "Chennai, Tamil Nadu",
        rating: 4.7,
        price: 12000,
        amenities: ["WiFi", "Pool", "Gym", "Business Center"],
        type: "hotel",
        category: "domestic",
        description: "Modern luxury hotel with traditional South Indian architecture"
      },
      {
        name: "The Oberoi",
        location: "Delhi, NCR",
        rating: 4.9,
        price: 18000,
        amenities: ["WiFi", "Pool", "Spa", "Fine Dining"],
        type: "hotel",
        category: "domestic",
        description: "Iconic luxury hotel in the heart of New Delhi"
      },
      {
        name: "Leela Palace",
        location: "Bangalore, Karnataka",
        rating: 4.6,
        price: 14000,
        amenities: ["WiFi", "Pool", "Spa", "Airport Transfer"],
        type: "resort",
        category: "domestic",
        description: "Luxury palace hotel with modern amenities"
      },
      // International Hotels
      {
        name: "Burj Al Arab",
        location: "Dubai, UAE",
        rating: 5.0,
        price: 50000,
        amenities: ["Private Beach", "Helipad", "Luxury Spa", "Fine Dining"],
        type: "hotel",
        category: "international",
        description: "Iconic luxury hotel shaped like a sail on Jumeirah Beach"
      },
      {
        name: "The Plaza Hotel",
        location: "New York, USA",
        rating: 4.8,
        price: 45000,
        amenities: ["Central Park View", "Spa", "Fine Dining", "Butler Service"],
        type: "hotel",
        category: "international",
        description: "Historic luxury hotel overlooking Central Park"
      },
      {
        name: "Marina Bay Sands",
        location: "Singapore",
        rating: 4.9,
        price: 40000,
        amenities: ["Infinity Pool", "Skyline View", "Casino", "Shopping"],
        type: "resort",
        category: "international",
        description: "Integrated resort with iconic rooftop infinity pool"
      }
    ];

    await Hotel.insertMany(hotels);
    console.log('Hotels seeded');

    // Seed Visas
    const visas = [
      { country: "USA", visaType: "Tourist Visa", processingTime: "2-3 weeks", fee: "$160", category: "tourist", requirements: ["Valid Passport", "Photo", "Application Form", "Financial Proof"] },
      { country: "UK", visaType: "Tourist Visa", processingTime: "3-5 weeks", fee: "£95", category: "tourist", requirements: ["Valid Passport", "Photo", "Application Form", "Financial Proof"] },
      { country: "Canada", visaType: "Tourist Visa", processingTime: "2-4 weeks", fee: "CAD $85", category: "tourist", requirements: ["Valid Passport", "Photo", "Application Form", "Financial Proof"] },
      { country: "Australia", visaType: "Tourist Visa", processingTime: "1-4 weeks", fee: "AUD $145", category: "tourist", requirements: ["Valid Passport", "Photo", "Application Form", "Financial Proof"] },
      { country: "Germany", visaType: "Tourist Visa", processingTime: "2-3 weeks", fee: "€80", category: "tourist", requirements: ["Valid Passport", "Photo", "Application Form", "Financial Proof"] },
      { country: "Japan", visaType: "Tourist Visa", processingTime: "3-5 days", fee: "¥3000", category: "tourist", requirements: ["Valid Passport", "Photo", "Application Form", "Financial Proof"] },
      { country: "USA", visaType: "Business Visa", processingTime: "2-4 weeks", fee: "$160", category: "business", requirements: ["Valid Passport", "Photo", "Invitation Letter", "Company Documents"] },
      { country: "UK", visaType: "Student Visa", processingTime: "3-4 weeks", fee: "£348", category: "student", requirements: ["Valid Passport", "Photo", "University Acceptance", "Financial Proof"] }
    ];

    await Visa.insertMany(visas);
    console.log('Visas seeded');

    // Seed Content
    const content = [
      {
        title: "10 Hidden Gems in Europe",
        content: "Discover the lesser-known but breathtaking destinations across Europe that most tourists miss...",
        author: "Sarah Johnson",
        category: "guide",
        tags: ["Europe", "Hidden Gems", "Travel Guide"],
        reads: 2540,
        likes: 156,
        featured: true
      },
      {
        title: "Budget Travel: Southeast Asia",
        content: "Complete guide to traveling Southeast Asia on a budget without compromising on experiences...",
        author: "Mike Chen",
        category: "tip",
        tags: ["Budget Travel", "Southeast Asia", "Tips"],
        reads: 1890,
        likes: 89,
        featured: true
      },
      {
        title: "Solo Female Travel Safety Tips",
        content: "Essential safety tips for women traveling solo around the world...",
        author: "Emma Davis",
        category: "tip",
        tags: ["Solo Travel", "Safety", "Women Travel"],
        reads: 3250,
        likes: 234,
        featured: true
      },
      {
        title: "Family Adventures in India",
        content: "Amazing family-friendly destinations and activities across India...",
        author: "Raj Patel",
        category: "story",
        tags: ["Family Travel", "India", "Adventure"],
        reads: 1450,
        likes: 78,
        featured: true
      }
    ];

    await Content.insertMany(content);
    console.log('Content seeded');

    // Seed Flights
    const flights = [
      // International Flights
      {
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
          economy: { price: 25000 },
          business: { price: 80000 },
          first: { price: 150000 }
        },
        category: 'international'
      },
      {
        flightNumber: 'EK501',
        airline: 'Emirates',
        departure: {
          airport: 'BOM',
          city: 'Mumbai',
          country: 'India',
          date: new Date('2024-12-02'),
          time: '22:00'
        },
        arrival: {
          airport: 'DXB',
          city: 'Dubai',
          country: 'UAE',
          date: new Date('2024-12-03'),
          time: '01:00'
        },
        duration: '3h 0m',
        aircraft: 'Boeing 777',
        seats: {
          economy: { price: 35000 },
          business: { price: 120000 },
          first: { price: 250000 }
        },
        category: 'international'
      },
      {
        flightNumber: 'QF501',
        airline: 'Qantas',
        departure: {
          airport: 'DEL',
          city: 'Delhi',
          country: 'India',
          date: new Date('2024-12-03'),
          time: '18:30'
        },
        arrival: {
          airport: 'SYD',
          city: 'Sydney',
          country: 'Australia',
          date: new Date('2024-12-04'),
          time: '12:30'
        },
        duration: '11h 0m',
        aircraft: 'Boeing 787',
        seats: {
          economy: { price: 45000 },
          business: { price: 150000 },
          first: { price: 300000 }
        },
        category: 'international'
      },
      // Domestic Flights
      {
        flightNumber: 'AI301',
        airline: 'Air India',
        departure: {
          airport: 'DEL',
          city: 'Delhi',
          country: 'India',
          date: new Date('2024-12-01'),
          time: '08:00'
        },
        arrival: {
          airport: 'BOM',
          city: 'Mumbai',
          country: 'India',
          date: new Date('2024-12-01'),
          time: '10:00'
        },
        duration: '2h 0m',
        aircraft: 'Boeing 737',
        seats: {
          economy: { price: 3500 },
          business: { price: 8000 },
          first: { price: 15000 }
        },
        category: 'domestic'
      },
      {
        flightNumber: 'AI501',
        airline: 'Air India',
        departure: {
          airport: 'BOM',
          city: 'Mumbai',
          country: 'India',
          date: new Date('2024-12-02'),
          time: '14:00'
        },
        arrival: {
          airport: 'BLR',
          city: 'Bangalore',
          country: 'India',
          date: new Date('2024-12-02'),
          time: '15:30'
        },
        duration: '1h 30m',
        aircraft: 'Boeing 737',
        seats: {
          economy: { price: 2800 },
          business: { price: 6500 },
          first: { price: 12000 }
        },
        category: 'domestic'
      },
      {
        flightNumber: 'AI701',
        airline: 'Air India',
        departure: {
          airport: 'DEL',
          city: 'Delhi',
          country: 'India',
          date: new Date('2024-12-03'),
          time: '06:00'
        },
        arrival: {
          airport: 'CCU',
          city: 'Kolkata',
          country: 'India',
          date: new Date('2024-12-03'),
          time: '08:00'
        },
        duration: '2h 0m',
        aircraft: 'Boeing 737',
        seats: {
          economy: { price: 3200 },
          business: { price: 7500 },
          first: { price: 14000 }
        },
        category: 'domestic'
      }
    ];

    await Flight.insertMany(flights);
    console.log('Flights seeded');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
