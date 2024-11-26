import { Button } from "@chakra-ui/react";

// components/CallButton.js
const CallButton = ({ onStartCall, onEndCall }) => {
    return (
      <div>
        <Button onClick={onStartCall}>Start Call</Button>
        <Button onClick={onEndCall}>End Call</Button>
      </div>
    );
  };
  
  export default CallButton;
  