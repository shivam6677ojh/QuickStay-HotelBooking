# Import Hotels from Kaggle CSV

This script imports hotels and rooms into MongoDB using the dataset at:

- `server/data/goibibo_com-travel_sample.csv/goibibo_com-travel_sample.csv`

## What it does
- Creates hotels from `property_id` (deduplicated)
- Creates one room per distinct `room_type` for each hotel
- Populates address, city, description, and amenities from CSV fields
- Generates a reasonable `pricePerNignt` (string) based on star rating and room type
- Adds placeholder images and sets `isAvailable: true`

## Prerequisites
- `server/.env` must contain `MONGODB_URI`
- Install dependencies

```bash
cd server
npm install
```

## Run the import
```bash
# From the server folder
npm run import:kaggle
```

## Tuning
- Limit number of hotels with `KAGGLE_IMPORT_LIMIT` (default: 200)
- Control clearing existing data with `CLEAR_EXISTING` (default: true)

Examples:
```bash
# Import 500 hotels without clearing existing data
KAGGLE_IMPORT_LIMIT=500 CLEAR_EXISTING=false npm run import:kaggle
```

## Notes
- The script writes directly to `hotels` and `rooms` collections (bypasses Mongoose validation), matching existing sample seeding behavior.
- Field `pricePerNignt` is stored as a number-like string to cooperate with existing filters/UI.
- Images are placeholders; you can update them later or via admin tools.
