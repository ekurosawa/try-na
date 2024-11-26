// components/VideoElement.js
const VideoElement = ({ stream, isLocal = false }) => {
    return (
      <video
        autoPlay
        muted={isLocal}
        ref={(videoElement) => {
          if (videoElement && stream) {
            videoElement.srcObject = stream;
          }
        }}
      />
    );
  };
  
  export default VideoElement;
  