import { staffService } from '../services/staffService';
import { staffName } from '../lib/staffName';
import { useLoad } from './useLoad';
import { Staff } from '../types';
/** Staff visible to the current user plus a safe name resolver. */
export function useStaffMap(enabled = true) {
  const q = useLoad(() => (enabled ? staffService.list() : Promise.resolve([] as Staff[])), [enabled]);
  return { list: q.d ?? [], loading: q.l, error: q.e, name: (id?: string | null) => staffName(q.d, id) };
}
