# ⚔️ SkillVerse System Design

## Overview

SkillVerse is a competitive gaming platform built as a Telegram Mini App. Players compete in skill-based games (Rock Paper Scissors), earn in-game currencies (MIM and vUSDT), climb leaderboards, and participate in seasonal reward pools.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────┐
│  Telegram Bot   │────▶│  Express.js API  │────▶│  PostgreSQL   │
│  (Commands)     │     │  (Backend)       │     │  Database     │
└─────────────────┘     └──────────────────┘     └───────────────┘
                                ▲                        ▲
                                │                        │
                       ┌──────┴──────┐       ┌────────┴────────┐
                       │ Telegram    │       │   Migrations    │
                       │ Mini App    │       │   & Seeds       │
                       │ (Frontend)  │       └─────────────────┘
                       └─────────────┘
```

## Components

### 1. Telegram Bot
- Handles slash commands (`/start`, `/play`, `/leaderboard`, `/wallet`, etc.)
- Opens the Mini App webview for interactive gameplay
- Sends notifications for rewards and events

### 2. Backend API (Express.js)
- **Port**: 3000 (configurable)
- **Authentication**: JWT tokens issued after Telegram login verification
- **Rate Limiting**: 100 requests per 15 minutes
- **Security**: Helmet.js for headers, CORS enabled, input validation via Joi

#### API Endpoints

| Method | Endpoint                     | Auth | Description                    |
|--------|------------------------------|------|--------------------------------|
| POST   | /api/auth/login              | No   | Telegram login/registration    |
| GET    | /api/warrior/profile         | Yes  | Get warrior profile            |
| GET    | /api/warrior/stats           | Yes  | Get warrior statistics         |
| PUT    | /api/warrior/profile         | Yes  | Update warrior profile         |
| POST   | /api/match/create            | Yes  | Create a new match             |
| POST   | /api/match/:id/join          | Yes  | Join an existing match         |
| POST   | /api/match/:id/result        | Yes  | Submit match result            |
| GET    | /api/match/history           | Yes  | Get match history              |
| GET    | /api/leaderboard/skillscore  | No   | Leaderboard by SkillScore      |
| GET    | /api/leaderboard/mim         | No   | Leaderboard by MIM balance     |
| GET    | /api/leaderboard/games       | No   | Leaderboard by games played    |
| GET    | /api/leaderboard/streak      | No   | Leaderboard by win streak      |
| GET    | /api/leaderboard/referrals   | No   | Leaderboard by referrals       |
| GET    | /api/leaderboard/halloffame  | No   | Hall of Fame                   |
| GET    | /api/wallet                  | Yes  | Get wallet balances            |
| GET    | /api/wallet/history          | Yes  | Get transaction history        |
| POST   | /api/wallet/daily-reward     | Yes  | Claim daily reward             |
| POST   | /api/referral                | Yes  | Create referral                |
| GET    | /api/referral                | Yes  | Get referrals list             |
| GET    | /api/referral/stats          | Yes  | Get referral statistics        |

### 3. Database (PostgreSQL)

#### Tables

**warriors**
| Column           | Type         | Description                    |
|------------------|--------------|--------------------------------|
| warrior_id       | SERIAL PK    | Primary key                    |
| telegram_id      | BIGINT UNIQ  | Telegram user ID               |
| username         | VARCHAR(255) | Telegram username              |
| display_name     | VARCHAR(100) | Display name                   |
| avatar_url       | TEXT         | Profile picture URL            |
| skill_score      | INTEGER      | Competitive ranking points     |
| mim_balance      | BIGINT       | In-game currency balance       |
| vusdt_balance    | DECIMAL(18,6)| Virtual USDT balance           |
| level            | INTEGER      | Player level                   |
| rank             | INTEGER      | Current rank                   |
| total_wins       | INTEGER      | Total wins                     |
| total_losses     | INTEGER      | Total losses                   |
| total_draws      | INTEGER      | Total draws                    |
| games_played     | INTEGER      | Total games played             |
| win_streak       | INTEGER      | Current win streak             |
| referral_code    | VARCHAR(20)  | Unique referral code           |
| last_daily_reward| TIMESTAMP    | Last daily reward claim        |
| created_at       | TIMESTAMP    | Account creation date          |
| updated_at       | TIMESTAMP    | Last update date               |

**matches**
| Column           | Type         | Description                    |
|------------------|--------------|--------------------------------|
| match_id         | UUID PK      | Unique match identifier        |
| player1_id       | INTEGER FK   | First player                   |
| player2_id       | INTEGER FK   | Second player (nullable for AI)|
| winner_id        | INTEGER FK   | Winner (nullable)              |
| game_type        | VARCHAR(50)  | Game type (rps, etc.)          |
| opponent_type    | VARCHAR(10)  | 'ai' or 'pvp'                  |
| result           | VARCHAR(10)  | 'win', 'loss', or 'draw'       |
| player_choice    | VARCHAR(20)  | Player's choice in game        |
| opponent_choice  | VARCHAR(20)  | Opponent's choice              |
| status           | VARCHAR(20)  | 'waiting', 'playing', 'done'   |
| created_at       | TIMESTAMP    | Match creation date            |
| completed_at     | TIMESTAMP    | Match completion date          |

**referrals**
| Column           | Type         | Description                    |
|------------------|--------------|--------------------------------|
| referral_id      | SERIAL PK    | Primary key                    |
| referrer_id      | INTEGER FK   | Referring warrior              |
| referred_id      | INTEGER FK   | Referred warrior               |
| reward_amount    | DECIMAL(18,6)| Reward amount                  |
| status           | VARCHAR(20)  | 'pending' or 'completed'       |
| created_at       | TIMESTAMP    | Referral date                  |
| completed_at     | TIMESTAMP    | Completion date                |

**transactions**
| Column           | Type         | Description                    |
|------------------|--------------|--------------------------------|
| transaction_id   | SERIAL PK    | Primary key                    |
| warrior_id       | INTEGER FK   | Warrior who made transaction   |
| type             | VARCHAR(50)  | Transaction type               |
| amount           | NUMERIC(18,6)| Transaction amount             |
| currency         | VARCHAR(10)  | 'MIM' or 'vUSDT'               |
| description      | TEXT         | Transaction description        |
| created_at       | TIMESTAMP    | Transaction date               |

### 4. Frontend (Telegram Mini App)

#### Architecture

```
┌─────────────────────────────────────┐
│         App Controller              │
│  - Initialization                   │
│  - Telegram Login                   │
│  - Session Management               │
└─────────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌───────┐  ┌──────────┐  ┌──────────┐
│ Router │  │   API    │  │  State   │
│        │  │ Service  │  │ Manager  │
└───────┘  └──────────┘  └──────────┘
    │            │            │
    ▼            ▼            ▼
