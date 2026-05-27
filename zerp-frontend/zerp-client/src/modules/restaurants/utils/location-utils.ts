const DEFAULT_LOCATION_TIMEOUT_MS = 8_000
const DEFAULT_DESIRED_ACCURACY_METERS = 60

export interface BestUserPositionOptions {
  timeoutMs?: number
  desiredAccuracyMeters?: number
}

export function getBestUserPosition(options: BestUserPositionOptions = {}): Promise<GeolocationPosition> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_LOCATION_TIMEOUT_MS
  const desiredAccuracyMeters = options.desiredAccuracyMeters ?? DEFAULT_DESIRED_ACCURACY_METERS

  if (!navigator.geolocation) {
    return Promise.reject(new Error('Geolocation is not supported'))
  }

  return new Promise((resolve, reject) => {
    let bestPosition: GeolocationPosition | null = null
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
      if (bestPosition) {
        finish(bestPosition)
        return
      }

      if (!settled) {
        settled = true
        cleanup()
        reject(new Error('Location timeout'))
      }
    }, timeoutMs)

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
          bestPosition = position
        }

        if (position.coords.accuracy <= desiredAccuracyMeters) {
          finish(position)
        }
      },
      (error) => {
        if (bestPosition) {
          finish(bestPosition)
          return
        }

        if (!settled) {
          settled = true
          cleanup()
          reject(error)
        }
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 0,
      },
    )
  })
}
