# Update Hotel Database with Indian Cities

## What Changed:

### 🏨 **New Indian Hotels Created:**
1. **Taj Palace Hotel** - New Delhi
2. **The Oberoi Mumbai** - Mumbai
3. **ITC Grand Chola** - Chennai
4. **Leela Palace Bangalore** - Bangalore
5. **Taj Lake Palace** - Udaipur
6. **The Oberoi Amarvilas** - Agra

### 💰 **Prices Updated (in INR):**
- Single Bed: ₹2,500/night
- Double Bed: ₹4,500/night
- Luxury Suite: ₹8,500/night
- Family Suite: ₹12,000/night

### 🔍 **Search Bar Fixed:**
- Better alignment with icon button
- Wider dropdown (380px → 384px)
- Improved spacing and padding
- Updated search suggestions (Mumbai, Delhi, Bangalore)
- Proper vertical centering

## How to Update Your Database:

### Step 1: Navigate to server folder
```bash
cd server
```

### Step 2: Run the seed script
```bash
node addSampleData.js
```

### Step 3: Restart your server
```bash
npm start
```

## What You'll See:
- 6 different hotels in major Indian cities
- Each hotel has 2-4 different room types
- All locations are now in India
- No more "New York" references

## Test the Search:
Try searching for:
- Mumbai
- Delhi
- Bangalore
- Chennai
- Udaipur
- Agra

Enjoy your updated QuickStay with Indian hotels! 🇮🇳
