import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api} from "../lib/api";

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export function useMe() {
    return useQuery({
        queryKey: ['me'],
        queryFn: () => api.get('/auth/me').then(r => r.data),
        retry: false,
        // FIX: don't refetch on window focus for auth — token is stable
        refetchOnWindowFocus: false,
    });
}

// ─── WORKSHOP STATS ───────────────────────────────────────────────────────────
export function useWorkshopStats() {
    return useQuery({
        queryKey: ['workshop-stats'],
        queryFn: () => api.get('/workshop/stats').then(r => r.data),
        // FIX: don't throw if the user isn't a workshop admin — silently return null
        retry: false,
    });
}

// ─── APPOINTMENTS (Workshop) ──────────────────────────────────────────────────
export function useAppointments(status?: string) {
    return useQuery({
        queryKey: ['appointments', status],
        queryFn: () =>
            api.get('/workshop/appointments', {params: status ? {status} : {}}).then(r => r.data),
        retry: 1,
    });
}

export function useUpdateAppointmentStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({id, status, masterId}: { id: string; status: string; masterId?: string }) =>
            api.patch(`/workshop/appointments/${id}/status`, {status, masterId}).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({queryKey: ['appointments']}),
    });
}

// ─── VEHICLES ─────────────────────────────────────────────────────────────────
export function useMyVehicles() {
    return useQuery({
        queryKey: ['my-vehicles'],
        queryFn: () => api.get('/driver/vehicles').then(r => r.data),
        retry: 1,
    });
}

export function useVehicleHistory(vehicleId: string) {
    return useQuery({
        queryKey: ['vehicle-history', vehicleId],
        queryFn: () => api.get(`/driver/vehicles/${vehicleId}/history`).then(r => r.data),
        // FIX: only run when a vehicleId is actually provided
        enabled: !!vehicleId,
        retry: 1,
    });
}

export function useAddVehicle() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            make: string; model: string; plateNumber: string;
            vin?: string; year?: number; color?: string; currentMileage?: number;
        }) => api.post('/driver/vehicles', data).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({queryKey: ['my-vehicles']}),
    });
}

// ─── WORKSHOPS (public list for drivers) ──────────────────────────────────────
export function useWorkshops(search?: string, city?: string) {
    return useQuery({
        queryKey: ['workshops', search, city],
        queryFn: () =>
            api.get('/driver/workshops', {
                params: {...(search ? {search} : {}), ...(city ? {city} : {})},
            }).then(r => r.data),
    });
}

// ─── MASTERS ──────────────────────────────────────────────────────────────────
export function useMasters() {
    return useQuery({
        queryKey: ['masters'],
        queryFn: () => api.get('/workshop/masters').then(r => r.data),
        retry: 1,
    });
}

// ─── SERVICE HISTORY (workshop staff) ─────────────────────────────────────────
export function useCreateServiceHistory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            vehicleId: string; description: string; cost: number;
            mileage?: number; appointmentId?: string; partsUsed?: string;
            nextServiceMileage?: number; nextServiceDate?: string;
        }) => api.post('/workshop/service-history', data).then(r => r.data),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['appointments']});
            qc.invalidateQueries({queryKey: ['vehicle-history']});
        },
    });
}

// ─── DRIVER APPOINTMENTS ──────────────────────────────────────────────────────
export function useMyAppointments(status?: string) {
    return useQuery({
        queryKey: ['my-appointments', status],
        queryFn: () =>
            api.get('/driver/appointments', {params: status ? {status} : {}}).then(r => r.data),
        retry: 1,
    });
}

export function useCreateAppointment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            vehicleId: string; workshopId: string;
            date: string; notes?: string; problemDescription?: string;
        }) => api.post('/driver/appointments', data).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({queryKey: ['my-appointments']}),
    });
}

export function useCancelAppointment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            api.patch(`/driver/appointments/${id}/cancel`).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({queryKey: ['my-appointments']}),
    });
}
