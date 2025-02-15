import React, { useState } from 'react';
import SightReader from './SightReader.jsx';
import Controls from './Controls.jsx';
import MicControl from './MicControl.jsx';
import './App.css';

function App() {
    const [selectedFile, setSelectedFile] = useState('');
    const [tempo, setTempo] = useState(60);
    const [micEnabled, setMicEnabled] = useState(false);
    
    return (
        <div className="app-container">
            <h1>ABC Sightreader</h1>
            <Controls 
                selectedFile={selectedFile} 
                setSelectedFile={setSelectedFile} 
                tempo={tempo} 
                setTempo={setTempo} 
                micEnabled={micEnabled}
                setMicEnabled={setMicEnabled} 
            />
            <SightReader selectedFile={selectedFile} tempo={tempo} micEnabled={micEnabled} />
            {micEnabled && <MicControl micEnabled={micEnabled} />}
        </div>
    );
}

export default App;
