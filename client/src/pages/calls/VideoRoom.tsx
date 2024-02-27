/* eslint-disable react-hooks/exhaustive-deps */
import { IUser } from "@/interfaces/user.interface";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MdCallEnd } from "react-icons/md";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { SocketContext } from "@/context/SocketContext";

type Props = {
  callee: IUser;
  setIsVideoCalling: (value: boolean) => void;
};

const VideoRoom = ({ callee }: Props) => {
  const {
    socket,
    setStream,
    stream,
    setMe,
    setReceivingCall,
    setCaller,
    setName,
    setCallerSignal,
    callEnded,
    setCallEnded,
    userVideo,
    myVideo,
    callAccepted,
    connectionRef,
  }: any = useContext(SocketContext);
  const [audioMuted, setAudioMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket.on("me", (id: string) => {
      setMe(id);
    });

    socket.on("callUser", (data: any) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const toggleAudio = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track: any) => (track.enabled = !track.enabled));
      setAudioMuted(!audioMuted);
    }
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((track: any) => (track.enabled = !track.enabled));
      setCameraOff(!cameraOff);
    }
  };

  const handleCancelCall = () => {
    connectionRef.current.destroy();
    setCallEnded(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded-lg z-50">
        <h3 className="my-2 text-xl font-semibold">Calling {callee?.name}</h3>
        <div>
          {stream && (
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              style={{ width: "300px", borderRadius: "10px" }}
            />
          )}
        </div>
        <div>
          {callAccepted && !callEnded ? (
            <video
              playsInline
              ref={userVideo}
              autoPlay
              style={{ width: "300px" }}
            />
          ) : null}
        </div>
        <div className="flex justify-center mt-10 gap-10">
          <button
            className={`${
              cameraOff ? "bg-gray-400 text-gray-800" : "bg-blue-500 text-white"
            } px-5 py-2 rounded-full text-2xl`}
            onClick={toggleCamera}
          >
            {cameraOff ? <FaVideoSlash /> : <FaVideo />}
          </button>
          <button
            className={`${
              audioMuted
                ? "bg-gray-400 text-gray-800"
                : "bg-blue-500 text-white"
            } px-5 py-2 rounded-full text-2xl`}
            onClick={toggleAudio}
          >
            {audioMuted ? <AiOutlineAudioMuted /> : <AiOutlineAudio />}
          </button>
          <button
            className="bg-red-500 px-5 py-2 rounded-full text-2xl text-white"
            onClick={handleCancelCall}
          >
            <MdCallEnd />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoRoom;
