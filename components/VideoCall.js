// components/VideoCall.js
import { useEffect, useState } from 'react';
import { getMediaStream, createPeerConnection, addMediaTracks, createOffer, createAnswer } from '../utils/webrtc';
import { sendSDPToServer, listenForSDP, sendICECandidateToServer, listenForICECandidates } from '../utils/signaling';
import { Button } from '@mui/material';

const VideoCall = ({ userId, peerId }) => {
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const setupConnection = async () => {
      const stream = await getMediaStream();
      setLocalStream(stream);

      const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
      const connection = createPeerConnection(config);
      setPeerConnection(connection);

      addMediaTracks(connection, stream);

      listenForSDP(connection, userId);
      listenForICECandidates(connection, userId);
    };

    setupConnection();

    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [userId]);

  const handleStartCall = async () => {
    if (peerConnection) {
      const offer = await createOffer(peerConnection);
      sendSDPToServer(offer, userId, peerId);
    }
  };

  const handleEndCall = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
  };

  return (
    <div>
      <video id="localVideo" autoPlay muted srcObject={localStream} />
      <video id="remoteVideo" autoPlay />
      <Button onClick={handleStartCall}>Start Call</Button>
      <Button onClick={handleEndCall}>End Call</Button>
    </div>
  );
};

export default VideoCall;
