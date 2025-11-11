import { Upload, X, Image as ImageIcon, Video, FileText, DollarSign, Lock, Unlock, Send, Globe } from 'lucide-react'
import { useState, useRef } from 'react'
import DashboardLayout from '../components/DashboardLayout'

type ContentType = 'image' | 'video' | 'text'
type PostDestination = 'feed' | 'message'

export default function UploadContent() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [contentType, setContentType] = useState<ContentType>('image')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [caption, setCaption] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  const [price, setPrice] = useState('5.00')
  const [destination, setDestination] = useState<PostDestination>('feed')
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const fileArray = Array.from(selectedFiles)
    setFiles(prev => [...prev, ...fileArray])

    // Create previews
    fileArray.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handlePost = () => {
    // This would send to backend
    console.log({
      files,
      caption,
      isPaid,
      price: isPaid ? price : null,
      destination,
      contentType
    })
    alert('Content posted successfully! (Demo)')
    // Redirect handled by user
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Content</h1>
          <p className="text-gray-600">Share photos, videos, or text posts with your subscribers</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Content Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Content Type</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setContentType('image')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                  contentType === 'image'
                    ? 'border-pink-600 bg-pink-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <ImageIcon className={`h-8 w-8 mb-2 ${contentType === 'image' ? 'text-pink-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${contentType === 'image' ? 'text-pink-600' : 'text-gray-700'}`}>
                  Photo
                </span>
              </button>
              <button
                onClick={() => setContentType('video')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                  contentType === 'video'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Video className={`h-8 w-8 mb-2 ${contentType === 'video' ? 'text-purple-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${contentType === 'video' ? 'text-purple-600' : 'text-gray-700'}`}>
                  Video
                </span>
              </button>
              <button
                onClick={() => setContentType('text')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                  contentType === 'text'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileText className={`h-8 w-8 mb-2 ${contentType === 'text' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${contentType === 'text' ? 'text-blue-600' : 'text-gray-700'}`}>
                  Text Post
                </span>
              </button>
            </div>
          </div>

          {/* File Upload Area */}
          {contentType !== 'text' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload {contentType === 'image' ? 'Photos' : 'Videos'}
              </label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                  isDragging
                    ? 'border-pink-600 bg-pink-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-700 font-medium mb-2">
                  Drag & drop your files here
                </p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition"
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={contentType === 'image' ? 'image/*' : 'video/*'}
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-4">
                  {contentType === 'image' ? 'PNG, JPG, GIF up to 10MB' : 'MP4, MOV up to 500MB'}
                </p>
              </div>

              {/* File Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Caption */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption for your post..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Pricing Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Pricing</label>
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setIsPaid(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition flex-1 ${
                  !isPaid
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Unlock className={`h-5 w-5 ${!isPaid ? 'text-green-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <p className={`font-medium ${!isPaid ? 'text-green-600' : 'text-gray-700'}`}>
                    Free for Subscribers
                  </p>
                  <p className="text-xs text-gray-500">Included in subscription</p>
                </div>
              </button>
              <button
                onClick={() => setIsPaid(true)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition flex-1 ${
                  isPaid
                    ? 'border-pink-600 bg-pink-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Lock className={`h-5 w-5 ${isPaid ? 'text-pink-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <p className={`font-medium ${isPaid ? 'text-pink-600' : 'text-gray-700'}`}>
                    Pay-Per-View
                  </p>
                  <p className="text-xs text-gray-500">Charge extra for this content</p>
                </div>
              </button>
            </div>

            {isPaid && (
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 font-medium">£</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  step="0.50"
                  min="0.50"
                />
                <span className="text-sm text-gray-500">per unlock</span>
              </div>
            )}
          </div>

          {/* Post Destination */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Where to post?</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDestination('feed')}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition ${
                  destination === 'feed'
                    ? 'border-pink-600 bg-pink-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Globe className={`h-6 w-6 ${destination === 'feed' ? 'text-pink-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <p className={`font-medium ${destination === 'feed' ? 'text-pink-600' : 'text-gray-700'}`}>
                    Post to Feed
                  </p>
                  <p className="text-xs text-gray-500">All subscribers will see this</p>
                </div>
              </button>
              <button
                onClick={() => setDestination('message')}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition ${
                  destination === 'message'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Send className={`h-6 w-6 ${destination === 'message' ? 'text-purple-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <p className={`font-medium ${destination === 'message' ? 'text-purple-600' : 'text-gray-700'}`}>
                    Send as Message
                  </p>
                  <p className="text-xs text-gray-500">Choose recipients next</p>
                </div>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handlePost}
              disabled={contentType !== 'text' && files.length === 0}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {destination === 'feed' ? 'Post to Feed' : 'Continue to Recipients'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
