import { http } from '../lib/http';
import { Department } from '../types';
export const departmentService = { list: () => http<Department[]>('/departments') };
