const api = process.env.NEXT_PUBLIC_API_URL;

export async function readResponse(response: Response) {
  if (!response.headers.get("content-type")?.includes("application/json")) throw new Error("Dịch vụ hiện chưa sẵn sàng. Vui lòng thử lại.");
  const data = await response.json();
  if (!response.ok || data.code !== "success") throw new Error(data.message || "Không thể gửi CV. Vui lòng thử lại.");
  return data;
}

export async function sendApplication({ jobId, values, file, personalCV }: {
  jobId: string; values: FormData; file: File | null; personalCV: { name: string } | null;
}) {
  let applicationFile = file;
  if (personalCV) {
    const response = await fetch(`${api}/user/attachments/cv`, { credentials: "include", cache: "no-store" });
    if (!response.ok || !response.headers.get("content-type")?.includes("application/pdf")) throw new Error("Không thể đọc CV cá nhân. Vui lòng đăng nhập lại hoặc tải CV khác.");
    applicationFile = new File([await response.blob()], personalCV.name, { type: "application/pdf" });
  }
  if (!applicationFile) throw new Error("Vui lòng chọn CV để ứng tuyển.");
  const body = new FormData();
  body.append("jobId", jobId);
  for (const key of ["fullName", "email", "phone"]) body.append(key, String(values.get(key) || "").trim());
  // Each application keeps its own snapshot when the personal CV is later replaced.
  body.append("fileCV", new File([applicationFile], applicationFile.name, { type: "application/pdf" }));
  return readResponse(await fetch(`${api}/job/apply`, { method: "POST", body, credentials: "include" }));
}
