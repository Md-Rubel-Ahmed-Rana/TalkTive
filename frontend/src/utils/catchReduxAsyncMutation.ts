/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRouter } from "next/router";
import { toast } from "sonner";

type CustomMessage = {
  error?: string;
  success?: string;
};

const handleAsyncMutation = async <T>(
  reduxMutationFunction: (
    payload: T
  ) => Promise<{ data?: any; error?: any; message?: string }>,
  payload: T,
  successStatusCode: number,
  customMessage: CustomMessage = {
    error: "Failed to complete the operation",
    success: "Operation has been successful!",
  },
  successRedirect?: string,
  router?: NextRouter
): Promise<any> => {
  try {
    const response = await reduxMutationFunction(payload);
    if (response?.data?.statusCode === successStatusCode) {
      toast.success(
        response?.data?.message || response?.message || customMessage?.success
      );
      if (successRedirect) {
        if (router) {
          router.push(successRedirect);
        }
        window.location.replace(successRedirect);
      }
    } else {
      toast.error(
        response?.error?.data?.message ||
          response?.error?.message ||
          response?.data?.error?.message ||
          customMessage?.error
      );
    }
    return response;
  } catch (error: any) {
    toast.error(
      error?.message ||
        error?.error?.data?.message ||
        error?.data?.error?.message ||
        customMessage?.error
    );
  }
};

export default handleAsyncMutation;
