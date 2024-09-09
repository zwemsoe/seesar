import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { AudioLines, Pause, Play } from "~/lib/icons";
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
import { isSampleUrl } from "~/assets/samples/data";

export const FloatingPlayer = () => {
  const router = useRouter();
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
          "bg-emerald-300": colorScheme === "light",
          "bg-emerald-600": colorScheme === "dark",
        }
      )}
    >
      <View className='flex-row items-center gap-4'>
        <View className='p-2 bg-secondary rounded-lg w-12 h-12 items-center justify-center'>
          <AudioLines size={18} color={Colors[colorScheme ?? "light"].icon} />
        </View>
        <View className='flex-col'>
          <Text className='font-semibold text-md text-black'>
            {truncateString(activeTrack?.title ?? "", 30)}
          </Text>
          <Text className='text-gray-800 text-sm'>{trackElapsedTime}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={togglePlayback} className='p-2 pr-4'>
        {playing ? (
          <Pause size={20} fill={"black"} color={"black"} />
        ) : (
          <Play size={20} fill={"black"} color={"black"} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
