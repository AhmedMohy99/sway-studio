import React, { useRef } from '@react';

const VirtualFittingRoom = ({ modelUrl }) => {
  const modelRef = useRef();

  // This function maps your S, M, L, XL buttons to the 3D morphs
  const setSize = (sizeIndex) => {
    const model = modelRef.current;
    // 0 = Small, 0.5 = Medium, 1.0 = Large/XL etc. 
    // This controls the Shape Keys you made in Blender
    model.morphTargetInfluences = [sizeIndex];
  };

  return (
    <div className="fitting-container">
      {/* The 3D Viewer - handles 360 rotation automatically */}
      <model-viewer
        ref={modelRef}
        src={modelUrl}
        alt="Sway Maverick 3D Tee"
        auto-rotate
        camera-controls
        shadow-intensity="1"
        environment-image="neutral"
        style={{ width: '100%', height: '500px', background: '#1a1a1a' }}
      >
        {/* Size Selection UI */}
        <div className="controls" style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center' }}>
          <button onClick={() => setSize(0)}>S</button>
          <button onClick={() => setSize(0.3)}>M</button>
          <button onClick={() => setSize(0.6)}>L</button>
          <button onClick={() => setSize(1)}>XL</button>
        </div>
      </model-viewer>
      
      {/* Add this script to your index.html or Head */}
      <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
    </div>
  );
};

export default VirtualFittingRoom;
