export const responsiveLayout = {
  containerPaddingX: { xs: 2, sm: 3, md: 4 },
  pagePaddingY: { xs: 5, sm: 7, md: 8 },
  centeredPagePaddingY: { xs: 7, sm: 9, md: 10 },
  protectedPagePaddingY: { xs: 3, sm: 4 },
  sectionGap: { xs: 2, sm: 3 },
  cardPadding: { xs: 1.5, sm: 2 },
  toolbarPaddingX: { xs: 1.5, sm: 2.5 },
  toolbarMinHeight: { xs: 60, sm: 68 },
  drawerWidth: 280,
} as const

export const responsivePageSx = {
  homeContainer: {
    px: responsiveLayout.containerPaddingX,
    py: responsiveLayout.pagePaddingY,
  },
  protectedContainer: {
    px: responsiveLayout.containerPaddingX,
    py: responsiveLayout.protectedPagePaddingY,
  },
  centeredContainer: {
    px: responsiveLayout.containerPaddingX,
    py: responsiveLayout.centeredPagePaddingY,
  },
} as const
