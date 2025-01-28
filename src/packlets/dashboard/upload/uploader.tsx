import { useStore } from '@nanostores/react'
import { atom } from 'nanostores'
import React, { useEffect, useRef, useState } from 'react'
import { Icon } from 'react-iconify-icon-wrapper'
import {
  $uploads,
  type Upload,
  type UploadResult,
  type UploadState,
} from './uploadStore'

export interface Uploader {
  uploadUrl: string
  uploadFormData: Record<string, string>
}
export default function Uploader(props: Uploader) {
  const onFileChosen = async (files: File[]) => {
    for (const file of files) {
      addFile(file, props)
    }
  }
  const uploads = useStore($uploads)
  if (uploads.length > 0) {
    const clearUploads = () => {
      if (!confirm('Are you sure you want to start over?')) return
      $uploads.set([])
    }
    return (
      <div className="flex flex-col gap-4">
        {uploads.map(upload => (
          <FileUploader key={upload.id} upload={upload} />
        ))}
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearUploads}
            className="rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
          >
            Start over
          </button>
        </div>
      </div>
    )
  }

  return <DropZone onFileChosen={onFileChosen} />
}

async function calculateSHA256(file: File) {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

async function addFile(file: File, props: Uploader) {
  const $state = atom<UploadState>({
    log: `File: ${file.name}`,
  })
  const upload: Upload = {
    id: `${crypto.randomUUID()}`,
    file,
    $state,
  }
  const log = (message: string) => {
    $state.set({
      ...$state.get(),
      log: `${$state.get().log}\n${message}`,
    })
  }

  const compressorUrl =
    'https://cdn.jsdelivr.net/npm/compressorjs@1.2.1/dist/compressor.esm.js'
  const compressorPromise = import(/* @vite-ignore */ compressorUrl)

  $uploads.set([...$uploads.get(), upload])
  log(`Size: ${file.size}`)
  const originalHash = await calculateSHA256(file)
  log(`Hash: ${originalHash}`)

  log('Loading compressor…')
  const { default: Compressor } = await compressorPromise
  log('Compressor loaded.')

  const compressFile = (file: File, quality: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality,
        mimeType: 'image/webp',
        convertTypes: ['image/jpeg', 'image/png'],
        convertSize: 0,
        success: (result: File) => resolve(result as File),
        error: (err: Error) => reject(err),
      })
    })
  }
  const maxSize = 1000000
  let compressedFile = await compressFile(file, 0.9)
  log(`Quality: 0.9, Size: ${compressedFile.size}`)
  if (compressedFile.size >= maxSize || compressedFile.size >= file.size) {
    compressedFile = await compressFile(file, 0.8)
    log(`Quality: 0.8, Size: ${compressedFile.size}`)
  }
  if (compressedFile.size >= maxSize) {
    alert(`File ${file.name} is too large. Max size is 1 MB.`)
    log('File is too large. Max size is 1 MB.')
    return
  }
  if (compressedFile.size >= file.size && file.type !== 'image/jpeg') {
    log(
      `Compressed size is the same as original size. Discarding compressed file.`
    )
    compressedFile = file
  }
  const compressedHash = await calculateSHA256(compressedFile)
  log(`Hash: ${compressedHash}`)
  $state.set({
    ...$state.get(),
    previewUrl: URL.createObjectURL(compressedFile),
  })

  // Perform upload
  log('Uploading…')
  const formData = new FormData()
  formData.append('file', compressedFile, compressedFile.name)
  Object.entries(props.uploadFormData).forEach(([key, value]) => {
    formData.append(key, value)
  })
  const response = await fetch(props.uploadUrl, {
    method: 'POST',
    body: formData,
  })
  log(`HTTP ${response.status} ${response.statusText}`)
  const data = await response.json()
  log('Upload complete.\n' + JSON.stringify(data, null, 2))

  $state.set({
    ...$state.get(),
    result: {
      url: data.secure_url.replace(
        'https://res.cloudinary.com/creatorsgarten/image/upload/',
        'https://usercontent.creatorsgarten.org/c/'
      ),
      description: String(
        data.info?.detection?.captioning?.data?.caption || ''
      ),
    },
  })
}

