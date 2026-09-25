export const runtime = "nodejs";

export async function POST(request) {
    try {
        const body = await request.json();
        const instagramUrl = body.url?.trim();

        if (!instagramUrl) {
            return Response.json(
                { error: "Instagram URL is required." },
                { status: 400 }
            );
        }

        if (!instagramUrl.includes("instagram.com")) {
            return Response.json(
                { error: "Please enter a valid Instagram URL." },
                { status: 400 }
            );
        }

        const instaPdfUrl =
            process.env.INSTAPDF_URL || "http://127.0.0.1:7860";

        const response = await fetch(`${instaPdfUrl}/api/download`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: instagramUrl,
                format: "pdf",
                session_id: "",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();

            return Response.json(
                {
                    error: "Instagram PDF generation failed.",
                    details: errorText,
                },
                { status: response.status }
            );
        }

        const pdfBuffer = await response.arrayBuffer();

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="upsc-notes.pdf"',
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("PDF generation error:", error);

        return Response.json(
            {
                error: "Unable to generate PDF.",
                details: error.message,
            },
            { status: 500 }
        );
    }
}