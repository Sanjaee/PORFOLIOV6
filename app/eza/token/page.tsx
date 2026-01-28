"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { formatDistanceToNow } from "date-fns"

// Helper function to format time ago
const formatTimeAgo = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  } catch {
    return "Unknown"
  }
}

export default function AdminTokenPage() {
  const router = useRouter()
  const [authAccessToken, setAuthAccessToken] = useState("")
  const [authRefreshToken, setAuthRefreshToken] = useState("")
  const [stockbitToken, setStockbitToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingStockbit, setLoadingStockbit] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorStockbit, setErrorStockbit] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [successStockbit, setSuccessStockbit] = useState(false)
  const [currentToken, setCurrentToken] = useState<{
    authAccessToken: string
    authRefreshToken: string
    updatedAt: string
  } | null>(null)
  const [currentStockbitToken, setCurrentStockbitToken] = useState<{
    id: number
    bearerToken: string
    hasToken: boolean
    updatedAt: string
    createdAt: string
  } | null>(null)
  const [loadingToken, setLoadingToken] = useState(true)
  const [loadingStockbitToken, setLoadingStockbitToken] = useState(true)

  // Fetch current AI token saat component mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        setLoadingToken(true)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://meme-saham.vercel.app'
        const response = await axios.get(`${backendUrl}/api/ai-token/token`)
        const data = response.data

        if (data.success) {
          setCurrentToken(data.data)
        }
      } catch (err) {
        // Only log errors in development mode
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to fetch AI token:", err)
        }
      } finally {
        setLoadingToken(false)
      }
    }

    fetchToken()
  }, [success]) // Refetch setelah update berhasil

  // Fetch current Stockbit token saat component mount
  useEffect(() => {
    const fetchStockbitToken = async () => {
      try {
        setLoadingStockbitToken(true)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://meme-saham.vercel.app'
        const response = await axios.get(`${backendUrl}/api/ihsg/token`)
        const data = response.data

        if (data.success) {
          setCurrentStockbitToken(data.data)
        }
      } catch (err) {
        // Only log errors in development mode
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to fetch Stockbit token:", err)
        }
      } finally {
        setLoadingStockbitToken(false)
      }
    }

    fetchStockbitToken()
  }, [successStockbit]) // Refetch setelah update berhasil

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (!authAccessToken || !authRefreshToken) {
      setError("Both access token and refresh token are required")
      setLoading(false)
      return
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://meme-saham.vercel.app'
      const response = await axios.post(`${backendUrl}/api/ai-token/update`, {
        authAccessToken,
        authRefreshToken,
      })

      const data = response.data

      if (data.success) {
        setSuccess(true)
        setAuthAccessToken("")
        setAuthRefreshToken("")
        
        // Refetch token setelah update
        const tokenResponse = await axios.get(`${backendUrl}/api/ai-token/token`)
        const tokenData = tokenResponse.data
        if (tokenData.success) {
          setCurrentToken(tokenData.data)
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      } else {
        throw new Error(data.message || "Failed to update token")
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError(err instanceof Error ? err.message : "An error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStockbitSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingStockbit(true)
    setErrorStockbit(null)
    setSuccessStockbit(false)

    if (!stockbitToken || stockbitToken.trim() === "") {
      setErrorStockbit("Bearer token is required")
      setLoadingStockbit(false)
      return
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://meme-saham.vercel.app'
      const response = await axios.put(`${backendUrl}/api/ihsg/token`, {
        bearerToken: stockbitToken.trim(),
      })

      const data = response.data

      if (data.success) {
        setSuccessStockbit(true)
        setStockbitToken("")
        
        // Refetch token setelah update
        const tokenResponse = await axios.get(`${backendUrl}/api/ihsg/token`)
        const tokenData = tokenResponse.data
        if (tokenData.success) {
          setCurrentStockbitToken(tokenData.data)
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessStockbit(false)
        }, 3000)
      } else {
        throw new Error(data.message || "Failed to update token")
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setErrorStockbit(err.response.data.message)
      } else {
        setErrorStockbit(err instanceof Error ? err.message : "An error occurred")
      }
    } finally {
      setLoadingStockbit(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.push("/admin")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </Button>

        {/* Card untuk menampilkan token yang sudah disensor */}
        <Card>
          <CardHeader>
            <CardTitle>Current Token</CardTitle>
            <CardDescription>
              Current authentication tokens stored in database (masked for security)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingToken ? (
              <div className="text-center py-4">Loading token...</div>
            ) : currentToken ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Access Token (Masked)</Label>
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-md font-mono text-sm break-all">
                    {currentToken.authAccessToken}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Refresh Token (Masked)</Label>
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-md font-mono text-sm break-all">
                    {currentToken.authRefreshToken}
                  </div>
                </div>
                {currentToken.updatedAt && (
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Last updated: {formatTimeAgo(currentToken.updatedAt)}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-zinc-500 dark:text-zinc-400">
                No token found in database
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card untuk update token */}
        <Card>
          <CardHeader>
            <CardTitle>Update Token</CardTitle>
            <CardDescription>
              Update authentication tokens for AI token API. Make sure the token with ID 1 already exists in the database.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Tokens updated successfully!
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  type="text"
                  placeholder="Enter access token"
                  value={authAccessToken}
                  onChange={(e) => setAuthAccessToken(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="refreshToken">Refresh Token</Label>
                <Input
                  id="refreshToken"
                  type="text"
                  placeholder="Enter refresh token"
                  value={authRefreshToken}
                  onChange={(e) => setAuthRefreshToken(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Updating..." : "Update Token"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Card untuk Stockbit Token */}
        <Card>
          <CardHeader>
            <CardTitle>Current Stockbit Token (IHSG)</CardTitle>
            <CardDescription>
              Current Stockbit bearer token stored in database (masked for security)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingStockbitToken ? (
              <div className="text-center py-4">Loading token...</div>
            ) : currentStockbitToken ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Bearer Token (Masked)</Label>
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-md font-mono text-sm break-all">
                    {currentStockbitToken.bearerToken || "No token available"}
                  </div>
                </div>
                {currentStockbitToken.updatedAt && (
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Last updated: {formatTimeAgo(currentStockbitToken.updatedAt)}
                  </div>
                )}
                {currentStockbitToken.createdAt && (
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Created: {formatTimeAgo(currentStockbitToken.createdAt)}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-zinc-500 dark:text-zinc-400">
                No token found in database
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card untuk update Stockbit token */}
        <Card>
          <CardHeader>
            <CardTitle>Update Stockbit Token (IHSG)</CardTitle>
            <CardDescription>
              Update Stockbit bearer token for IHSG/stock market API. This token is used to authenticate requests to Stockbit API.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleStockbitSubmit}>
            <CardContent className="space-y-4">
              {errorStockbit && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errorStockbit}</AlertDescription>
                </Alert>
              )}
              
              {successStockbit && (
                <Alert className="border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Stockbit token updated successfully!
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="stockbitToken">Bearer Token</Label>
                <Input
                  id="stockbitToken"
                  type="text"
                  placeholder="Enter Stockbit bearer token"
                  value={stockbitToken}
                  onChange={(e) => setStockbitToken(e.target.value)}
                  disabled={loadingStockbit}
                  required
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  This is the JWT token used for Stockbit API authentication
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={loadingStockbit}
                className="w-full"
              >
                {loadingStockbit ? "Updating..." : "Update Stockbit Token"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
