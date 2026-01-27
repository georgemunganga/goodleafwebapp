import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/contexts/AuthContext';
import { kycService, notificationService, securityService, userService } from '@/lib/api-service';
import * as Types from '@/lib/api-types';
import { buildCacheKey, writePersistedCache } from '@/lib/persisted-cache';
import { queryKeys } from './query-keys';
import { usePersistentQuery } from './usePersistentQuery';

const getUserCacheKey = (namespace: string, userId?: string | null) => {
  if (!userId) return undefined;
  return buildCacheKey(namespace, [userId]);
};

export function useUserProfile() {
  const { user, isAuthenticated } = useAuthContext();
  const storageKey = getUserCacheKey('profile', user?.id);

  return usePersistentQuery({
    queryKey: queryKeys.user.profile(user?.id),
    queryFn: async () => userService.getProfile(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: isAuthenticated,
    storageKey,
    persist: Boolean(storageKey),
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const storageKey = getUserCacheKey('profile', user?.id);

  return useMutation({
    mutationFn: (request: Types.UpdateProfileRequest) => userService.updateProfile(request),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.user.profile(user?.id), response.user);
      if (storageKey) {
        writePersistedCache(storageKey, response.user);
      }
    },
  });
}

export function useNotificationSettings() {
  const { user, isAuthenticated } = useAuthContext();
  const storageKey = getUserCacheKey('notification-settings', user?.id);

  return usePersistentQuery({
    queryKey: queryKeys.notifications.settings(user?.id),
    queryFn: async () => notificationService.getNotificationSettings(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: isAuthenticated,
    storageKey,
    persist: Boolean(storageKey),
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const storageKey = getUserCacheKey('notification-settings', user?.id);

  return useMutation({
    mutationFn: (request: Types.UpdateNotificationSettingsRequest) =>
      notificationService.updateNotificationSettings(request),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.notifications.settings(user?.id), response);
      if (storageKey) {
        writePersistedCache(storageKey, response);
      }
    },
  });
}

export function useSecuritySettings() {
  const { user, isAuthenticated } = useAuthContext();
  const storageKey = getUserCacheKey('security-settings', user?.id);

  return usePersistentQuery({
    queryKey: queryKeys.security.settings(user?.id),
    queryFn: async () => securityService.getSecuritySettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    enabled: isAuthenticated,
    storageKey,
    persist: Boolean(storageKey),
  });
}

export function useActiveSessions() {
  const { user, isAuthenticated } = useAuthContext();
  const storageKey = getUserCacheKey('security-sessions', user?.id);

  return usePersistentQuery({
    queryKey: queryKeys.security.sessions(user?.id),
    queryFn: async () => securityService.getActiveSessions(),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: isAuthenticated,
    storageKey,
    persist: Boolean(storageKey),
  });
}

export function useKycStatus() {
  const { user, isAuthenticated } = useAuthContext();
  const storageKey = getUserCacheKey('kyc-status', user?.id);

  return usePersistentQuery({
    queryKey: queryKeys.kyc.status(user?.id),
    queryFn: async () => kycService.getKYCStatus(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: isAuthenticated,
    storageKey,
    persist: Boolean(storageKey),
  });
}
