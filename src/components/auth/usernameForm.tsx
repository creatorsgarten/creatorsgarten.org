import { QueryClientContextProvider } from '$constants/queryClient'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Icon } from 'react-iconify-icon-wrapper'

interface UsernameFormProps {
  initialUsername?: string
  hasGithub: boolean
  formAction: string
}

export function UsernameFormWrapper(props: UsernameFormProps) {
  return (
    <QueryClientContextProvider>
      <UsernameForm {...props} />
    </QueryClientContextProvider>
  )
}

function UsernameForm({
  initialUsername,
  hasGithub,
  formAction,
}: UsernameFormProps) {
  const [username, setUsername] = useState(initialUsername || '')
  const [isChecking, setIsChecking] = useState(false)

  // Check availability with debounce
  const { data: availabilityData, isLoading: isCheckingAvailability } =
    useQuery({
      queryKey: ['username-availability', username],
      queryFn: async () => {
        if (!username || username.length < 3) return null
        setIsChecking(true)
        try {
          const response = await fetch(
            `/api/username/check?username=${encodeURIComponent(username)}`
          )
          const data = await response.json()
          setIsChecking(false)
          return data
        } catch (error) {
          setIsChecking(false)
          return {
            available: false,
            message: 'Error checking username availability',
          }
        }
      },
      enabled: username.length >= 3,
      refetchOnWindowFocus: false,
    })

  const isAvailable = availabilityData?.available
  const availabilityMessage = availabilityData?.message

  const previewUrl = username ? `People/${username}` : 'People/username'

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Username Reservation</h2>

      <p className="text-neutral-700">
        Your username is a unique identifier that will be used for your public
        profile and Wiki page. Once reserved, your username cannot be changed.
      </p>

      {!hasGithub ? (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0 text-yellow-400">
              <Icon icon="heroicons:exclamation-triangle" className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                GitHub Connection Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  You need to connect your GitHub account first before you can
                  reserve a username.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : initialUsername ? (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0 text-blue-400">
              <Icon icon="heroicons:information-circle" className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Username Reserved
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  You have already reserved the username{' '}
                  <strong>{initialUsername}</strong>.
                </p>
                <p className="mt-1">
                  Your profile page is available at{' '}
                  <a
                    href={`/wiki/People/${initialUsername}`}
                    className="underline hover:text-blue-800"
                  >
                    /wiki/People/{initialUsername}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form method="POST" action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="text"
                name="username"
                id="username"
                className={`block w-full rounded-md pr-10 sm:text-sm ${
                  isAvailable === false
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 focus:outline-none'
                    : isAvailable === true
                      ? 'border-green-300 text-green-900 focus:border-green-500 focus:ring-green-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Choose a username"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase())}
                aria-invalid={isAvailable === false}
                aria-describedby="username-error"
              />
              {isChecking || isCheckingAvailability ? (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-5 w-5 animate-spin text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : isAvailable === false ? (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : isAvailable === true ? (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : null}
            </div>
            {availabilityMessage && !isAvailable && (
              <p className="mt-2 text-sm text-red-600" id="username-error">
                {availabilityMessage}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Lowercase letters and numbers only. 3-30 characters.
            </p>
          </div>

          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-sm text-gray-600">
              Your profile URL will be:
              <span className="ml-1 font-mono">{previewUrl}</span>
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!isAvailable}
              className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ${
                !isAvailable
                  ? 'cursor-not-allowed bg-gray-300'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
              }`}
            >
              Reserve Username
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
