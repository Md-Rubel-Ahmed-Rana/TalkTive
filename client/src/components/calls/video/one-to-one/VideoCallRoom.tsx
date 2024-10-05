import { useRouter } from "next/router";
import { useEffect, useContext, useState, useRef } from "react";
import { SocketContext } from "@/context/SocketContext";
import { Box, IconButton, Typography, Avatar } from "@mui/material";
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
import { EventSender, ISocketEvent } from "@/interfaces/socket.interface";

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
  const [isRemoteCameraOff, setIsRemoteCameraOff] = useState(false);
  const [cameraOffSenderInfo, setCameraOffSenderInfo] =
    useState<EventSender | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

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

    socket.on("video-call-end", (data: ISocketEvent) => {
      toast.success(`${data?.sender?.name} has ended the call!`);
      router.back();
    });

    socket.on("video-turn-off", (data: ISocketEvent) => {
      toast.success(`${data?.sender?.name} has turned off the camera!`);
      setIsRemoteCameraOff(true);
      setCameraOffSenderInfo(data?.sender);
    });

    socket.on("video-turn-on", (data: ISocketEvent) => {
      toast.success(`${data?.sender?.name} has turned on the camera!`);
      setIsRemoteCameraOff(false);
      setCameraOffSenderInfo(null);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        stream.getTracks().forEach((track) => {
          newPeerConnection.addTrack(track, stream);
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
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
      socket.off("video-call-end");
      socket.off("video-turn-off");
      socket.off("video-turn-on");
    };
  }, [callId, router, socket, user?.id, remoteStream]);

  const handleEndCall = () => {
    if (peerConnection) {
      peerConnection.close();
    }
    socket.emit("video-call-end", {
      sender: {
        id: user?.id,
        name: user?.name,
        image: user?.image,
      },
      receiver: sender === user?.id ? receiver : sender,
    });
    router.back();
  };

  const handleToggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioMuted(!audioTrack.enabled);
    }
  };

  const handleToggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      const isVideoCurrentlyEnabled = videoTrack.enabled;

      videoTrack.enabled = !isVideoCurrentlyEnabled;
      setIsVideoMuted(!videoTrack.enabled);

      setTimeout(() => {
        if (localVideoRef.current) {
          if (!videoTrack.enabled) {
            localVideoRef.current.srcObject = null;
          } else {
            localVideoRef.current.srcObject = localStream;
          }
        } else {
          console.log("localVideoRef.current is null");
        }
      }, 0);

      const socketEvent = isVideoCurrentlyEnabled
        ? "video-turn-off"
        : "video-turn-on";

      socket.emit(socketEvent, {
        sender: {
          id: user?.id,
          name: user?.name,
          image: user?.image,
        },
        receiver: sender === user?.id ? receiver : sender,
      });
    }
  };

  return (
    <Box className="flex flex-col items-center bg-gray-100 h-[100vh] relative overflow-hidden">
      <Box className="relative w-full h-full">
        {isRemoteCameraOff ? (
          // Show fallback content when remote camera is off
          <Box className="w-full h-full bg-black flex flex-col justify-center items-center text-white">
            <Avatar
              src={cameraOffSenderInfo?.image}
              alt={cameraOffSenderInfo?.name}
              className="w-24 h-24 mb-4"
            />
            <Typography variant="h6">{cameraOffSenderInfo?.name}</Typography>
          </Box>
        ) : (
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-full bg-black object-cover"
          />
        )}

        <Box className="absolute top-2 right-2 w-32 h-24  border border-gray-400 rounded-md">
          {isVideoMuted ? (
            <Box className="w-full h-full rounded-md flex flex-col justify-center items-center text-white">
              <Avatar
                src={user?.image}
                alt={user?.name}
                className="w-20 h-20"
              />
            </Box>
          ) : (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full h-full object-cover rounded-md "
            />
          )}
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
            className={`${
              isAudioMuted
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isAudioMuted ? <MicOff /> : <Mic />}
          </IconButton>

          <IconButton
            onClick={handleToggleVideo}
            className={`${
              isVideoMuted
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isVideoMuted ? <VideocamOff /> : <Videocam />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoCallRoom;
