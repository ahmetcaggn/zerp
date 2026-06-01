import { Container } from '@mui/material'

import { responsivePageSx } from '@/core/theme/layout'

export default function PublicDashboardLayout({ children }: { children: React.ReactNode }) {
  return <Container sx={responsivePageSx.protectedContainer}>{children}</Container>
}
