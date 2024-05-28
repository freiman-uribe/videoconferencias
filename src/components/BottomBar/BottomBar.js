import React from 'react';
import './BottomBar.css';

const BottomBar = ({
  goToBack,
  toggleCameraAudio,
  userVideoAudio,
}) => {

  return (
    <div className="bar">
      <div className="left">
        <div className="camera-button" onClick={toggleCameraAudio} data-switch='video'>
          <div>
            {userVideoAudio.video ? (
              <i className='fa-icon fas fa-video'></i>
            ) : (
              <i className='fa-icon fas fa-video-slash'></i>
            )}
          </div>
        </div>
        <div className="camera-button" onClick={toggleCameraAudio} data-switch='audio'>
          <div>
            {userVideoAudio.audio ? (
              <i className='fa-icon fas fa-microphone'></i>
            ) : (
              <i className='fa-icon fas fa-microphone-slash'></i>
            )}
          </div>
        </div>
      </div>
      <div className="center">
      </div>
      <div className="right">
        <div className="stop-button" onClick={goToBack}>Salir</div>
      </div>
    </div>
  );
};

export default BottomBar;
