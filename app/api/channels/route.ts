import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock database
const channels = [
  {
    id: "1",
    name: "general",
    description: "General discussion",
    type: "text",
    createdBy: "1",
    createdAt: new Date(),
    members: ["1"],
  },
  {
    id: "2",
    name: "development",
    description: "Development discussions",
    type: "text",
    createdBy: "1",
    createdAt: new Date(),
    members: ["1"],
  },
]

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    return NextResponse.json({ channels })
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
    const { name, description, type = "text" } = await request.json()

    const newChannel = {
      id: Date.now().toString(),
      name,
      description,
      type,
      createdBy: decoded.userId,
      createdAt: new Date(),
      members: [decoded.userId],
    }

    channels.push(newChannel)

    return NextResponse.json({ channel: newChannel })
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
}
