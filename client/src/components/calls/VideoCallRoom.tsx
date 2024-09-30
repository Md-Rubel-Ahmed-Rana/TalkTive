import { useRouter } from "next/router";
import { useEffect, useContext, useState } from "react";
import { SocketContext } from "@/context/SocketContext";
import { Box, Button, Typography, Paper } from "@mui/material";

const VideoCallRoom = () => {
  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const callId = router.query?.callId;
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!callId) return;

    // Create a new peer connection
    const newPeerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    setPeerConnection(newPeerConnection);

    // Listen for ICE candidates and send them to the server
    newPeerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          receiver: callId,
        });
      }
    };

    // Handle incoming tracks
    newPeerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setRemoteStream(remoteStream);

      const remoteVideo = document.getElementById(
        "remoteVideo"
      ) as HTMLVideoElement;
      if (remoteVideo) {
        remoteVideo.srcObject = remoteStream;
      }
    };

    // Listen for ICE candidates from the server and add them to the peer connection
    socket.on("ice-candidate", (data: any) => {
      if (data?.candidate) {
        newPeerConnection.addIceCandidate(new RTCIceCandidate(data?.candidate));
      }
    });

    // Get user media (camera + microphone)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);

        // Add local tracks to the peer connection
        stream.getTracks().forEach((track) => {
          newPeerConnection.addTrack(track, stream);
        });

        const localVideo = document.getElementById(
          "localVideo"
        ) as HTMLVideoElement;
        if (localVideo) {
          localVideo.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

    return () => {
      // Clean up the peer connection
      newPeerConnection.close();
      socket.off("ice-candidate");
    };
  }, [callId, socket]);

  const handleEndCall = () => {
    if (peerConnection) {
      peerConnection.close(); // Close the peer connection
    }
    router.push("/"); // Navigate back to the home page
  };

  return (
    <Box className="flex flex-col items-center p-4 space-y-4 bg-gray-100 h-screen">
      <Typography variant="h5" className="text-blue-600 font-semibold">
        Video Call Room
      </Typography>
      <Paper
        elevation={3}
        className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-md space-y-4"
      >
        <div className="flex justify-around space-x-4">
          <Box className="flex flex-col items-center space-y-2">
            <Typography variant="subtitle1">Your Video</Typography>
            <video
              id="localVideo"
              autoPlay
              muted
              className="w-72 h-56 bg-black rounded-lg"
            />
          </Box>

          <Box className="flex flex-col items-center space-y-2">
            <Typography variant="subtitle1">Remote Video</Typography>
            <video
              id="remoteVideo"
              autoPlay
              className="w-72 h-56 bg-black rounded-lg"
            />
          </Box>
        </div>
        <Button
          variant="contained"
          color="error"
          className="w-full mt-4 bg-blue-600"
          onClick={handleEndCall}
        >
          End Call
        </Button>
      </Paper>
    </Box>
  );
};

export default VideoCallRoom;
