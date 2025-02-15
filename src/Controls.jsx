import React, { useState, useEffect } from 'react';

const Controls = ({ selectedFile, setSelectedFile, tempo, setTempo, micEnabled, setMicEnabled }) => {
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        fetch('/music.json')  // ✅ Ensure `music.json` is inside `public/`
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setFileList(data))
            .catch(err => console.error('Error fetching files:', err));
    }, []);

    return (
        <div className="controls-container">
            <label>Choose a file:</label>
            <select value={selectedFile} onChange={(e) => setSelectedFile(e.target.value)}>
                <option value="">--- Select ABC File ---</option>
                {fileList.map((file, index) => (
                    <option key={index} value={file}>{file}</option>
                ))}
            </select>
            
            <label>Tempo:</label>
            <select value={tempo} onChange={(e) => setTempo(Number(e.target.value))}>
                <option value={30}>30 BPM</option>
                <option value={60}>60 BPM</option>
                <option value={90}>90 BPM</option>
                <option value={120}>120 BPM</option>
            </select>
            
            <label>
                <input 
                    type="checkbox" 
                    checked={micEnabled} 
                    onChange={() => setMicEnabled(prev => !prev)}
                /> Enable Microphone (Tune Mode)
            </label>
        </div>
    );
};

export default Controls;
