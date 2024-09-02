import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import TrackPlayer, {
  useProgress,
  Track,
  useIsPlaying,
} from "react-native-track-player";
import { Text } from "~/components/ui/text";
import { Play, Pause, Undo, Redo } from "~/lib/icons";
import { Button } from "../ui/button";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Colors } from "~/lib/constants";
import { Circle } from "react-native-animated-spinkit";
import { TrackProgress } from "./TrackProgress";
import { cn } from "~/lib/utils";
import { useSynthesizeSpeech } from "~/hooks/useSynthesizeSpeech";
import { useCurrentReaderStore } from "~/state/store";

const AudioPlayer = ({
  text = "",
  url,
  textLoading,
  title,
  siteName,
}: {
  text?: string | null;
  url: string;
  textLoading: boolean;
  title: string;
  siteName: string;
}) => {
  const language = useCurrentReaderStore((state) => state.language);
  const setLanguage = useCurrentReaderStore((state) => state.setLanguage);
  const [speed, setSpeed] = useState(1);
  const progress = useProgress();
  const { isLoading: isSynthesizing, fileUri } = useSynthesizeSpeech({
    text: text ?? "",
    url,
  });
  const [isLoading, setIsLoading] = useState(textLoading || isSynthesizing);
  const { colorScheme } = useColorScheme();
  const { playing } = useIsPlaying();

  const addTrack = async () => {
    try {
      await TrackPlayer.reset();
      const track: Track = {
        id: 1,
        url: fileUri,
        title,
        artist: siteName,
      };
      await TrackPlayer.add(track);
    } catch (error) {
      console.error("Error setting up player:", error);
    }
  };

  useEffect(() => {
    setIsLoading(textLoading || isSynthesizing);
    if (!textLoading && !isSynthesizing && fileUri) {
      addTrack();
    }
  }, [textLoading, fileUri, isSynthesizing, language]);

  async function togglePlayback() {
    if (playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
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
    setLanguage(language === "en" ? "mm" : "en");
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
