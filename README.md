# 📐 Inverse Function Calculator & Completing the Square Solver

> A modern, responsive, multilingual step-by-step Inverse Function Calculator with dedicated completing-the-square breakdowns, reflection graphing across $y = x$, and domain/range verification. Tailored for High School Algebra 2, Precalculus, and AP Precalculus students worldwide.

> 🌐 **Live Website**: [https://inverse-function-calculator.formulacalckit.com](https://inverse-function-calculator.formulacalckit.com)

![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38b2ac.svg)

---

## ✨ Features

- **The 4-Step Master Method**: Clear algebraic derivations following standard US curriculum guidelines:
  1. Replace $f(x)$ with $y$
  2. Swap $x$ and $y$ (The Core Inversion)
  3. Solve for $y$ using algebra / completing the square / cross-multiplication
  4. Write formal $f^{-1}(x)$ notation and state restricted domain & range
- **Completing the Square Deep-Dive**:
  - Interactive step-by-step breakdown with geometric area models ($y^2 + 2dy + d^2$)
  - Automatic $(b/2a)^2$ magic term derivation
  - Parabola branch selection ($+$ root for $x \ge h$, $-$ root for $x \le h$)
- **Interactive Reflection Coordinate Plane**:
  - Plots $f(x)$ (Blue), mirror line $y = x$ (Dashed Amber), and $f^{-1}(x)$ (Emerald)
  - Interactive probe demonstrating coordinate reflection $(a, b) \leftrightarrow (b, a)$
- **Side-by-Side Values Table**:
  - Generates 7 symmetric test points proving $f^{-1}(f(x)) = x$
- **Point Evaluator $f^{-1}(c)$**:
  - Instantly evaluates numerical targets with strict domain validity checks
- **Monotonicity & Horizontal Line Test (HLT)**:
  - First derivative $f'(x)$ and critical points analysis
- **Worked Examples Library**:
  - 12+ pre-solved classic exam problems across quadratics, rational fractions, radicals, exponentials, and cubics
- **Self-Testing Practice Quiz**:
  - Interactive quiz with instant feedback, scoring, and teachers' hints
- **5-Language Internationalization**:
  - 🇺🇸 English (Default)
  - 🇪🇸 Español
  - 🇫🇷 Français
  - 🇧🇷 Português
  - 🇨🇳 中文 (简体)
- **Classroom Worksheet Printing**:
  - Clean one-click printable format for homework assignments and study guides
- **Website Embed Widget**:
  - Copy responsive `<iframe>` embed codes for educational blogs and Canvas LMS
- **AI Math Tutor Integration**:
  - Powered by Gemini 2.5 Flash for conversational math tutoring

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Math Rendering**: KaTeX
- **Backend / Proxy**: Express, Node.js (`server.ts`)
- **AI Integration**: `@google/genai` (Gemini 2.5 Flash)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/laohu90/inverse-function-calculator.git

# Enter project directory
cd inverse-function-calculator

# Install dependencies
npm install
```

### Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your `GEMINI_API_KEY` in `.env` if using the AI Tutor feature.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📄 License

Apache-2.0
