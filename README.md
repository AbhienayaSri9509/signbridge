# 🤟 Sign Bridge AI – Real-Time Sign Language Communication Companion

## 🌟 Overview

**Sign Bridge AI** is an AI-powered accessibility platform designed to bridge the communication gap between deaf or hard-of-hearing individuals and non-signers. Using real-time sign language recognition, speech synthesis, text-to-sign video generation, and multilingual support, the platform enables seamless two-way communication in everyday situations.

Whether in classrooms, hospitals, workplaces, interviews, customer support centers, or emergency services, Sign Bridge AI empowers users to communicate naturally and efficiently without requiring a human interpreter.

---

# ✨ Key Features

## 🎥 Real-Time Sign Language Recognition

* Detects and interprets sign language gestures using AI and live webcam input.
* Converts sign gestures into meaningful text in real time.
* Provides fast and accurate communication support.

## 🔊 Sign-to-Text & Speech Conversion

* Converts recognized sign language into readable text.
* Generates natural speech output using Google Gemini-powered processing.
* Helps non-signers understand sign language instantly.

## 🎬 Text-to-Sign Human Video Generation

* Converts typed text into realistic sign language videos.
* Powered by a dedicated Sign Avatar Server.
* Utilizes a large 12GB sign avatar dataset for expressive and natural sign generation.

## 🔄 Two-Way Communication

Supports complete bidirectional communication:

* Sign Language → Text & Speech
* Text → Sign Language Video

---

# 🌍 Accessibility Features

## 🌐 Multi-Language Support

Supports:

* English
* Tamil

Making communication more inclusive and accessible.

## 🧍 Interactive 3D Sign Avatar

* Displays animated sign language through a realistic avatar system.
* Enhances understanding and engagement.
* Provides a visual communication experience for users.

## 🎨 Modern User Interface

* Responsive and accessible design.
* Clean and intuitive user experience.
* Optimized for real-time interactions.

---

# 🚀 Problem Statement

Communication between sign language users and non-signers often becomes difficult in environments such as:

* Schools and Colleges
* Hospitals
* Public Service Centers
* Job Interviews
* Customer Support
* Emergency Situations

Without interpreters, communication can be:

* Slow
* Expensive
* Inaccessible

Sign Bridge AI eliminates these barriers through AI-powered real-time communication assistance.

---

# 💡 Solution

Sign Bridge AI serves as an intelligent communication bridge:

### Sign Language to Speech

1. User performs sign language gestures.
2. Webcam captures gestures.
3. AI recognizes the signs.
4. Gemini processes and interprets the recognized content.
5. Output is displayed as text.
6. Text is converted into speech.

### Text to Sign Language

1. User enters text.
2. Text is sent to the Sign Avatar Server.
3. The avatar system generates sign language animations.
4. Human-like sign videos are displayed.

This enables seamless communication between:

* Deaf and Hard-of-Hearing Individuals
* Teachers and Students
* Doctors and Patients
* Interviewers and Candidates
* Customer Service Representatives and Customers

---

# 🛠 Technology Stack

## Frontend

* Next.js
* React.js
* Tailwind CSS
* Three.js
* React Three Fiber
* React Three Drei

## AI & Backend

* Google Gemini API
* Python
* Sign Avatar Server
* Webcam / Media APIs
* Text-to-Speech Services

## State Management

* Zustand

## Dataset

* 12GB Sign Avatar Dataset

---

# 🚀 Installation Guide

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/hacker.git

cd hacker
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start Frontend

```bash
npm run dev
```

---

# 🎬 Sign Avatar Server Setup

Navigate to the Sign Avatar Server directory:

```bash
cd sign-avatar-server
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Run the server:

```bash
python server.py
```

---

# 🔑 Configure Gemini API

Create a file named:

```env
.env.local
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

This API powers:

* Sign-to-Text Conversion
* Speech Generation
* AI Interpretation
* Language Processing

---

# 🌐 Launch Application

Open:

```bash
http://localhost:3000
```

---

# 📖 Usage Guide

## 🎥 Real-Time Sign Recognition

1. Open the application.
2. Grant webcam permissions.
3. Perform sign language gestures.
4. AI detects and interprets signs.
5. View text output instantly.
6. Listen to generated speech output.

---

## 🎬 Text-to-Sign Communication

1. Enter text in the input field.
2. Submit the text.
3. Text is processed by the Sign Avatar Server.
4. Avatar generates corresponding sign language output.
5. Users view human-like sign animations.

---

## 🌍 Multilingual Communication

* Select English or Tamil.
* Receive translated and interpreted outputs.
* Improve accessibility across diverse users.

---

# 📈 Future Enhancements

* Additional language support
* Mobile application deployment
* Offline sign recognition
* Enhanced avatar realism
* Gesture personalization
* Real-time conversation history
* Healthcare and education integrations

---

# 🤝 Contributing

We welcome contributions from the community.

### Steps:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Create a Pull Request

---

# 👨‍💻 Team Apple

### Contributors

* Abhienaya Sri (@AbhienayaSri9509)
* Afra (@afra245)
* Sanjay (@Sanjay-2806)

---

# 📜 License

This project is licensed under the MIT License.

---

# ❤️ Made with Love by Team Apple

Empowering communication through Artificial Intelligence and Accessibility Technology.
