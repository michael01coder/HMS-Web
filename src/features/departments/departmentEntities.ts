import { Cfg } from '../../components/crud/types';
import { HR_ONLY, HR_OWNER } from '../../config/roles';
import { R, bool, hiddenHotel, num, ref, t } from '../shared/entityKit';

export const departmentEntities: Record<string, Cfg> = {
  departments: { title: 'Departments', sub: 'Teams at your property. Owners and HR can manage them.', path: '/departments', idKey: 'departmentId', write: HR_OWNER, cols: [hiddenHotel, t('departmentName', 'Name', { req: true, max: 100 }), t('departmentCode', 'Code', { req: true, max: 20 }), num('budgetedHeadcount', 'Budgeted headcount', { min: 0, def: 0 }), bool('isActive', 'Status')] },
  designations: { title: 'Designations', sub: 'Predefined job titles HR picks from when completing a staff profile.', path: '/designations', idKey: 'designationId', write: HR_ONLY, cols: [hiddenHotel, t('designationName', 'Designation', { req: true, max: 100 }), ref('departmentId', 'Department', R.departments, { req: false, hint: 'Leave empty to make it available to every department' }), bool('isActive', 'Status')] },
};
