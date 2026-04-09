function normalizeBaseUrl(raw) {
  const s = String(raw || "").trim()
  if (!s) return ""
  const withProto = s.startsWith("http://") || s.startsWith("https://") ? s : `http://${s}`
  return withProto.replace(/\/+$/, "")
}

export async function POST(request) {
  const form = await request.formData()
  const apiBaseFromForm = normalizeBaseUrl(form.get("api_base"))
  form.delete("api_base")

  const envBase = normalizeBaseUrl(process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL)
  const apiBase = apiBaseFromForm || envBase || "http://localhost:8001"

  try {
    new URL(apiBase)
  } catch {
    return Response.json({ error: "invalid api_base" }, { status: 400 })
  }

  try {
    const res = await fetch(`${apiBase}/api/forecast`, {
      method: "POST",
      body: form,
    })

    const contentType = res.headers.get("content-type") || "application/json"
    const body = await res.arrayBuffer()
    return new Response(body, { status: res.status, headers: { "content-type": contentType } })
  } catch {
    return Response.json({ error: "unreachable api_base" }, { status: 502 })
  }
}
