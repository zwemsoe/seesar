import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import TrackPlayer, {
  useProgress,
  usePlaybackState,
  Track,
  useIsPlaying,
} from "react-native-track-player";
import { Text } from "~/components/ui/text";
import { Play, Pause, Undo, Redo } from "~/lib/icons";
import * as FileSystem from "expo-file-system";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Colors } from "~/lib/constants";
import { Circle } from "react-native-animated-spinkit";
import { Separator } from "../ui/separator";
import { TrackProgress } from "./TrackProgress";
import { cn } from "~/lib/utils";

const TEST_AUDIO_URL =
  "https://oxkggefcizudronypngp.supabase.co/storage/v1/object/public/test/audio_1724730288890.mp3";

const AudioPlayer = ({
  text = "",
  textLoading,
  language,
  setLanguage,
}: {
  text?: string | null;
  textLoading: boolean;
  language: "en" | "my";
  setLanguage: (language: "en" | "my") => void;
}) => {
  const insets = useSafeAreaInsets();
  const [speed, setSpeed] = useState(1);
  const progress = useProgress();
  const playbackState = usePlaybackState();
  const [isLoading, setIsLoading] = useState(textLoading);
  const { colorScheme } = useColorScheme();
  const { playing } = useIsPlaying();

  const addTrack = async () => {
    try {
      const track: Track = {
        id: "1",
        url: TEST_AUDIO_URL,
        title: "Synthesized Speech",
        artist: "AI",
      };
      await TrackPlayer.add(track);
    } catch (error) {
      console.error("Error setting up player:", error);
    }
  };

  useEffect(() => {
    setIsLoading(textLoading);
    if (text && !textLoading) {
      addTrack();
    }
  }, [text, textLoading]);

  // useEffect(() => {
  //   synthesizeSpeech();
  // }, [speed]);

  // const synthesizeSpeech = async () => {
  //   console.log("hello");

  //   const subscriptionKey = process.env.EXPO_PUBLIC_SPEECH_API_KEY!;
  //   const region = process.env.EXPO_PUBLIC_SPEECH_REGION!;
  //   const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

  //   try {
  //     const tokenResponse = await fetch(
  //       `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Ocp-Apim-Subscription-Key": subscriptionKey,
  //         },
  //       }
  //     );
  //     const accessToken = await tokenResponse.text();

  //     const response = await fetch(endpoint, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/ssml+xml",
  //         "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
  //       },
  //       body: transformToSSML(text),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const audioData = await response.arrayBuffer();

  //     const fileUri = FileSystem.documentDirectory + "temp_audio.mp3";
  //     await FileSystem.writeAsStringAsync(
  //       fileUri,
  //       arrayBufferToBase64(audioData),
  //       { encoding: FileSystem.EncodingType.Base64 }
  //     );
  //     await TrackPlayer.setupPlayer();

  //     const track: Track = {
  //       id: "1",
  //       url: fileUri,
  //       title: "Synthesized Speech",
  //       artist: "AI",
  //     };
  //     await TrackPlayer.add(track);
  //     //   TrackPlayer.setRate(speed);

  //     setIsLoading(false);

  //     //   await TrackPlayer.play();

  //     //   // Set up a listener for playback state changes
  //     //   TrackPlayer.addEventListener("playback-state", async (state) => {
  //     //     if (state === TrackPlayer.STATE_STOPPED) {
  //     //       setIsPlaying(false);
  //     //       await TrackPlayer.reset(); // Clear the queue when finished
  //     //     }
  //     //   });
  //   } catch (error) {
  //     console.error("Error: ", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  async function togglePlayback() {
    if (playing) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  }

  const skipForward = async () => {
    await TrackPlayer.seekTo(progress.position + 10);
  };

  const skipBackward = async () => {
    await TrackPlayer.seekTo(Math.max(0, progress.position - 10));
  };

  const changeSpeed = () => {
    const speeds = [1, 1.5, 2.0, 0.5];
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
    TrackPlayer.setRate(speeds[nextIndex]);
  };

  const changeLanguage = () => {
    setLanguage(language === "en" ? "my" : "en");
  };

  return (
    <View className='justify-center'>
      <TrackProgress disable={isLoading} />
      <View className='flex-row justify-between items-center px-2'>
        <TouchableOpacity disabled={isLoading} onPress={changeLanguage}>
          <Text
            className={cn(
              "text-primary text-xl tracking-widest leading-loose w-10",
              {
                "pt-1": language === "en",
              }
            )}
          >
            {language === "en" ? "ကခ" : "Aa"}
          </Text>
        </TouchableOpacity>

        <View className='flex-row justify-center items-center gap-4'>
          <Button variant='ghost' disabled={isLoading} onPress={skipBackward}>
            <Undo size={24} color={Colors[colorScheme ?? "light"].icon} />
          </Button>
          {isLoading ? (
            <Circle size={24} color={Colors[colorScheme ?? "light"].icon} />
          ) : (
            <TouchableOpacity
              onPress={togglePlayback}
              className='p-2'
              disabled={isLoading}
            >
              {playing ? (
                <Pause
                  size={32}
                  fill={Colors[colorScheme ?? "light"].icon}
                  color={Colors[colorScheme ?? "light"].icon}
                />
              ) : (
                <Play
                  size={32}
                  fill={Colors[colorScheme ?? "light"].icon}
                  color={Colors[colorScheme ?? "light"].icon}
                />
              )}
            </TouchableOpacity>
          )}
          <Button variant='ghost' disabled={isLoading} onPress={skipForward}>
            <Redo size={24} color={Colors[colorScheme ?? "light"].icon} />
          </Button>
        </View>

        <TouchableOpacity onPress={changeSpeed} disabled={isLoading}>
          <Text className='text-primary w-10 text-center text-xl'>
            {speed}x
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AudioPlayer;
