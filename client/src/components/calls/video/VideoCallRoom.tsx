import { useRouter } from "next/router";
import { useEffect, useContext, useState } from "react";
import { SocketContext } from "@/context/SocketContext";
import { Box, IconButton } from "@mui/material";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import {
  CallEnd,
  MicOff,
  Mic,
  VideocamOff,
  Videocam,
} from "@mui/icons-material";

const VideoCallRoom = () => {
  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const sender = router.query?.sender as string;
  const receiver = router.query?.receiver as string;
  const callId = router.query?.callId as string;
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  useEffect(() => {
    if (!callId) return;

    const newPeerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    setPeerConnection(newPeerConnection);

    newPeerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          receiver: callId,
        });
      }
    };

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

    socket.on("ice-candidate", (data: any) => {
      if (data?.candidate) {
        newPeerConnection.addIceCandidate(new RTCIceCandidate(data?.candidate));
      }
    });

    socket.on("offer", async (data: any) => {
      await newPeerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await newPeerConnection.createAnswer();
      await newPeerConnection.setLocalDescription(answer);
      socket.emit("answer", { answer, receiver: callId });
    });

    socket.on("answer", async (data: any) => {
      await newPeerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);

        stream.getTracks().forEach((track) => {
          newPeerConnection.addTrack(track, stream);
        });

        const localVideo = document.getElementById(
          "localVideo"
        ) as HTMLVideoElement;
        if (localVideo) {
          localVideo.srcObject = stream;
        }

        if (callId === user?.id) {
          newPeerConnection.createOffer().then((offer) => {
            newPeerConnection.setLocalDescription(offer);
            socket.emit("offer", { offer, receiver: callId });
          });
        }
      });

    return () => {
      newPeerConnection.close();
      socket.off("ice-candidate");
      socket.off("offer");
      socket.off("answer");
    };
  }, [callId, socket, user?.id]);

  const handleEndCall = () => {
    if (peerConnection) {
      peerConnection.close();
    }
    socket.emit("video-call-end", {
      sender: user?.id,
      receiver: sender === user?.id ? receiver : user?.id,
    });
    // router.push("/");
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoMuted(!videoTrack.enabled);
    }
  };

  return (
    <Box className="flex flex-col items-center bg-gray-100 h-[100vh] relative overflow-hidden">
      <div className="relative w-full h-full">
        <video
          id="remoteVideo"
          autoPlay
          className="w-full h-full bg-black object-cover"
        />
        <Box className="absolute top-2 right-2 w-32 h-24 bg-black object-cover rounded-md">
          <video
            id="localVideo"
            autoPlay
            muted
            className="w-full h-full object-cover rounded-md border border-gray-400"
          />
        </Box>

        {/* Action buttons overlay */}
        <Box className="absolute bottom-10 lg:bottom-4 left-0 right-0 flex justify-center space-x-4">
          <IconButton
            onClick={handleEndCall}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <CallEnd />
          </IconButton>

          <IconButton
            onClick={toggleAudio}
            className={` ${
              isAudioMuted
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isAudioMuted ? <MicOff /> : <Mic />}
          </IconButton>

          <IconButton
            onClick={toggleVideo}
            className={` ${
              isVideoMuted
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isVideoMuted ? <VideocamOff /> : <Videocam />}
          </IconButton>
        </Box>
      </div>
    </Box>
  );
};

export default VideoCallRoom;
