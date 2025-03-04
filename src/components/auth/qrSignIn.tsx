import { QueryClientContextProvider } from '$constants/queryClient'
import { sha256 } from '$functions/sha256'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

export interface QrSignIn {
  state: string
}
export function QrSignIn(props: QrSignIn) {
  return (
    <QueryClientContextProvider>
      <QrSignInView {...props} />
    </QueryClientContextProvider>
  )
}
function QrSignInView(props: QrSignIn) {
  const { data } = useQuery({
    queryKey: ['qrSignIn'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const deviceIdBasis = crypto.randomUUID()
      const deviceId = await sha256(deviceIdBasis)
      const url = `${location.origin}/auth/mobile?deviceId=${deviceId}`
      console.log(url)
      return { url, deviceId, deviceIdBasis }
    },
  })
  const deviceId = data?.deviceId
  const deviceIdBasis = data?.deviceIdBasis
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!deviceIdBasis) return
    const interval = setInterval(async () => {
      const response = await fetch(`/api/deviceAuthorizations/${deviceIdBasis}`)
      if (!response.ok) {
        console.error('Unable to get device authorization', response.statusText)
        return
      }
      const result = await response.json()
      if (result.found) {
        console.log('Device authorized.')
        clearInterval(interval as unknown as NodeJS.Timeout)
        inputRef.current!.value = result.signature + '|' + deviceId
        formRef.current!.submit()
      }
    }, 5000)
    return () => clearInterval(interval as unknown as NodeJS.Timeout)
  }, [deviceIdBasis, deviceId])
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[192px] w-[192px] border border-neutral-300">
        {data ? (
          <img
            src={`/api/qr?value=${encodeURIComponent(data.url)}`}
            className="absolute left-0 top-0 h-full w-full object-cover"
            alt="QR code"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
            (Loading)
          </div>
        )}
        <form
          ref={formRef}
          action="/auth/callback"
          method="GET"
          data-astro-reload
        >
          <input type="hidden" name="state" value={props.state} />
          <input ref={inputRef} type="hidden" name="code" defaultValue="" />
        </form>
      </div>
      <div className="mt-2 text-sm text-neutral-600">
        Your device code: <code>{deviceId ? deviceId.slice(0, 8) : ''}</code>
      </div>
    </div>
  )
}
