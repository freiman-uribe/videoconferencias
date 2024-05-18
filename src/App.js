import React, { useRef, useEffect, useState } from 'react';
import Peer from 'peerjs';

const App = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const callRef = useRef(null);
  const [peerId, setPeerId] = useState('');
  const [isPeerInitialized, setIsPeerInitialized] = useState(false);

  useEffect(() => {
    const initializePeer = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert('getUserMedia is not supported in this browser.');
          return;
        }

        // Obtener el stream local
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = localStreamRef.current;

        // Crear un nuevo Peer
        peerRef.current = new Peer(undefined, {
          host: 'videoconferencia-freiman.netlify.app', // Deja esto en blanco para que use el mismo host que el sitio web (Netlify)
          port: 9000,
          path: '/myapp',
          secure: true // Cambia a true si estás usando HTTPS
        });

        // Manejar el evento 'open' para obtener el ID del peer y almacenarlo en el estado
        peerRef.current.on('open', (id) => {
          console.log('Peer ID: ', id); // Log para depuración
          setPeerId(id);
          setIsPeerInitialized(true); // Marcar el peer como inicializado
        });

        // Manejar errores de conexión
        peerRef.current.on('error', (err) => {
          console.error('PeerJS error:', err);
        });

        // Escuchar cuando se recibe una llamada
        peerRef.current.on('call', (call) => {
          call.answer(localStreamRef.current);
          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
          });
          callRef.current = call;
        });
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    initializePeer();

    return () => {
      if (callRef.current) {
        callRef.current.close();
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  const callUser = (peerId) => {
    if (isPeerInitialized) {
      const call = peerRef.current.call(peerId, localStreamRef.current);
      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
      });
      callRef.current = call;
    } else {
      console.error('Peer is not initialized yet');
    }
  };

  return (
    <div>
      <h1>Video Conference</h1>
      <div>
        <h2>Your Video</h2>
        <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }}></video>
      </div>
      <div>
        <h2>Remote Video</h2>
        <video ref={remoteVideoRef} autoPlay style={{ width: '300px' }}></video>
      </div>
      <div>
        <p>Your Peer ID: <strong>{peerId || 'Loading...'}</strong></p>
        <input type="text" placeholder="Peer ID" id="peerIdInput" />
        <button onClick={() => callUser(document.getElementById('peerIdInput').value)}>Call</button>
      </div>
    </div>
  );
};

export default App;
