import React, { useEffect, useState } from 'react';
import Pitchfinder from 'pitchfinder';

const MicControl = ({ micEnabled }) => {
    const [pitch, setPitch] = useState(null);
    const [volume, setVolume] = useState(0);

    useEffect(() => {
        let audioContext;
        let analyser;
        let micStream;
        let detectPitch;
        
        if (micEnabled) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            detectPitch = Pitchfinder.YIN({ sampleRate: audioContext.sampleRate });
            
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    micStream = stream;
                    const source = audioContext.createMediaStreamSource(stream);
                    analyser = audioContext.createAnalyser();
                    source.connect(analyser);
                    analyser.fftSize = 2048;
                    
                    const bufferLength = analyser.fftSize;
                    const dataArray = new Float32Array(bufferLength);
                    
                    const processAudio = () => {
                        if (!micEnabled) return;
                        analyser.getFloatTimeDomainData(dataArray);
                        
                        const detectedPitch = detectPitch(dataArray);
                        setPitch(detectedPitch ? Math.round(detectedPitch) : 'No pitch detected');
                        
                        const rms = Math.sqrt(dataArray.reduce((sum, val) => sum + val * val, 0) / bufferLength);
                        setVolume((rms * 100).toFixed(2));
                        
                        requestAnimationFrame(processAudio);
                    };
                    processAudio();
                })
                .catch(err => console.error('Microphone access denied:', err));
        }
        
        return () => {
            if (micStream) micStream.getTracks().forEach(track => track.stop());
            if (audioContext) audioContext.close();
        };
    }, [micEnabled]);

    return (
        <div className="mic-control">
            <h2>Tune Mode</h2>
            <p>Pitch: {pitch} Hz</p>
            <p>Volume: {volume} %</p>
        </div>
    );
};

export default MicControl;
