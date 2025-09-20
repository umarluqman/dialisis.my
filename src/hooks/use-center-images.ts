"use client";

import { ImagesResponse } from "@/types/center-image";
import useSWR from "swr";

const fetcher = async (url: string): Promise<ImagesResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }
  return response.json();
};

export function useCenterImages(centerId: string, enabled: boolean = true) {
  const { data, error, isLoading } = useSWR<ImagesResponse>(
    enabled && centerId ? `/api/centers/${centerId}/images` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    images: data?.images || [],
    isLoading,
    error,
  };
}
