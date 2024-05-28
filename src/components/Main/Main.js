import React, { useRef, useState, useEffect } from 'react';
import socket from '../../socket';
import './Main.css';

const Main = (props) => {
  const roomRef = useRef();
  const userRef = useRef();
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    socket.on('FE-error-user-exist', ({ error }) => {
      if (!error) {
        const roomName = roomRef.current.value;
        const userName = userRef.current.value;

        sessionStorage.setItem('user', userName);
        props.history.push(`/room/${roomName}`);
      } else {
        setErr(error);
        setErrMsg('User name already exist');
      }
    });
  }, [props.history]);

  function clickJoin() {
    const roomName = roomRef.current.value;
    const userName = userRef.current.value;

    if (roomName && userName) {
      socket.emit('BE-check-user', { roomId: roomName, userName });
    }
  }

  return (
    <div className="main-container">
      <div className="row">
        <label className="label" htmlFor="roomName">Nombre de la sala</label>
        <input className="input" type="text" id="roomName" ref={roomRef} />
      </div>
      <div className="row">
        <label className="label" htmlFor="userName">Usuario</label>
        <input className="input" type="text" id="userName" ref={userRef} />
      </div>
      <button className="join-button" onClick={clickJoin}> Entrar </button>
      {err ? <div className="error">{errMsg}</div> : null}
    </div>
  );
};

export default Main;
