![image alt](https://github.com/ryanzone/RoomyAI/blob/main/RoomyAI.png)

# RoomyAI
### *AI-Powered Interior Design Assistant*

**RoomyAI** is a modern web application designed to help users visualize and refine their interior spaces. Built with **Next.js 15**, it features a specialized AI consultant that provides real-time decor advice, color palette suggestions, and space-planning tips.

---

## Features

* **Specialized AI Consultant** – Powered by Llama 3.3 for professional design dialogue.
* **Intelligent Content Filtering** – Custom validation logic to keep conversations focused on design.
* **Glassmorphic UI** – A sleek, modern interface built with Tailwind CSS.
* **Sub-second Responses** – High-speed inference via Groq Cloud.
* **Database Ready** – Supabase integration for secure user sessions and message history.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) (App Router) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **AI Engine** | [Groq](https://groq.com/) (Llama 3.3 70B) |
| **Database** | [Supabase](https://supabase.com/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## Getting Started

### 1. Prerequisites
* Node.js 18+ installed
* A Groq API Key
* A Supabase Project

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```
### 3. Setting up the Project
```
# Clone the repo
git clone [https://github.com/your-username/roomyai.git](https://github.com/your-username/roomyai.git)

# Install dependencies
npm install

# Start development
npm run dev
```
