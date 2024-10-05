import { useRouter } from "next/router";
import { useEffect, useContext, useState } from "react";
import { SocketContext } from "@/context/SocketContext";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import { useGetLoggedInUserQuery } from "@/features/auth";
import { IGetUser } from "@/interfaces/user.interface";
import { CallEnd, MicOff, Mic } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useGetSingleUserInfoQuery } from "@/features/user";

const P2PAudioCallRoom = () => {
  const { socket } = useContext(SocketContext);
  const router = useRouter();

  const senderId = router.query?.sender as string;
  const { data: senderData } = useGetSingleUserInfoQuery(senderId);
  const sender = senderData?.data as IGetUser;

  const receiverId = router.query?.receiver as string;
  const { data: receiverData } = useGetSingleUserInfoQuery(receiverId);
  const receiver = receiverData?.data as IGetUser;

  const { data: userData } = useGetLoggedInUserQuery({});
  const user = userData?.data as IGetUser;
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  useEffect(() => {
    const newPeerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    setPeerConnection(newPeerConnection);

    // Handle ICE candidate events
    newPeerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("p2p-audio-ice-candidate", {
          candidate: event.candidate,
          receiver: receiverId,
        });
      }
    };

    // Listen for remote ICE candidates
    socket.on("p2p-audio-ice-candidate", (data: any) => {
      if (data?.candidate && peerConnection?.signalingState !== "closed") {
        newPeerConnection.addIceCandidate(new RTCIceCandidate(data?.candidate));
      }
    });

    // Handle incoming offer for audio call
    socket.on("offer-p2p-audio-call", async (data: any) => {
      // Ensure the connection is open
      if (newPeerConnection.signalingState === "closed") return;

      // Set the remote description with the offer
      await newPeerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );

      // Create and set the local answer
      const answer = await newPeerConnection.createAnswer();
      await newPeerConnection.setLocalDescription(answer);

      // Emit the answer back to the caller
      socket.emit("answer-p2p-audio-call", { answer, receiver: receiverId });
    });

    // Handle incoming answer to the call
    socket.on("answer-p2p-audio-call", async (data: any) => {
      // Ensure the connection is open
      if (newPeerConnection.signalingState === "closed") return;

      // Set the remote description with the answer
      await newPeerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
    });

    // Handle call end
    socket.on("end-p2p-audio-call", async (data: any) => {
      toast.success(`${data?.sender?.name} has ended the call!`);
      newPeerConnection.close();
    });

    // Request microphone access and create an offer for the sender
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        setLocalStream(stream);

        if (newPeerConnection.signalingState === "closed") {
          throw new Error("Connection already closed, cannot add tracks");
        }

        stream.getTracks().forEach((track) => {
          newPeerConnection.addTrack(track, stream);
        });

        // Only the caller (sender) creates the offer
        if (user?.id === senderId) {
          newPeerConnection.createOffer().then((offer) => {
            newPeerConnection.setLocalDescription(offer);
            socket.emit("offer-p2p-audio-call", {
              offer,
              receiver: receiverId,
            });
          });
        }
      })
      .catch((error) => {
        toast.error("Error accessing microphone: " + error.message);
      });

    return () => {
      if (newPeerConnection.signalingState !== "closed") {
        newPeerConnection.close();
      }
      socket.off("p2p-audio-ice-candidate");
      socket.off("offer-p2p-audio-call");
      socket.off("answer-p2p-audio-call");
      socket.off("end-p2p-audio-call");
    };
  }, [peerConnection?.signalingState, receiverId, senderId, socket, user?.id]);

  const handleEndCall = () => {
    if (peerConnection && peerConnection.signalingState !== "closed") {
      peerConnection.close();
    }
    socket.emit("end-p2p-audio-call", {
      sender: {
        id: user?.id,
        name: user?.name,
        image: user?.image,
      },
      receiver: sender.id === user?.id ? receiver?.id : sender?.id,
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

  return (
    <Box className="bg-gray-100 h-screen" component={"div"}>
      <Box className="flex flex-col items-center justify-center bg-gray-100 h-[90vh] relative">
        {/* Names and Avatars */}
        <Box className="flex flex-col lg:flex-row justify-start lg:justify-between lg:items-center gap-2 w-full h-[80%] lg:h-full p-2">
          <Box className="lg:flex justify-center items-center w-full h-full border p-2 rounded-md shadow-md">
            <Box className="flex flex-col items-center gap-4" component={"div"}>
              <Avatar
                src={sender?.image}
                className="w-24 lg:w-48 h-24 lg:h-48 ring-2"
              />
              <Typography variant="h6" className="text-center">
                {sender?.name}
              </Typography>
            </Box>
          </Box>

          <Box className="lg:flex justify-center items-center w-full h-full border p-2 rounded-md shadow-md">
            <Box className="flex flex-col items-center gap-4" component={"div"}>
              <Avatar
                src={receiver?.image}
                className="w-24 lg:w-48 h-24 lg:h-48 ring-2"
              />
              <Typography variant="h6" className="text-center">
                {receiver?.name}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Action buttons overlay */}
        <Box className="absolute bottom-2 lg:-bottom-12 left-0 right-0 flex justify-center space-x-4">
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
        </Box>
      </Box>
    </Box>
  );
};

export default P2PAudioCallRoom;
