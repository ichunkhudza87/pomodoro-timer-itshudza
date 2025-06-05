// List of sound files
const sounds = {
  bell: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  digital: 'https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3',
  analog: 'https://assets.mixkit.co/active_storage/sfx/2871/2871-preview.mp3',
  calm: 'https://assets.mixkit.co/active_storage/sfx/2872/2872-preview.mp3',
  soft: 'https://assets.mixkit.co/active_storage/sfx/2873/2873-preview.mp3',
  clock: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3'
};

// Audio context instance
let audioContext: AudioContext | null = null;

// Initialize audio context on first user interaction
export const initAudio = async () => {
  if (audioContext === null) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  
  // Resume context if it was suspended (browsers require user interaction first)
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  
  return audioContext;
};

// Cache for loaded audio buffers
const audioCache: Record<string, AudioBuffer> = {};

// Load audio file and cache it
const loadAudio = async (soundId: string): Promise<AudioBuffer> => {
  if (audioCache[soundId]) {
    return audioCache[soundId];
  }
  
  // Skip if sound doesn't exist or is set to 'none'
  if (soundId === 'none' || !sounds[soundId as keyof typeof sounds]) {
    throw new Error('Sound not available');
  }
  
  try {
    const context = await initAudio();
    const response = await fetch(sounds[soundId as keyof typeof sounds]);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
      context.decodeAudioData(arrayBuffer, resolve, reject);
    });
    
    audioCache[soundId] = audioBuffer;
    return audioBuffer;
  } catch (error) {
    console.error('Failed to load audio:', error);
    throw error;
  }
};

// Play a sound
export const playSound = async (soundId: string, volume = 1): Promise<void> => {
  if (soundId === 'none') return;
  
  try {
    const context = await initAudio();
    const buffer = await loadAudio(soundId);
    
    const source = context.createBufferSource();
    source.buffer = buffer;
    
    // Create gain node for volume control
    const gainNode = context.createGain();
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(context.destination);
    
    source.start(0);
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
};

// Play ticking sound with loop
let tickingSource: AudioBufferSourceNode | null = null;
let tickingGain: GainNode | null = null;

export const startTickingSound = async (soundId: string, volume = 0.3): Promise<void> => {
  if (soundId === 'none') return;
  
  // Stop any existing ticking sound
  stopTickingSound();
  
  try {
    const context = await initAudio();
    const buffer = await loadAudio(soundId);
    
    tickingSource = context.createBufferSource();
    tickingSource.buffer = buffer;
    tickingSource.loop = true;
    
    // Create gain node for volume control
    tickingGain = context.createGain();
    tickingGain.gain.value = volume;
    
    tickingSource.connect(tickingGain);
    tickingGain.connect(context.destination);
    
    tickingSource.start(0);
  } catch (error) {
    console.error('Failed to start ticking sound:', error);
  }
};

export const stopTickingSound = (): void => {
  if (tickingSource) {
    try {
      tickingSource.stop();
    } catch (e) {
      // Ignore errors when stopping
    }
    tickingSource = null;
  }
};

export const setTickingVolume = (volume: number): void => {
  if (tickingGain) {
    tickingGain.gain.value = volume;
  }
};