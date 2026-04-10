import { appConfig } from '@/core/config/app-config'
import { AdminDashboard } from '@/modules/admin/ui/admin-dashboard'
import { ClientDashboard } from '@/modules/client/ui/client-dashboard'
import { TenantDashboard } from '@/modules/tenant/ui/tenant-dashboard'

export default function DashboardPage() {
  if (appConfig.app.variant === 'admin') {
    return <AdminDashboard />
  }

  if (appConfig.app.variant === 'client') {
    return <ClientDashboard />
  }

  return <TenantDashboard />
}
