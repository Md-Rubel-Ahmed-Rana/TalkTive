import addNewFileToState from "@/utils/addNewFileToState";
import validateFileSize from "@/utils/validateFileSize";
import React, { useState, useRef } from "react";
import MicIcon from "@mui/icons-material/Mic";
import { Modal, Box, Typography } from "@mui/material";

type Props = {
  setFiles: (values: any) => void;
};

const AudioRecorder = ({ setFiles }: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      setElapsedTime(0); // Reset elapsed time when starting recording

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });

        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);

        if (intervalRef.current) {
          clearInterval(intervalRef.current); // Clear interval when stopping recording
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);

      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);

      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Stop updating elapsed time when paused
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const saveRecording = () => {
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const fileName = `recording_${Date.now()}.wav`;
      const newFile = new File([audioBlob], fileName, { type: "audio/wav" });

      const result = validateFileSize(newFile);
      if (result) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(newFile);
        const newFileList = dataTransfer.files;
        setFiles((prev: any) => addNewFileToState(prev, newFileList));
        audioChunksRef.current = [];
        setIsModalOpen(false);
        setAudioUrl(null);
        setIsRecording(false);
        setIsPaused(false);
      }
    }
  };

  const restartRecording = () => {
    setAudioUrl(null);
    startRecording();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (isRecording) {
      stopRecording();
    }
    setAudioUrl(null);
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={openModal}
          className="focus:outline-none"
          aria-label="Open Recorder"
        >
          <MicIcon className="text-lg lg:text-2xl text-blue-500" />
        </button>
      </div>
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            width: 400,
            maxWidth: "90vw",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" align="center" gutterBottom>
            Voice Recorder
          </Typography>
          <div className="flex flex-col items-center">
            {!audioUrl && !isRecording && !isPaused && (
              <button
                type="button"
                onClick={startRecording}
                className="bg-green-500 hover:bg-green-600 text-white p-10 text-2xl rounded-full my-20"
              >
                Start
              </button>
            )}
            {isRecording && !isPaused && (
              <div className="flex flex-col items-center gap-3">
                <div className="animate-pulse h-24 w-24 bg-red-500 rounded-full flex justify-center items-center">
                  <span className="text-white text-2xl">
                    {formatTime(elapsedTime)}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={pauseRecording}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Pause
                  </button>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Stop
                  </button>
                </div>
              </div>
            )}
            {isPaused && (
              <div className="flex flex-col items-center gap-3">
                <div className="h-24 w-24 bg-yellow-500 rounded-full flex justify-center items-center">
                  <span className="text-white text-2xl">
                    {formatTime(elapsedTime)}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={resumeRecording}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Resume
                  </button>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Stop
                  </button>
                </div>
              </div>
            )}
            {audioUrl && (
              <div className="flex flex-col items-center">
                <audio controls src={audioUrl} className="mt-4" />
                <div className="flex space-x-4 mt-4">
                  <button
                    type="button"
                    onClick={saveRecording}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={restartRecording}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Start Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AudioRecorder;
