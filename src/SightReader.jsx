import React, { useEffect, useRef, useState } from 'react';
import ABCJS from 'abcjs';

const SightReader = ({ selectedFile, tempo, micEnabled }) => {
    const notationRef = useRef(null);
    const [abcContent, setAbcContent] = useState('');
    const [synth, setSynth] = useState(null);
    const [currentNote, setCurrentNote] = useState(null);

    useEffect(() => {
        if (selectedFile) {
            fetch(`/music/${selectedFile}`)
                .then(response => response.text())
                .then(abcString => {
                    setAbcContent(abcString);
                    const visualObj = ABCJS.renderAbc(notationRef.current, abcString, {
                        responsive: 'resize',
                        scale: 1.5,
                        add_classes: true
                    })[0];
                    
                    const synthInstance = new ABCJS.synth.CreateSynth();
                    synthInstance.init({
                        visualObj,
                        audioContext: new (window.AudioContext || window.webkitAudioContext)(),
                        millisecondsPerMeasure: (60000 / tempo) * 4,
                    }).then(() => synthInstance.prime());
                    setSynth(synthInstance);
                });
        }
    }, [selectedFile, tempo]);

    const handlePlay = () => {
        if (synth) {
            synth.start();
            trackNotes();
        }
    };

    const handleStop = () => {
        if (synth) synth.stop();
        setCurrentNote(null);
    };

    const handleRestart = () => {
        handleStop();
        handlePlay();
    };

    const trackNotes = () => {
        if (!synth) return;
        
        synth.addTimingCallbacks((event) => {
            if (event && event.midiPitches) {
                setCurrentNote(event.midiPitches[0].pitch);
                highlightNote(event);
            }
        }, []);
    };

    const highlightNote = (event) => {
        if (!event || !event.elements) return;
        
        document.querySelectorAll('.highlighted-note').forEach(el => {
            el.classList.remove('highlighted-note');
        });
        
        event.elements.forEach(elGroup => {
            elGroup.forEach(el => {
                el.classList.add('highlighted-note');
            });
        });
    };

    return (
        <div>
            <h2>Sheet Music</h2>
            <div ref={notationRef}></div>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleStop}>Stop</button>
            <button onClick={handleRestart}>Restart</button>
            <p>Current Note: {currentNote || '-'}</p>
        </div>
    );
};

export default SightReader;
