import { useRouter } from "next/router";
import { useEffect, useContext, useState, useRef } from "react";
import { SocketContext } from "@/context/SocketContext";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
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
import { useGetSingleUserInfoQuery } from "@/features/user";

const P2PAudioCallRoom = () => {
  const { socket } = useContext(SocketContext);
  const router = useRouter();

  // Fetch sender and receiver data
  const senderId = router.query?.sender as string;
  const { data: senderData } = useGetSingleUserInfoQuery(senderId);
  const sender = senderData?.data as IGetUser;

  const receiverId = router.query?.receiver as string;
  const { data: receiverData } = useGetSingleUserInfoQuery(receiverId);
  const receiver = receiverData?.data as IGetUser;

  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;

  const callId = router.query?.callId as string;

  // Define streaming states
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // Refs for video elements
  const localVideoRef = useRef<any>(null);
  const remoteVideoRef = useRef<any>(null);

  useEffect(() => {
    if (!callId) return;

    const newPeerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    setPeerConnection(newPeerConnection);

    newPeerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("p2p-audio-ice-candidate", {
          candidate: event.candidate,
          receiver: callId,
        });
      }
    };

    newPeerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setRemoteStream(remoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    socket.on("p2p-audio-ice-candidate", (data: any) => {
      if (data?.candidate) {
        newPeerConnection.addIceCandidate(new RTCIceCandidate(data?.candidate));
      }
    });

    socket.on("offer-p2p-audio-call", async (data: any) => {
      await newPeerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await newPeerConnection.createAnswer();
      await newPeerConnection.setLocalDescription(answer);
      socket.emit("answer-p2p-audio-call", { answer, receiver: callId });
    });

    socket.on("answer-p2p-audio-call", async (data: any) => {
      await newPeerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
    });

    socket.on("end-p2p-audio-call", async (data: any) => {
      toast.success(`${data?.sender?.name} has ended the call!`);
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
            socket.emit("offer-p2p-audio-call", { offer, receiver: callId });
          });
        }
      });

    return () => {
      newPeerConnection.close();
      socket.off("p2p-audio-ice-candidate");
      socket.off("offer-p2p-audio-call");
      socket.off("answer-p2p-audio-call");
      socket.off("end-p2p-audio-call");
    };
  }, [callId, socket, user?.id]);

  const handleEndCall = () => {
    if (peerConnection) {
      peerConnection.close();
    }
    socket.emit("end-p2p-audio-call", {
      sender: { id: user?.id, name: user?.name, image: user?.image },
      receiver: sender?.id === user?.id ? receiver?.id : sender?.id,
    });
    router.back();
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
      console.log({ localStream });
      const videoTrack = localStream.getVideoTracks()[0];
      console.log({ videoTrack });
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoMuted(!videoTrack.enabled);

      // Use a timeout to ensure the DOM has been updated if a re-render is happening
      setTimeout(() => {
        if (localVideoRef.current) {
          if (!videoTrack.enabled) {
            localVideoRef.current.srcObject = null;
            console.log(
              "After make null: srcObject",
              localVideoRef.current.srcObject
            );
          } else {
            localVideoRef.current.srcObject = localStream;
            console.log(
              "After adding localStream: srcObject",
              localVideoRef.current.srcObject
            );
          }
        } else {
          console.log("localVideoRef.current is null");
        }
      }, 0);
    }
  };

  console.log(
    "condition",
    isVideoMuted && localVideoRef?.current?.srcObject === null
  );

  console.log("localVideoRef", localVideoRef);

  console.log({ srcObject: localVideoRef?.current?.srcObject });
  console.log({ localStream });

  return (
    <Box className="bg-gray-100 h-screen" component={"div"}>
      <Box className="flex flex-col items-center justify-center bg-gray-100 h-[90vh] relative">
        <Box className="flex flex-col lg:flex-row justify-start lg:justify-between lg:items-center gap-2 w-full h-[80%] lg:h-full p-2">
          {/* Local Video or User Info */}
          <Box className="lg:flex justify-center items-center w-full h-full border p-2 rounded-md shadow-md">
            {isVideoMuted ? (
              <Box className="flex flex-col items-center gap-4">
                <Avatar
                  src={sender?.image}
                  className="w-24 lg:w-48 h-24 lg:h-48 ring-2"
                />
                <Typography variant="h6" className="text-center">
                  {sender?.name}
                </Typography>
              </Box>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="w-full h-full object-cover rounded-md border-gray-400"
              />
            )}
          </Box>

          {/* Remote Video or User Info */}
          <Box className="lg:flex justify-center items-center w-full h-full border p-2 rounded-md shadow-md">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                className="w-full h-full bg-black object-cover"
              />
            ) : (
              <Box className="flex flex-col items-center gap-4">
                <Avatar
                  src={receiver?.image}
                  className="w-24 lg:w-48 h-24 lg:h-48 ring-2"
                />
                <Typography variant="h6" className="text-center">
                  {receiver?.name}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
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
          className={`${
            isAudioMuted
              ? "bg-gray-600 hover:bg-gray-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isAudioMuted ? <MicOff /> : <Mic />}
        </IconButton>

        <IconButton
          onClick={toggleVideo}
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
  );
};

export default P2PAudioCallRoom;
