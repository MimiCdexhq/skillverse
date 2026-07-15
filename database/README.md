# SkillVerse Database

## Setup

1. Install PostgreSQL
2. Create a database named `skillverse`
3. Update `backend/.env` with your PostgreSQL connection:
   ```
   DATABASE_URL=postgres://user:password@localhost:5432/skillverse
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run database setup:
   ```bash
   npm run setup
   ```

## Schema

- `warriors` - Player profiles, stats, MIM/vUSDT balances
- `matches` - Game history and results
- `referrals` - Referral tracking

## Seed Data

The setup script automatically inserts 3 demo warriors if the database is empty:
- Demo Warrior (ID: 1)
- Test Player (ID: 2)
- Pro Gamer (ID: 3)

## Running the Server

```bash
npm start
```
