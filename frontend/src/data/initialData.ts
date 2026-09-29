import data from './initialData.json';

export const initialData = data;

export const getInitialDataForUrl = <T = any>(url: string): T | null => {
  const cleanUrl = url.replace(/^\/+/, '').split('?')[0];
  if (cleanUrl === 'analytics/dashboard') return initialData.dashboard as unknown as T;
  if (cleanUrl === 'beds') return initialData.beds as unknown as T;
  if (cleanUrl === 'beds/wards') return initialData.wards as unknown as T;
  if (cleanUrl === 'patients') return initialData.patients as unknown as T;
  if (cleanUrl === 'doctors') return initialData.doctors as unknown as T;
  if (cleanUrl === 'inventory') return initialData.inventory as unknown as T;
  if (cleanUrl === 'ambulances') return initialData.ambulances as unknown as T;
  if (cleanUrl === 'appointments') return initialData.appointments as unknown as T;
  if (cleanUrl === 'tasks') return initialData.tasks as unknown as T;
  if (cleanUrl === 'approvals') return initialData.approvals as unknown as T;
  if (cleanUrl === 'network/facilities') return initialData.facilities as unknown as T;
  return null;
};
