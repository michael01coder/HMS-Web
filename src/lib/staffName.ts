import { EMPTY_GUID } from '../config/constants';
import { Staff } from '../types';
/** Never shows raw ids: empty or unknown ids become readable labels. */
export function staffName(list: Staff[] | undefined, id?: string | null, fallback = 'Unknown staff') {
  if (!id || id === EMPTY_GUID) return 'Not assigned';
  const s = list?.find(x => x.staffId === id);
  return s ? `${s.firstName} ${s.lastName}` : fallback;
}
