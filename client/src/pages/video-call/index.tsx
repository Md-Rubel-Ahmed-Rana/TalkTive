/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Peer from "simple-peer";
import Layout from "@/layout";
import { SocketContext } from "@/context/SocketContext";
import { useRouter } from "next/router";
import { useLoggedInUserQuery } from "@/features/user/user.api";
import { IUser } from "@/interfaces/user.interface";

const VideoCall = () => {
  const { socket } = useContext(SocketContext);
  const { data: userData } = useLoggedInUserQuery({});
  const user: IUser = userData?.data;
  const { query } = useRouter();
  const idToCall = query.idToCall; // Remote user id
  const [stream, setStream] = useState<any>(null);
  const [callerSignal, setCallerSignal] = useState<any>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const myVideo = useRef<any>(null);
  const userVideo = useRef<any>(null);
  const connectionRef = useRef<any>(null);

  useEffect(() => {
    // Get user media for video and audio
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log(stream);
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });

    // Event listeners for socket events
    socket.on("callUser", (data: any) => {
      setCallerSignal(data.signal);
    });

    socket.on("callAccepted", () => {
      setCallAccepted(true);
      if (callerSignal) {
        connectionRef.current.signal(callerSignal);
      }
    });

    // Initialize peer connection
    if (idToCall && stream) {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", (data) => {
        socket.emit("callUser", {
          userToCall: idToCall,
          signalData: data,
          from: user, // Assuming user object has an 'id' property
        });
      });

      peer.on("stream", (stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

      peer.on("error", (err) => {
        console.error("Peer connection error:", err);
      });

      connectionRef.current = peer;
    }

    return () => {
      socket.off("callUser");
      socket.off("callAccepted");
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <video playsInline muted ref={myVideo} autoPlay></video>
        </div>
        <div>
          {callAccepted && !callEnded ? (
            <video
              playsInline
              ref={userVideo}
              autoPlay
              style={{ width: "300px" }}
            ></video>
          ) : null}
        </div>
      </div>
    </div>
  );
};

VideoCall.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default VideoCall;