┌─────────────────────────────────────┐
│           Screens                   │
│  - Splash, Dashboard, Play, etc.    │
└─────────────────────────────────────┘
```

#### Screens
1. **Splash Screen** - Animated logo and loading bar
2. **Landing Page** - Hero section with features
3. **Dashboard** - Wallet summary, play button, menu grid
4. **Game Selection** - Choose RPS game
5. **Match Setup** - AI or PvP mode
6. **RPS Gameplay** - Rock/Paper/Scissors choices
7. **Victory Screen** - Rewards display
8. **Leaderboards** - Tabbed rankings
9. **Wallet** - Balances and transaction history
10. **Profile** - Warrior stats and details
11. **Daily Reward** - Claim screen

## Game Logic: Rock Paper Scissors

### Rules
- Rock beats Scissors
- Scissors beats Paper
- Paper beats Rock

### Rewards
| Result | SkillScore | MIM   |
|--------|-----------|-------|
| Win    | +10       | +10   |
| Draw   | +2        | +2    |
| Loss   | +0        | +1    |

### Streaks
- 3 Wins = Bronze Streak
- 5 Wins = Silver Streak
- 10 Wins = Gold Streak

## Economy

### MIM (In-Game Currency)
- Total Supply: 10,000,000,000 (10 Billion)
- Sources: Wins, missions, daily rewards, referrals, events
- Uses: Cosmetics, special events, exclusive rewards

### vUSDT (Virtual USDT)
- Season 1 only, non-withdrawable
- Sources: Leaderboard rewards, referrals, community events
- End of Season 1: Convert to real USDT based on reward pool

### Reward Pool (Season 1)
- Total: 10,000 USDT
- Distribution based on vUSDT earned, fair play, rule compliance

## Authentication Flow

1. User opens Mini App from Telegram
2. Telegram Web App provides `initData` with user info and hash
3. Backend verifies the hash using HMAC-SHA256
4. Backend creates or retrieves warrior account
5. JWT token is returned and stored
6. All subsequent requests include the JWT in Authorization header

## Deployment

- **Frontend**: Vercel or Netlify
- **Backend**: Railway or Render
- **Database**: Railway PostgreSQL or Supabase
- **Telegram Bot**: Railway or any Node.js host

## Environment Variables

```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@host:5432/skillverse
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_WEBAPP_URL=https://your-app.vercel.app
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

## Future Enhancements

- Additional game types
- Real-time PvP matchmaking
- Tournament system
- Marketplace for cosmetics
- NFT integration for achievements
- Mobile app (React Native)
