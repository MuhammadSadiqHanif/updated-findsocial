"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { X, Upload, Trash2 } from "lucide-react"

interface UploadedFile {
  name: string
  size: string
  progress: number
  uploading: boolean
}

interface ImportModalProps {
  show: boolean
  uploadedFile: UploadedFile | null
  setUploadedFile: React.Dispatch<React.SetStateAction<UploadedFile | null>>
  onClose: () => void
}

export function ImportModal({ show, uploadedFile, setUploadedFile, onClose }: ImportModalProps) {
  if (!show) return null

  const handleFileUpload = (file: File) => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)

    setUploadedFile({
      name: file.name,
      size: `${sizeInMB} MB`,
      progress: 0,
      uploading: true,
    })

    let currentProgress = 0
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5

      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(progressInterval)

        setUploadedFile((prev) =>
          prev
            ? {
                ...prev,
                progress: 100,
                uploading: false,
              }
            : null,
        )
      } else {
        setUploadedFile((prev) =>
          prev
            ? {
                ...prev,
                progress: Math.round(currentProgress),
              }
            : null,
        )
      }
    }, 200)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type === "text/csv") {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const removeUploadedFile = () => {
    setUploadedFile(null)
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/5 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl shadow-gray-500/30 w-full max-w-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Import</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">
          Import a CSV file containing Instagram URLs to find their contact details
        </p>

        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-purple-300 rounded-lg p-6 md:p-8 text-center mb-4 relative hover:border-[#7F56D9] transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-[#7F56D9]" />
            </div>
            <div>
              <p className="text-[#7F56D9] font-medium">Click to upload</p>
              <p className="text-[#7F56D9]">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">CSV file format (max. 5 MB)</p>
          </div>
          {/* CSV Icon in corner */}
          <div className="absolute top-3 right-3 w-8 h-8 bg-green-100 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-green-700">CSV</span>
          </div>
        </div>

        {/* Uploaded File Display */}
        {uploadedFile && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-green-700">CSV</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">{uploadedFile.size}</p>
                </div>
              </div>
              <button
                onClick={removeUploadedFile}
                className="w-6 h-6 rounded hover:bg-gray-200 flex items-center justify-center flex-shrink-0 ml-2"
                disabled={uploadedFile.uploading}
              >
                <Trash2 className={`w-4 h-4 ${uploadedFile.uploading ? "text-gray-300" : "text-gray-500"}`} />
              </button>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${uploadedFile.uploading ? "bg-[#7F56D9]" : "bg-green-500"}`}
                style={{ width: `${uploadedFile.progress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 text-right">{uploadedFile.progress}%</p>
              {uploadedFile.uploading ? (
                <p className="text-xs text-[#7F56D9]">Uploading...</p>
              ) : (
                <p className="text-xs text-green-600">Complete</p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1 bg-transparent cursor-pointer" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#7F56D9] hover:bg-purple-700 text-white cursor-pointer"
            disabled={!uploadedFile || uploadedFile.uploading}
          >
            {uploadedFile?.uploading ? "Uploading..." : "Import"}
          </Button>
        </div>
      </div>
    </div>
  )
}
