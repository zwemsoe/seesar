import { Text, View } from "react-native";
import { AwesomeSliderProps, Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";
import TrackPlayer, { useProgress } from "react-native-track-player";
import { useColorScheme } from "~/hooks/useColorScheme";

export const formatSecondsToMinutes = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

export const TrackProgress = (props: Pick<AwesomeSliderProps, "disable">) => {
  const { duration, position } = useProgress(250);
  const { colorScheme } = useColorScheme();

  const isSliding = useSharedValue(false);
  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  const trackElapsedTime = formatSecondsToMinutes(position);
  const trackRemainingTime = formatSecondsToMinutes(duration - position);

  if (!isSliding.value) {
    progress.value = duration > 0 ? position / duration : 0;
  }

  const disableTheme = {
    minimumTrackTintColor: "#D3D3D3",
    maximumTrackTintColor: "#D3D3D3",
  };

  return (
    <>
      <Slider
        {...props}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        containerStyle={{
          height: 7,
          borderRadius: 16,
        }}
        thumbWidth={0}
        renderBubble={() => null}
        theme={
          props.disable
            ? disableTheme
            : {
                minimumTrackTintColor:
                  colorScheme === "dark" ? "#D3D3D3" : "#000",
                maximumTrackTintColor:
                  colorScheme === "dark" ? "#808080" : "#D3D3D3",
                disableMinTrackTintColor: "#D3D3D3",
              }
        }
        onSlidingStart={() => (isSliding.value = true)}
        onValueChange={async (value) => {
          await TrackPlayer.seekTo(value * duration);
        }}
        onSlidingComplete={async (value) => {
          if (!isSliding.value) return;

          isSliding.value = false;

          await TrackPlayer.seekTo(value * duration);
        }}
      />

      <View className='flex flex-row justify-between items-baseline mt-4'>
        <Text className='text-primary'>
          {props.disable ? "--:--" : trackElapsedTime}
        </Text>
        <Text className='text-primary'>
          {props.disable ? "--:--" : trackRemainingTime}
        </Text>
      </View>
    </>
  );
};
