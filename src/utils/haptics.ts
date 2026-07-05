import * as Haptics from "expo-haptics";

let hapticsEnabled = true;

/**
 * Enable or disable haptics at runtime.
 */
export const setHapticsEnabledRuntime = (enabled: boolean) => {
  hapticsEnabled = enabled;
};

/**
 * Run a haptic call if enabled, ignoring errors.
 */
const safeRun = (fn: () => Promise<void>) => {
  if (!hapticsEnabled) return;
  fn().catch(() => {});
};

/**
 * Light selection haptic.
 */
export const hapticSelection = () => safeRun(() => Haptics.selectionAsync());

/**
 * Gentle impact haptic.
 */
export const hapticLightImpact = () =>
  safeRun(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));

/**
 * Strong impact haptic.
 */
export const hapticHeavyImpact = () =>
  safeRun(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));

/**
 * Medium impact haptic.
 */
export const hapticMediumImpact = () =>
  safeRun(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));

/**
 * Success notification haptic.
 */
export const hapticSuccess = () =>
  safeRun(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));

/**
 * Warning notification haptic.
 */
export const hapticWarning = () =>
  safeRun(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
