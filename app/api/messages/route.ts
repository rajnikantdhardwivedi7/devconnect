import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock database
const messages: any[] = []

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get("channelId")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    const channelMessages = messages.filter((m) => m.channelId === channelId)

    return NextResponse.json({ messages: channelMessages })
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    const { content, channelId } = await request.json()

    const newMessage = {
      id: Date.now().toString(),
      content,
      channelId,
      userId: decoded.userId,
      timestamp: new Date(),
      reactions: [],
    }

    messages.push(newMessage)

    return NextResponse.json({ message: newMessage })
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
}
