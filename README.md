# 🚀 RecruiterAI - Quick Setup & Usage Guide

## Installation

1. **No Installation Required!** 
   - This is a web-based application
   - Works in any modern browser
   - Simply open `index.html` in your browser

## File Structure
```
AI Recruiter/
├── index.html          # Main application
├── script.js           # All functionality
├── style.css           # Design & styling
├── setting.json        # Configuration
├── FEATURES.md         # Detailed features guide
└── README.md           # This file
```

## Opening the Application

### Option 1: Direct File Open
1. Navigate to the `AI Recruiter` folder
2. Right-click on `index.html`
3. Select "Open with Browser"

### Option 2: Using VS Code Live Server
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 3: Python Local Server
```bash
cd "c:\Users\jashu\OneDrive\Desktop\AI Recruiter"
python -m http.server 8000
# Then open http://localhost:8000
```

---

## 🎤 PREMIUM VOICE SETUP (Recommended)

### Get ElevenLabs Free API Key:
1. Visit https://elevenlabs.io/sign-up
2. Create free account
3. Go to API Keys section
4. Copy your API key

### Configure in RecruiterAI:
1. Click **⚙️ API Config** (top-right button)
2. Paste your ElevenLabs API Key
3. Click **Save Configuration**
4. ✅ Premium voice enabled!

**Voice Options:**
- **Rachel**: Natural female voice (default)
- **Aria**: Professional tone
- **Jenny**: Friendly approach
- Can be customized in code (line 476 in script.js)

---

## 🎯 How to Use

### Start an Interview:
1. Click **"Start Voice Interview"** button
2. Fill in your details:
   - Full Name
   - Email Address
   - Experience Level
   - Desired Role
   - Programming Language (pick one you know well)
3. Click **"Start Session"**

### During Interview:
- **Listen**: AI recruiter asks questions
- **Respond**: Click 🎤 to record your voice
- **Watch**: Real-time transcription appears
- **Check**: Confidence score shows accuracy
- **Submit**: Answer auto-submits when done

### Voice Controls (Left Panel):
- **Volume Slider**: Adjust speaker volume
- **Rate Slider**: Speed up/slow down AI voice
- **Voice Toggle**: Switch to text-only mode
- **Status Badge**: Shows current mode

### Interview Rounds:
Each round focuses on different skills:
1. **Introduction** (5 min)
2. **Communication** (5 min)
3. **Technical Depth** (10 min)
4. **Problem Solving** (8 min)
5. **Behavioral** (7 min)
6. **HR Round** (5 min)

---

## 📊 After Interview

### View Results:
- Click **View Candidate Dashboard**
- See scores for each round
- View performance graphs
- Check learning roadmap

### Export Your Data:
**Four Export Options:**
1. **Download Transcript** - Save conversation
2. **Download Recording** - Your voice responses
3. **Export Data** - JSON format for analysis
4. **Save to History** - Store for future reference

---

## 🎨 Customization

### Change Voice Pitch:
In `script.js`, line ~356:
```javascript
utterance.pitch = 1.2; // Increase for higher pitch
```

### Change Voice Character:
In `script.js`, line ~476:
```javascript
let voiceCharacterId = 'Rachel'; // Change to Aria, Jenny, etc
```

### Adjust Theme:
Click the 🌙 icon in top-right to toggle Dark/Light mode

---

## 🐛 Common Issues & Solutions

### Issue: "Speech Recognition not supported"
**Solution:**
- Use Chrome, Edge, or Safari (not Firefox)
- Try typing responses instead of voice
- Check browser is up-to-date

### Issue: Microphone not working
**Solution:**
- Click "Allow" when browser asks for microphone
- Check System > Privacy Settings > Microphone
- Restart browser
- Try different browser

### Issue: Premium voice not working
**Solution:**
- Verify ElevenLabs API key is correct
- Check internet connection
- Try removing API key (use standard voice)
- Wait 10 seconds (API may be rate-limited)

### Issue: Can't see transcription
**Solution:**
- Make sure Transcription Display element is visible
- Check browser console for errors (F12)
- Refresh page
- Clear browser cache

---

## 🔐 Privacy & Data

- ✅ All data stored locally in your browser
- ✅ No data sent to servers (except API calls if using premium voice)
- ✅ Export anytime for backup
- ✅ Clear history from browser settings
- ✅ No login required

---

## 📱 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Best experience |
| Edge | ✅ Full | Best experience |
| Safari | ✅ Full | Good support |
| Firefox | ⚠️ Limited | No Web Speech API |
| Mobile | ✅ Good | Responsive design |

---

## 🎓 Interview Tips

1. **Prepare**: Know your programming language well
2. **Speak Clearly**: Enunciate for better transcription
3. **Take Your Time**: Think before responding
4. **Be Honest**: Don't make up projects
5. **Show Passion**: Demonstrate enthusiasm
6. **Ask Questions**: OK to clarify AI recruiter's questions
7. **Calm Down**: It's a practice session!

---

## 📈 Performance Tracking

Check your progress:
- **Dashboard**: View all scores
- **Analytics**: Detailed charts
- **Roadmap**: Weekly improvement plan
- **History**: Track multiple sessions

---

## 🌟 Pro Tips

1. **Use Headphones**: Better audio quality
2. **Set Volume to 75%**: Comfortable listening
3. **Set Rate to 0.9x**: Natural pace (easier to follow)
4. **Practice Multiple Times**: Improve with repetition
5. **Export Transcripts**: Review your responses
6. **Watch the Scores**: Target 8.5+ for strong performance

---

## 📞 Support

For issues or feedback:
- Check FEATURES.md for detailed documentation
- Review browser console (F12) for error messages
- Try clearing cache (Ctrl+Shift+Delete)
- Restart browser
- Update browser to latest version

---

## 📝 Version Info

- **Current Version**: 2.0.0
- **Premium Features**: Enabled ✨
- **Last Update**: 2024
- **Status**: Production Ready

---

## 🎉 Ready to Start?

1. Open `index.html` in browser
2. Configure premium voice (optional)
3. Click "Start Voice Interview"
4. Fill in your profile
5. Begin your mock interview!

**Good luck with your interview! 🚀**

---

*Remember: This is a safe practice environment. Mistakes are learning opportunities. Enjoy the experience!*
