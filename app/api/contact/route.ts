import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, service, budget, details } = body;

    // Validate required fields
    if (!name || !email || !service || !details) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const accessKey =
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
      "d3bacfeb-d6c3-49aa-bf4c-ef87f4e7c447";

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "FreeWheel-Web-App/1.0",
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: name,
        email: email,
        subject: `🚀 New Project Inquiry from ${name} (${service})`,
        from_name: "FreeWheel Inquiries",
        service_category: service,
        estimated_budget: budget || "Not Specified",
        message: details,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({ success: true, message: "Email sent successfully!" });
    } else {
      console.error("Web3Forms error response:", result);
      return NextResponse.json(
        { error: result.message || "Failed to deliver email. Please try again." },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Error processing contact submission:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
