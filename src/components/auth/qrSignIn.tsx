import { QueryClientContextProvider } from '$constants/queryClient'
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
      const deviceId = crypto.randomUUID()
      const url = `${location.origin}/auth/mobile?deviceId=${deviceId}`
      console.log(url)
      return { url, deviceId }
    },
  })
  const deviceId = data?.deviceId
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!deviceId) return
    const interval = setInterval(async () => {
      const response = await fetch(`/api/deviceAuthorizations/${deviceId}`)
      if (!response.ok) {
        console.error('Unable to get device authorization', response.statusText)
        return
      }
      const result = await response.json()
      if (result.found) {
        console.log('Device authorized.')
        clearInterval(interval)
        inputRef.current!.value = result.signature + '|' + deviceId
        formRef.current!.submit()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [deviceId])
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
