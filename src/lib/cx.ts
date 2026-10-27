export const cx = (...a: (string | false | undefined | null)[]) => a.filter(Boolean).join(' ');