interface FileUploader {
  upload: Upload
}
function FileUploader(props: FileUploader) {
  const state = useStore(props.upload.$state)
  return (
    <FileUploaderView
      fileName={props.upload.file.name}
      imageUrl={state.previewUrl}
      log={state.log}
      result={state.result}
    />
  )
}

interface FileUploaderView {
  fileName: string
  imageUrl?: string
  log: string
  result: UploadResult | undefined
}
function FileUploaderView(props: FileUploaderView) {
  const { fileName, imageUrl, log, result } = props
  const [showLogs, setShowLogs] = useState(false)
  const logsContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight
      void log
    }
  }, [log])
  const [copied, setCopied] = useState(false)
  const copyUrlToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (result && result.url) {
      let text = result.url
      if (e.altKey) {
        text = `![${result.description}](${text})`
      }
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) // Reset copied state after 2 seconds
      })
    }
  }

  return (
    <div className="rounded-md border-2 border-gray-300 p-4">
      <div className="flex flex-col gap-4 md:h-64 md:flex-row">
        {/* Image section */}
        <div className="relative h-32 w-full md:h-auto md:w-64">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={fileName}
              className="absolute inset-0 h-full w-full rounded-md object-contain shadow-md"
              style={{
                backgroundImage: `
        linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(-45deg, #ccc 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(-45deg, transparent 75%, #ccc 75%)
      `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-gray-200">
              <p className="text-gray-500">…</p>
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="flex-1">
          <div className="mb-2 flex h-8 items-center justify-between">
            <h2 className="text-xl font-semibold">{fileName}</h2>
            {result && (
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="text-sm text-blue-500 hover:text-blue-600 focus:outline-none"
              >
                {showLogs ? 'Show Results' : 'Show Logs'}
              </button>
            )}
          </div>

          {result && !showLogs && (
            <div className="mb-4">
              <p className="mb-2 flex">
                <input
                  type="text"
                  value={result.url}
                  className="flex-1 rounded bg-gray-100 p-1 text-gray-600"
                  readOnly
                />
                <button
                  onClick={copyUrlToClipboard}
                  className="ml-2 flex-none rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600 focus:outline-none"
                >
                  {copied ? 'Copied!' : 'Copy URL'}
                </button>
              </p>
              <p>{result.description}</p>
            </div>
          )}

          {(showLogs || !result) && (
            <div className="relative h-[216px]">
              <div
                className="absolute inset-0 overflow-auto whitespace-pre-wrap rounded-md bg-gray-100 p-4"
                ref={logsContainerRef}
              >
                {log}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface DropZone {
  onFileChosen: (files: File[]) => void
}
function DropZone(props: DropZone) {
  const { onFileChosen } = props
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const handleWindowPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files || [])
      if (files.length > 0) {
        onFileChosen(files)
      }
    }

    window.addEventListener('paste', handleWindowPaste)

    return () => {
      window.removeEventListener('paste', handleWindowPaste)
    }
  }, [])

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    onFileChosen(files)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    onFileChosen(files)
  }

  return (
    <div
      className={`flex h-64 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed ${
        isDragging
          ? 'border-blue-500 bg-blue-50 *:pointer-events-none'
          : 'border-gray-300'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileInputChange}
        multiple
      />
      <div className="text-center">
        <Icon
          icon="heroicons:cloud-arrow-up"
          className="mb-2 text-3xl text-gray-400"
        />
        <p className="mb-2 text-lg">
          {isDragging ? 'Drop files here' : 'Drag and drop files here'}
        </p>
        <p className="text-sm text-gray-500">
          or click to select files, or paste from clipboard
        </p>
      </div>
    </div>
  )
}
