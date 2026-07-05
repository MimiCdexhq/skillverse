# 🔗 SkillVerse API

## Authentication

POST /auth/login

Creates or logs in a Warrior using Telegram.

---

## Warrior

GET /warrior/profile

Returns Warrior information.

GET /warrior/stats

Returns Warrior statistics.

---

## Match

POST /match/create

Create a new match.

POST /match/result

Submit match results.

GET /match/history

Returns previous matches.

---

## Leaderboards

GET /leaderboard/skillscore

GET /leaderboard/mim

GET /leaderboard/games

GET /leaderboard/streak

---

## Economy

GET /wallet

Returns MIM and vUSDT balances.

POST /reward

Grants rewards after matches.
