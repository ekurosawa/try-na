// utils/webrtc.js
export const getMediaStream = async () => {
    try {
      return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch (err) {
      console.error("Error getting media stream:", err);
      throw err;
    }
  };
  
  export const createPeerConnection = (config) => {
    return new RTCPeerConnection(config);
  };
  
  export const addMediaTracks = (peerConnection, stream) => {
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  };
  
  export const createOffer = async (peerConnection) => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
  };
  
  export const createAnswer = async (peerConnection) => {
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
  };
  