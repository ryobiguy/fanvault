import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { apiRequest } from '../config/api'

// Uses Cloudinary unsigned upload. Make sure to set:
// VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your frontend env.

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  const [price, setPrice] = useState('')
  const [contentType, setContentType] = useState<'image' | 'video'>('image')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const cloudName = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!file) {
      setError('Please select a file to upload')
      return
    }

    if (!cloudName || !uploadPreset) {
      setError('Cloudinary is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.')
      return
    }

    if (isPaid && !price) {
      setError('Please enter a price for paid content')
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok || !uploadData.secure_url) {
        throw new Error('Failed to upload media to Cloudinary')
      }

      const mediaUrl = uploadData.secure_url as string

      const payload: any = {
        contentType,
        caption,
        isPaid,
        mediaUrls: [mediaUrl],
      }

      if (isPaid) {
        payload.price = parseFloat(price)
      }

      await apiRequest('/content', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      setSuccess('Content uploaded successfully')
      setFile(null)
      setCaption('')
      setIsPaid(false)
      setPrice('')
    } catch (err: any) {
      setError(err.message || 'Failed to upload content')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Content</h1>
        <p className="text-gray-600 mb-8">Share new content with your fans. Media is stored in Cloudinary.</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 text-green-700 px-4 py-2 text-sm">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content type</label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setContentType('image')}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  contentType === 'image'
                    ? 'bg-pink-600 text-white border-pink-600'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                Image
              </button>
              <button
                type="button"
                onClick={() => setContentType('video')}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  contentType === 'video'
                    ? 'bg-pink-600 text-white border-pink-600'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                Video
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Media file</label>
            <input
              type="file"
              accept={contentType === 'image' ? 'image/*' : 'video/*'}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Write a caption for your post..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monetization</label>
            <div className="flex items-center space-x-3 mb-2">
              <input
                id="isPaid"
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="h-4 w-4 text-pink-600 border-gray-300 rounded"
              />
              <label htmlFor="isPaid" className="text-sm text-gray-700">
                This is paid content
              </label>
            </div>
            {isPaid && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-gray-600">Price (£)</span>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-orange-500 text-white font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Publish Post'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
