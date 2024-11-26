// components/CallButton.js
const CallButton = ({ onStartCall, onEndCall }) => {
    return (
      <div>
        <button onClick={onStartCall}>Start Call</button>
        <button onClick={onEndCall}>End Call</button>
      </div>
    );
  };
  
  export default CallButton;
  