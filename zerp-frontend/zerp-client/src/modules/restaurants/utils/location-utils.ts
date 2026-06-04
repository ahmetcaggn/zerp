const DEFAULT_LOCATION_TIMEOUT_MS = 8_000
const DEFAULT_DESIRED_ACCURACY_METERS = 60
const DEFAULT_CACHED_POSITION_MAX_AGE_MS = 30_000

export interface BestUserPositionOptions {
  timeoutMs?: number
  desiredAccuracyMeters?: number
}

function requestCurrentPosition(timeoutMs: number): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: timeoutMs,
      maximumAge: DEFAULT_CACHED_POSITION_MAX_AGE_MS,
    })
  })
}

function watchForBetterPosition(
  initialPosition: GeolocationPosition,
  timeoutMs: number,
  desiredAccuracyMeters: number,
): Promise<GeolocationPosition> {
  return new Promise((resolve) => {
    let bestPosition = initialPosition
    let settled = false
    let watchId: number | null = null

    const cleanup = () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
      window.clearTimeout(timeoutId)
    }

    const finish = (position: GeolocationPosition) => {
      if (settled) {
        return
      }
      settled = true
      cleanup()
      resolve(position)
    }

    const timeoutId = window.setTimeout(() => {
      finish(bestPosition)
    }, timeoutMs)

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (position.coords.accuracy < bestPosition.coords.accuracy) {
          bestPosition = position
        }

        if (position.coords.accuracy <= desiredAccuracyMeters) {
          finish(position)
        }
      },
      () => {
        finish(bestPosition)
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: DEFAULT_CACHED_POSITION_MAX_AGE_MS,
      },
    )
  })
}

export function getBestUserPosition(options: BestUserPositionOptions = {}): Promise<GeolocationPosition> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_LOCATION_TIMEOUT_MS
  const desiredAccuracyMeters = options.desiredAccuracyMeters ?? DEFAULT_DESIRED_ACCURACY_METERS

  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Geolocation is only available in the browser'))
  }

  if (window.isSecureContext === false) {
    return Promise.reject(new Error('Geolocation requires a secure context'))
  }

  if (!navigator.geolocation) {
    return Promise.reject(new Error('Geolocation is not supported'))
  }

  return requestCurrentPosition(timeoutMs).then((position) => {
    if (position.coords.accuracy <= desiredAccuracyMeters) {
      return position
    }

    return watchForBetterPosition(position, Math.min(timeoutMs, 4_000), desiredAccuracyMeters)
  })
}
