/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { useEffect, useContext, useState, useRef } from "react";
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
import toast from "react-hot-toast";
import Peer, { SignalData } from "simple-peer";

const VideoCallRoom = () => {
  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const sender = router.query?.sender as string;
  const receiver = router.query?.receiver as string;
  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [peer, setPeer] = useState<Peer.Instance | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!user?.id || !sender || !receiver) return;

    // 1. Logging to ensure we have the correct user and ids
    console.log("Starting video call: ", { sender, receiver });

    // Get local media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream: MediaStream) => {
        console.log("Local stream obtained", stream);
        setLocalStream(stream);

        // Display local stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // 2. Initialize Peer
        const initiator = user?.id === sender;
        const peer = new Peer({
          initiator,
          stream,
          trickle: false,
        });

        console.log("Peer initialized", { initiator });

        // 3. Emit signaling data to the other peer
        peer.on("signal", (data: SignalData) => {
          console.log("Sending signaling data:", data);
          socket.emit("signal", { data, sender: user?.id, receiver });
        });

        // 4. Handle incoming signaling data from other peer
        socket.on("signal", ({ data }: any) => {
          console.log("Received signaling data:", data);
          peer.signal(data);
        });

        // 5. Handle the incoming remote stream
        peer.on("stream", (remoteStream: MediaStream) => {
          console.log("Remote stream received", remoteStream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        // 6. Handle peer error
        peer.on("error", (err) => {
          console.error("Peer error:", err);
        });

        setPeer(peer);
      })
      .catch(() => {
        toast.error("Error accessing media devices");
      });

    return () => {
      socket.off("signal");
      if (peer) peer.destroy();
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [socket, user?.id]);

  // End the call and notify the server
  const handleEndCall = () => {
    if (peer) peer.destroy();
    socket.emit("video-call-end", {
      sender: { id: user?.id, name: user?.name, image: user?.image },
      receiver: sender === user?.id ? receiver : sender,
    });
    router.back();
  };

  // Toggle microphone
  const handleToggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioMuted(!audioTrack.enabled);
    }
  };

  // Toggle video
  const handleToggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoMuted(!videoTrack.enabled);

      setTimeout(() => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = videoTrack.enabled
            ? localStream
            : null;
        }
      }, 0);
    }
  };

  return (
    <Box className="flex flex-col items-center bg-gray-100 h-[100vh] relative overflow-hidden">
      <Box className="relative w-full h-full">
        <video
          ref={remoteVideoRef}
          autoPlay
          className="w-full h-full bg-black object-cover"
        />
        <Box className="absolute top-2 right-2 w-32 h-24 border border-gray-400 rounded-md">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full h-full object-cover rounded-md"
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
            onClick={handleToggleAudio}
            className={
              isAudioMuted ? "bg-gray-600 text-white" : "bg-blue-600 text-white"
            }
          >
            {isAudioMuted ? <MicOff /> : <Mic />}
          </IconButton>
          <IconButton
            onClick={handleToggleVideo}
            className={
              isVideoMuted ? "bg-gray-600 text-white" : "bg-blue-600 text-white"
            }
          >
            {isVideoMuted ? <VideocamOff /> : <Videocam />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoCallRoom;
