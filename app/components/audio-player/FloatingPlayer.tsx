import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Link2, Pause, Play } from "~/lib/icons";
import { Colors } from "~/lib/constants";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Text } from "../ui/text";
import TrackPlayer, {
  useIsPlaying,
  useProgress,
} from "react-native-track-player";
import { useRouter } from "expo-router";
import { useCurrentReaderStore } from "~/state/store";
import { getTrackUrl } from "~/lib/track-player";
import { cn, formatSecondsToMinutes, truncateString } from "~/lib/utils";

export const FloatingPlayer = () => {
  const router = useRouter();
  const language = useCurrentReaderStore((state) => state.language);
  const setUrl = useCurrentReaderStore((state) => state.setUrl);
  const { colorScheme } = useColorScheme();
  const { playing } = useIsPlaying();
  const activeTrack = useCurrentReaderStore((state) => state.activeTrack);
  const { position } = useProgress(250);
  const trackElapsedTime = formatSecondsToMinutes(position);

  async function togglePlayback() {
    if (playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  }

  return (
    <TouchableOpacity
      onPress={() => {
        setUrl(getTrackUrl(activeTrack?.id));
        router.navigate("/reader");
      }}
      className={cn(
        "w-11/12 absolute left-5 bottom-4 p-4 rounded-lg flex-row items-center justify-between shadow-sm",
        {
          "bg-emerald-200": colorScheme === "light",
          "bg-emerald-600": colorScheme === "dark",
        }
      )}
    >
      <View className='flex-row items-center gap-4'>
        <View className='p-2 bg-primary rounded-lg w-12 h-12 items-center justify-center'>
          <Link2 size={18} color={Colors[colorScheme ?? "light"].background} />
        </View>
        <View className='flex-col'>
          <Text className='font-semibold text-md'>
            {truncateString(activeTrack?.title ?? "", 20)}
          </Text>
          <Text className='text-gray-800 text-sm'>{trackElapsedTime}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={togglePlayback} className='p-2 pr-4'>
        {playing ? (
          <Pause
            size={20}
            fill={Colors[colorScheme ?? "light"].icon}
            color={Colors[colorScheme ?? "light"].icon}
          />
        ) : (
          <Play
            size={20}
            fill={Colors[colorScheme ?? "light"].icon}
            color={Colors[colorScheme ?? "light"].icon}
          />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
