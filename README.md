# Global Youth Dialogue (GYD) — Platform Documentation

**A Youth-Led International Dialogue & Debate Community Platform**  
*Founded by debaters of the Qatar International Schools Debate Championship (ISDC7)*

---

## 🌍 Overview

Global Youth Dialogue (الحوار الشبابي الدولي) is a modern, responsive web application connecting youth debaters across multiple countries to explore global affairs, exchange perspectives, conduct structured parliamentary debates, publish academic syntheses, and submit qualitative feedback.

The platform implements **One Platform with Three Access Levels**:
1. **Public Landing Experience**: Brand story (Qatar ISDC7 origin), Mission, Vision, the 5-Stage Dialogue Cycle, 8 Topic Categories, and Members-Only session previews.
2. **Member Portal**: Dedicated authenticated workspace for debaters to access live meetings, unlisted YouTube video recordings, academic summaries, submit qualitative feedback, propose topics, and view the international community roster.
3. **Coordinator Portal**: Restricted founding secretariat workspace for scheduling sessions, vetting membership applications, managing the topic pipeline, composing academic syntheses, and reviewing delegate feedback.

---

## 🎨 Design System & Visual Aesthetics

- **Color Palette**:
  - **Deep Green** (`#0E4D3C`) — Symbolizing growth, intellectual dialogue, and Qatar/Arabian heritage.
  - **Dark Navy** (`#091D2C`) — Delivering an authoritative, academic, international feel.
  - **Academic Gold Accents** (`#B88E3E` / `#E6C875`) — Celebrating championship excellence and scholarship.
  - **Canvas Surface** (`#F7FAF9` & `#FFFFFF`) — Crisp, minimal, distraction-free editorial layout.
- **Typography**:
  - Headings: `Playfair Display` (English) & `Cairo` (Arabic)
  - Body: `Inter`
- **Bilingual & RTL**: Seamless language toggle between **English** (LTR) and **Arabic** (RTL).

---

## 🚀 Key Features Built in Phase 1 (MVP)

### 1. Public Experience
- **Hero Section**: Tagline *"Young minds. Different countries. One conversation."* with Qatar ISDC7 championship badge and CTA buttons.
- **Key Metrics Bar**: Countries represented (14+), youth debaters (60+), bi-weekly dialogues, youth-researched publications.
- **About the Project**: Founding story (Qatar ISDC7 debate experience in Doha), Mission, Vision.
- **5-Step Process**: 01 Select → 02 Prepare → 03 Discuss → 04 Reflect → 05 Document.
- **8 Dedicated Topic Categories**: Global Affairs, Technology & AI, Education, Environment, Economy, Governance & Society, Culture & Identity, Emerging Issues.
- **Privacy First / Members-Only Session Notice**: As requested, session videos, meeting links, and full writings are kept confidential for approved delegates.

### 2. Member Portal
- **Dashboard**: Spotlight on next scheduled session (Session 03: Multilateral Diplomacy & UNSC Reform with live meeting link, timing, and prep materials).
- **Sessions & Archive**: Filter upcoming and completed debates, view format, speakers, and watch private unlisted YouTube recordings.
- **Academic Youth Publication Library**: Scholarly papers with 8 academic sections:
  1. *Introduction*
  2. *Background*
  3. *Core Affirmative Arguments*
  4. *Counterarguments & Rebuttals*
  5. *Evidence & Case Studies*
  6. *Discussion Insights*
  7. *Neutral Conclusion*
  8. *Further Research Questions & Citations*
- **Presentation Feedback**: Qualitative review form evaluating argumentation depth, evidence sufficiency, missing perspectives, and future session suggestions.
- **Topic Proposal & Visual Tracker**: 5-stage progress bar (*Submitted → Under Review → Approved → Scheduled → Completed*).
- **International Community Directory**: Safe delegate profiles (Name, Country, Role, Interests) without exposing private emails.

### 3. Coordinator Workspace (Secretariat)
- **Programme KPI Dashboard**: Active members counter, pending applications counter, topic pipeline counter, published papers counter.
- **Topic Pipeline Management**: Move motions between *Proposed, Under Review, Approved, Scheduled, Completed*, assign speakers and moderators, attach research notes.
- **Session Creation Studio**: Form to schedule debates, link approved topics, assign panelists, and configure private Google Meet / YouTube links.
- **Academic Writing Studio**: Dedicated editor to synthesize completed debates into permanent scholarly publications.
- **Feedback Analysis**: Grouped qualitative feedback reviews from delegates for speaker coaching.
- **Membership Vetting**: 1-click Approve or Decline prospective members, automatically generating user credentials.
- **Founding Team Roster**: Qatar ISDC7 founding coordinators across Programme, Research, International Relations, and Media.

---

## ⚡ Instant Demo Accounts (1-Click Switcher)

When you click **Sign In** on the top navigation bar, you can instantly test both roles using the demo buttons:
1. **🇶🇦 Coordinator Demo (Qatar)**:
   - Name: *Tariq Al-Mansoor*
   - Role: Founding Coordinator
   - Clearance: Full administrative workspace access
2. **🇬🇭 Member / Speaker Demo (Ghana)**:
   - Name: *Kofi Mensah*
   - Role: Speaker & Youth Debater
   - Clearance: Member portal, feedback forms, topic proposals

---

## 💻 Running the Platform Locally

The platform is built with modern zero-dependency HTML5, Vanilla CSS, and modular ES6 JavaScript.

To run the local preview:
```bash
python -m http.server 8080
```
Then open your browser at:
```
http://localhost:8080
```
