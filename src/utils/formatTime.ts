export function formatTime(time: number) {
    const hours = Math.floor(time / 60);
    const mins = time % 60;
    const hourString = hours > 0 ? `${hours}h `: "";
    const minString = `${mins}m`;

    return hourString + minString;
};