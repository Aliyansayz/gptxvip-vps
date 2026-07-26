# Voice Agents: Low-Latency Conversational AI

Voice agents require specialized pipelines to handle interruptions, emotional tone, and ultra-low latency text-to-speech.

## 1. Interruption Handling (Barge-in)
When a user interrupts, the agent must instantly halt audio playback, process the new audio stream, and adjust its context without losing the thread.
- **Visual Component:** An audio waveform visual that suddenly clips and restarts when a user microphone icon lights up, indicating a successful "barge-in".

### Voice Pipeline State (JSON)
```json
{
  "agent_id": "voice_assistant_1",
  "state": "SPEAKING",
  "event": "USER_INTERRUPTION_DETECTED",
  "action": "HALT_TTS_PLAYBACK",
  "new_context": "User changed mind about hotel booking."
}
```

## 2. Emotion and Prosody
The agent analyzes the user's vocal tone (e.g., frustration) and adjusts its own TTS output parameters to sound more empathetic and apologetic.
- **Visual Component:** A spectrogram overlay where angry red frequencies from the user trigger the agent's output waveform to smooth out into calming blue patterns.
