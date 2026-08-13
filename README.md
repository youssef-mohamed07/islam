# Sanad (سَنَد) — Production-Ready Islamic Digital Knowledge Platform & OS

> **"كل معرفة لها سند"** — Every piece of knowledge has a source.

**Sanad (سَنَد)** is an Egyptian-founded, Arabic-first digital Islamic encyclopedia and knowledge platform bringing Quran, Qira'at, Tafsir, Hadith, Adhkar, Fiqh, Seerah, Islamic books, scholars, prayer tools, and Islamic learning into one unified, high-performance ecosystem.

---

## 🌟 Key Features

1. **Unified Diacritic-Insensitive Search Engine ("البحث الإسلامي الموحد")**
   - Normalizes Arabic diacritics (`تجريد التشكيل`) and spelling variations (`أ, إ, آ` → `ا`, `ة` → `ه`, `ى` → `ي`).
   - Categorized search results across Quran, Hadith, Tafsir, Books, Adhkar, Fiqh, Seerah, Scholars, and Topics with verified source badges.

2. **Quran & Qira'at Studio**
   - All 114 Surahs with Uthmanic font rendering, Juz, Hizb, Pages, and Ayah navigation.
   - **Tafsir Comparison**: Side-by-side & stacked comparative views for Ibn Kathir, Al-Saadi, and Al-Tabari.
   - **Qira'at & Riwayat Engine**: Architecture supporting Hafs 'an Asim, Warsh 'an Nafi', Qalun 'an Nafi', and Al-Duri.
   - **Sticky Verse-by-Verse Audio Player**: Reciters (Minshawi, Husary, Abdul Basit), playback speed controls, repeat verse, and progress tracking.

3. **Hadith Collections Explorer**
   - 9 Primary Hadith Collections (*Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami' al-Tirmidhi, Sunan al-Nasa'i, Sunan Ibn Majah, Muwatta Malik, Musnad Ahmad*).
   - Sanad narrator chains (إسناد), authenticity badges (`صحيح`, `حسن`), chapter structure, and source verification.

4. **Comparative Fiqh Engine**
   - Neutral, academic comparison matrix across the 4 Sunni Madhhabs (Hanafi, Maliki, Shafi'i, Hanbali) showing rulings, primary Quranic/Sunnah evidence, and source books.

5. **Interactive Seerah & History Timeline**
   - Chronological timeline from Pre-Prophethood through Makkan period, Hijrah, Battles, Conquest of Makkah, and Khilafah Rashidah linked to Quran and Hadith references.

6. **Daily Muslim Tools Suite**
   - Location-aware Prayer Times calculator, interactive Qibla direction finder, Zakat calculator (2.5% threshold against gold Nisab), digital Tasbeeh counter, and Hijri calendar.

7. **Sanad AI Knowledge Assistant ("مساعد سند المعرفي")**
   - Strict RAG retrieval layer that extracts verified source passages and provides mandatory inline footnotes `[1] [2]` and disclaimer (*"ليس مفتياً شرعياً"*).

8. **Admin Verification Dashboard**
   - Source provenance tracking (`DRAFT`, `PENDING_REVIEW`, `VERIFIED`, `REJECTED`), import job verification, and data adapters (`QuranAdapter`, `HadithAdapter`, `TafsirAdapter`).

---

## 📐 Monorepo Architecture

```
islam/
├── apps/
│   ├── web/                     # Next.js 14 Web UI (RTL/LTR, Tailwind CSS, App Router)
│   ├── api/                     # Express REST API Server (PostgreSQL, Redis, RAG)
│   └── admin/                   # Admin Content Verification Dashboard
├── packages/
│   ├── database/                # Prisma ORM Schema, Seeders, Client
│   ├── search/                  # Diacritic-Insensitive Arabic Search Engine
│   ├── shared/                  # Types, Interfaces, i18n Dictionaries, Normalization
│   └── ingestion/               # Data Pipeline Adapters (Quran, Hadith, Tafsir, Audio)
├── docker-compose.yml           # PostgreSQL + Redis setup
├── .env.example                 # Environment variables specification
└── README.md
```

---

## 🎨 Design Tokens & Palette

- **Background**: Warm Ivory (`#FDFBF7`) Light / Deep Emerald Dark Mode (`#0D1412`)
- **Primary Color**: Deep Emerald Green (`#0F382C`)
- **Secondary Color**: Muted Sage (`#2A5C4D`)
- **Accent**: Subtle Warm Gold (`#C5A059`)
- **Typography Stack**:
  - Quranic Text: `'Scheherazade New', 'Amiri Quran'`
  - UI & Headlines: `'Cairo', sans-serif`

---

## 🛠️ Getting Started & Installation

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose (for local Postgres & Redis)

### Step 1: Clone & Install Dependencies
```bash
pnpm install
```

### Step 2: Start Local Infrastructure (PostgreSQL & Redis)
```bash
docker-compose up -d
```

### Step 3: Set Environment Variables
```bash
cp .env.example .env
```

### Step 4: Generate & Push Database Schema
```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### Step 5: Start All Applications in Development Mode
```bash
pnpm dev
```

- **Web App**: http://localhost:3000
- **Admin Portal**: http://localhost:3001
- **API Server**: http://localhost:4000

---

## 🔒 Content Integrity Guarantee

- **No AI Generation of Religious Text**: Quran verses, Hadiths, Tafsir texts, and Fiqh rulings are strictly extracted from verified, licensed public-domain sources.
- **Source Attribution**: Every record carries explicit `SourceReference` metadata (`sourceName`, `authorName`, `license`, `verificationStatus`).
