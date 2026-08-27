# Sign Bridge AI

## Overview

Sign Bridge AI is an AI-powered accessibility platform designed to bridge the communication gap between deaf or hard-of-hearing individuals and non-signers.

The platform enables real-time two-way communication using sign language recognition, text and speech conversion, text-to-sign video generation, AI-powered language processing, and multilingual support.

It can be used in classrooms, hospitals, workplaces, interviews, customer support centers, and emergency situations where a sign language interpreter may not always be available.

---

## Problem Statement

Communication between sign language users and non-signers can be difficult in everyday situations. Professional sign language interpreters may not always be available, making communication slow, expensive, or inaccessible.

Sign Bridge AI addresses this challenge by providing an AI-powered communication bridge that supports both:

* Sign Language to Text and Speech
* Text to Sign Language

---

## Solution

Sign Bridge AI enables seamless two-way communication between sign language users and non-signers.

### Sign Language to Text and Speech

1. The user performs sign language gestures.
2. The webcam captures the gestures in real time.
3. AI processes and recognizes the signs.
4. The recognized output is converted into meaningful text.
5. AI-powered language processing improves interpretation.
6. The final text can also be converted into speech.

### Text to Sign Language

1. The user enters text into the application.
2. The text is sent to the Sign Avatar Server.
3. The system processes the input.
4. Sign language animations or videos are generated.
5. The user can view the sign language output visually.

---

## Key Features

### Real-Time Sign Language Recognition

* Uses live webcam input to capture sign language gestures.
* Detects and interprets gestures in real time.
* Converts recognized signs into meaningful text.
* Supports faster communication between users.

### Sign-to-Text and Speech Conversion

* Converts recognized sign language into readable text.
* Generates speech output from the interpreted text.
* Helps non-signers understand sign language communication.

### Text-to-Sign Generation

* Converts typed text into sign language output.
* Uses a dedicated Sign Avatar Server.
* Generates expressive sign language animations or videos.
* Supports visual communication for sign language users.

### Two-Way Communication

The platform supports complete bidirectional communication:

* Sign Language to Text
* Sign Language to Speech
* Text to Sign Language

### Multilingual Support

The platform currently supports:

* English
* Tamil

This helps make communication more accessible to users from different language backgrounds.

### Interactive 3D Sign Avatar

* Displays sign language using an interactive avatar system.
* Provides a visual and engaging communication experience.
* Enhances understanding of generated sign language.

### Modern User Interface

* Responsive design.
* Accessible user experience.
* Clean and intuitive interface.
* Optimized for real-time interaction.

---

## Applications

Sign Bridge AI can be useful in:

* Schools and Colleges
* Hospitals and Healthcare Centers
* Workplaces
* Job Interviews
* Customer Support
* Public Service Centers
* Emergency Situations

---

## Technology Stack

### Frontend

* Next.js
* React.js
* Tailwind CSS
* Three.js
* React Three Fiber
* React Three Drei

### AI and Backend

* Google Gemini API
* Python
* Sign Avatar Server
* Webcam and Media APIs
* Text-to-Speech Services

### State Management

* Zustand

### Dataset

* 12GB Sign Avatar Dataset

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/AbhienayaSri9509/signbridge.git

```

### Install Dependencies

```bash
npm install
```

### Start the Frontend

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## Sign Avatar Server Setup

Navigate to the Sign Avatar Server directory:

```bash
cd sign-avatar-server
```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

Run the server:

```bash
python server.py
```

---

## Environment Configuration

Create a file named:

```text
.env.local
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

The Gemini API is used for AI-powered language processing and interpretation.

---

## Usage

### Real-Time Sign Recognition

1. Open the application.
2. Grant webcam permissions.
3. Perform sign language gestures.
4. The AI detects and interprets the signs.
5. View the generated text output.
6. Listen to the speech output when available.

### Text-to-Sign Communication

1. Enter text into the application.
2. Submit the text.
3. The text is processed by the Sign Avatar Server.
4. The system generates sign language output.
5. View the resulting sign animation or video.

### Multilingual Communication

1. Select the preferred language.
2. Choose between English and Tamil.
3. Receive interpreted and generated outputs in the selected language.

---

## Future Enhancements

* Support for additional languages
* Mobile application development
* Offline sign recognition
* Improved gesture recognition accuracy
* Enhanced avatar realism
* Personalized gesture learning
* Real-time conversation history
* Healthcare integration
* Education platform integration

---

## License

This project is licensed under the MIT License.

---

## Conclusion

Sign Bridge AI aims to make communication more inclusive and accessible by using artificial intelligence to connect sign language users and non-signers through real-time, two-way communication.
