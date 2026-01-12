import { useMemo } from 'react';
import * as Types from '@/lib/api-types';

/**
 * Hook to calculate notification badges for high-priority recommendations
 * Returns badge counts for different sections of the app
 */
export function useNotificationBadges(loans: Types.LoanDetails[] = []) {
  return useMemo(() => {
    let dashboardBadge = 0;
    let loansBadge = 0;
    let profileBadge = 0;

    if (!loans || loans.length === 0) {
      return { dashboardBadge, loansBadge, profileBadge, totalNotifications: 0 };
    }

    // Check for high-priority recommendations
    const now = new Date();

    loans.forEach((loan) => {
      // 1. Pending approval
      if (loan.status === 'pending') {
        dashboardBadge++;
        loansBadge++;
      }

      // 2. Rejected applications
      if (loan.status === 'rejected') {
        dashboardBadge++;
        loansBadge++;
      }

      // 3. Defaulted payments
      if (loan.status === 'defaulted') {
        dashboardBadge += 2; // Higher priority
        loansBadge++;
      }

      // 4. Payment due within 3 days
      if (loan.status === 'active' && loan.nextPaymentDate) {
        const nextPaymentTime = new Date(loan.nextPaymentDate).getTime();
        const daysUntilDue = Math.ceil((nextPaymentTime - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue <= 3 && daysUntilDue > 0) {
          dashboardBadge++;
          loansBadge++;
        }
      }

      // 5. Rejected status - needs attention
      if (loan.status === 'rejected') {
        profileBadge++;
      }
    });

    // Cap badges at 9 for UI display
    dashboardBadge = Math.min(dashboardBadge, 9);
    loansBadge = Math.min(loansBadge, 9);
    profileBadge = Math.min(profileBadge, 9);

    const totalNotifications = dashboardBadge + loansBadge + profileBadge;

    return {
      dashboardBadge,
      loansBadge,
      profileBadge,
      totalNotifications,
      hasNotifications: totalNotifications > 0,
    };
  }, [loans]);
}

/**
 * Get human-readable description of notification badge
 */
export function getNotificationDescription(badge: number): string {
  if (badge === 0) return '';
  if (badge === 1) return '1 action needed';
  if (badge <= 3) return `${badge} actions needed`;
  return '3+ actions needed';
}
