import { isAfter, setHours, setMinutes } from "date-fns";

export const useCutOffTimes = () => ({
    // Check if it's currently after 8pm
    isAfterSignUpCutOff: isAfter(new Date(), setHours(setMinutes(new Date(), 0), 20)),
    // Check if it's currently after 10pm
    isAfterConfirmCutOff: isAfter(new Date(), setHours(setMinutes(new Date(), 0), 22)),
})