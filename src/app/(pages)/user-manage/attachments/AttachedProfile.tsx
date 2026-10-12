"use client";

import Link from "next/link";
import Image from "next/image";
import { Toaster, toast } from "sonner";
import { Editor as TinyEditor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { FiArrowLeft, FiCalendar, FiCheck, FiDownload, FiEdit, FiEye, FiFileText, FiGlobe, FiMail, FiMapPin, FiPhone, FiUpload, FiUser, FiX } from "react-icons/fi";
import "./attachments.css";
import { ProfileMultiSelect } from "./ProfileMultiSelect";
import { multipleOptions, singleOptions } from "./profile-options";

const emptyBasic = {
  fullName: "", title: "", email: "", phone: "", birthday: "", gender: "", address: "", linkedin: "",
};
const emptyGeneral = {
  experience: "", level: "", education: "", major: "", skills: "", workingForms: "", industries: "",
  salary: "", languages: "", availability: "",
};
type PersonalCV = { name: string; size: number; updatedAt: string };
type Profile = { basic: typeof emptyBasic; general: typeof emptyGeneral; avatar: string; letter: string; cv: PersonalCV | null };
const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/user/attachments`;

class ProfileRequestError extends Error {
  constructor(message: string, public requiresLogin = false) { super(message); }
}

async function request(url: string, options?: RequestInit) {
  let response: Response;
  try {
    response = await fetch(url, { ...options, credentials: "include", cache: "no-store" });
  } catch (error) {
    if (options?.signal?.aborted) throw error;
    throw new ProfileRequestError("Không thể kết nối máy chủ. Vui lòng thử lại.");
  }
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new ProfileRequestError(response.status === 404
      ? "Dịch vụ hồ sơ hiện chưa sẵn sàng. Vui lòng thử lại sau."
      : "Không thể tải hồ sơ lúc này. Vui lòng thử lại.");
  }
  const data = await response.json().catch(() => { throw new ProfileRequestError("Phản hồi từ máy chủ không hợp lệ. Vui lòng thử lại."); });
  if (!response.ok || data.code !== "success") {
    // Existing authentication middleware reports invalid sessions as HTTP 200.
    const requiresLogin = response.status === 401 || response.status === 403 || (response.ok && data.code === "error");
    throw new ProfileRequestError(requiresLogin ? "Vui lòng đăng nhập để xem hồ sơ của bạn." : data.message || "Không thể tải hồ sơ.", requiresLogin);
  }
  return data;
}
type Editor = "basic" | "general" | "letter" | "preview" | null;

function Detail({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <div className="attachment-detail"><span aria-hidden="true">{icon}</span><span>{children}</span></div>;
}
function Tags({ text }: { text: string }) {
  return <div className="attachment-tags">{text.split(",").map(item => item.trim()).filter(Boolean).map(item => <span key={item}>{item}</span>)}</div>;
}

export const AttachedProfile = () => {
  const [basic, setBasic] = useState(emptyBasic);
  const [general, setGeneral] = useState(emptyGeneral);
  const [letter, setLetter] = useState("");
  const [avatar, setAvatar] = useState("");
  const [draftBasic, setDraftBasic] = useState(emptyBasic);
  const [draftGeneral, setDraftGeneral] = useState(emptyGeneral);
  const [draftLetter, setDraftLetter] = useState("");
  const [editor, setEditor] = useState<Editor>(null);
  const [cv, setCv] = useState<PersonalCV | null>(null);
  const [cvUrl, setCvUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const applyProfile = (profile: Profile) => {
    setBasic({ ...emptyBasic, ...profile.basic }); setGeneral({ ...emptyGeneral, ...profile.general });
    setLetter(profile.letter); setAvatar(profile.avatar); setCv(profile.cv);
  };
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(""); setRequiresLogin(false);
    request(endpoint, { signal: controller.signal }).then(data => applyProfile(data.profile)).catch(err => {
      if (!controller.signal.aborted) {
        setError(err.message || "Không thể kết nối máy chủ.");
        setRequiresLogin(err instanceof ProfileRequestError && err.requiresLogin);
      }
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [loadAttempt]);
  useEffect(() => {
    if (editor !== "preview" || !cv) return;
    const controller = new AbortController();
    let objectUrl = "";
    setPreviewLoading(true); setCvUrl("");
    fetch(`${endpoint}/cv`, { credentials: "include", cache: "no-store", signal: controller.signal }).then(async response => {
      if (!response.ok || !response.headers.get("content-type")?.includes("application/pdf")) throw new Error("Không thể mở CV. Vui lòng đăng nhập lại hoặc thử lại.");
      const blob = await response.blob();
      if (!controller.signal.aborted) { objectUrl = URL.createObjectURL(blob); setCvUrl(objectUrl); }
    }).catch(err => { if (!controller.signal.aborted) setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setPreviewLoading(false); });
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [editor, cv]);
  useEffect(() => {
    if (editor) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [editor]);

  const startEdit = (section: Editor) => {
    setError("");
    setDraftBasic({ ...basic }); setDraftGeneral({ ...general }); setDraftLetter(letter);
    setEditor(section);
  };
  const chooseCV = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!/\.pdf$/i.test(file.name)) { setFileError("Vui lòng chọn tệp PDF để có thể xem nhanh CV."); return; }
    if (file.size >= 3 * 1024 * 1024) { setFileError("Dung lượng CV phải dưới 3 MB."); return; }
    if (!file.size) { setFileError("Tệp đang trống. Vui lòng chọn một CV khác."); return; }
    setBusy(true); setFileError("");
    try {
      const form = new FormData(); form.append("cv", file);
      const data = await request(`${endpoint}/cv`, { method: "POST", body: form });
      setCv(data.cv); toast.success("Tải CV lên thành công!");
    } catch (err) { setFileError(err instanceof Error ? err.message : "Không thể tải CV lên."); }
    finally { setBusy(false); }
  };
  const saveSection = async () => {
    setBusy(true); setError("");
    try {
      const data = await request(endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        section: editor, values: editor === "basic" ? draftBasic : editor === "general" ? draftGeneral : draftLetter
      }) });
      applyProfile(data.profile); setEditor(null); toast.success("Cập nhật thành công!");
      window.dispatchEvent(new Event("profile-updated"));
    } catch (err) { setError(err instanceof Error ? err.message : "Không thể lưu hồ sơ."); }
    finally { setBusy(false); }
  };
  const editButton = (section: Editor, label: string) => <button disabled={busy} type="button" className="attachment-edit" aria-label={label} onClick={() => startEdit(section)}><FiEdit aria-hidden="true" /></button>;
  const basicFields: { key: keyof typeof emptyBasic; label: string; type?: string }[] = [
    { key: "fullName", label: "Họ tên" }, { key: "title", label: "Chức danh" },
    { key: "email", label: "Email", type: "email" }, { key: "phone", label: "Số điện thoại", type: "tel" },
    { key: "birthday", label: "Ngày sinh", type: "date" }, { key: "gender", label: "Giới tính" },
    { key: "address", label: "Địa điểm" }, { key: "linkedin", label: "LinkedIn / website" },
  ];
  const generalFields: { key: keyof typeof emptyGeneral; label: string }[] = [
    { key: "experience", label: "Tổng số năm kinh nghiệm" }, { key: "level", label: "Cấp bậc hiện tại" },
    { key: "education", label: "Học vấn" }, { key: "major", label: "Chuyên ngành" },
    { key: "skills", label: "Kỹ năng" }, { key: "workingForms", label: "Hình thức làm việc mong muốn" },
    { key: "industries", label: "Lĩnh vực đã làm việc" }, { key: "salary", label: "Mức lương mong muốn" },
    { key: "languages", label: "Ngoại ngữ" }, { key: "availability", label: "Thời gian có thể bắt đầu" },
  ];
  if (loading) return <main className="attached-profile"><div className="attachment-container" role="status">Đang tải hồ sơ…</div></main>;
  if (error && !basic.email) return <main className="attached-profile"><div className="attachment-container"><p role="alert">{error}</p>{requiresLogin ? <Link href="/user/login?returnTo=%2Fuser-manage%2Fattachments" className="attachment-outline">Đăng nhập</Link> : <button type="button" className="attachment-outline" onClick={() => setLoadAttempt(value => value + 1)}>Thử lại</button>}</div></main>;

  return <main className="attached-profile">
    <Toaster position="top-right" offset={{ top: "96px", right: "16px" }} mobileOffset={{ top: "80px", right: "16px", left: "16px" }} richColors />
    <div className="attachment-container">
      <Link href="/" className="attachment-back"><FiArrowLeft aria-hidden="true" /> Trang chủ</Link>
      <div className="attachment-page-heading"><div><h1>Hồ sơ đính kèm</h1><p>Giới thiệu bản thân và năng lực của bạn với nhà tuyển dụng.</p></div></div>

      <section className="attachment-card" aria-labelledby="basic-heading">
        {editButton("basic", "Chỉnh sửa thông tin cơ bản")}
        <div className="attachment-person"><div className="attachment-avatar" aria-hidden="true">{avatar ? <Image src={avatar} alt="" width={80} height={80} unoptimized /> : basic.fullName.split(" ").filter(Boolean).slice(-2).map(part => part[0]).join("")}</div><div><h2 id="basic-heading">{basic.fullName}</h2><p>{basic.title}</p></div></div>
        <div className="attachment-details">
          <Detail icon={<FiMail />}><a href={`mailto:${basic.email}`}>{basic.email}</a></Detail>
          <Detail icon={<FiPhone />}><a href={`tel:${basic.phone}`}>{basic.phone}</a></Detail>
          <Detail icon={<FiCalendar />}>{basic.birthday.split("-").reverse().join("/")}</Detail>
          <Detail icon={<FiUser />}>{basic.gender}</Detail>
          <Detail icon={<FiMapPin />}>{basic.address}</Detail>
          <Detail icon={<FiGlobe />}>{basic.linkedin}</Detail>
        </div>
      </section>

      <section className="attachment-card" aria-labelledby="cv-heading">
        <div className="attachment-section-heading"><h2 id="cv-heading">CV của tôi</h2><span className="attachment-tag">CV cá nhân</span></div>
        {cv && <div className="attachment-cv-file"><span className="attachment-file-icon"><FiFileText aria-hidden="true" /></span><div className="attachment-file-info"><button type="button" onClick={() => startEdit("preview")}>{cv.name}</button><p>Cập nhật lần cuối: {new Date(cv.updatedAt).toLocaleDateString("vi-VN")} · {(cv.size / 1024).toFixed(0)} KB</p></div><button type="button" className="attachment-edit" aria-label="Xem CV" onClick={() => startEdit("preview")}><FiEye aria-hidden="true" /></button></div>}
        <div className="attachment-upload-row"><input ref={fileRef} type="file" accept=".pdf,application/pdf" className="attachment-file-input" aria-label="Chọn CV cá nhân" onChange={chooseCV} /><button type="button" className="attachment-outline" disabled={busy} aria-busy={busy} onClick={() => fileRef.current?.click()}><FiUpload aria-hidden="true" />Tải lên</button></div>
        <p className="attachment-help">Hỗ trợ PDF, dưới 3 MB. Vui lòng sử dụng tệp không có mật khẩu bảo vệ.</p>
        {fileError && <p className="attachment-error" role="alert">{fileError}</p>}
      </section>

      <section className="attachment-card" aria-labelledby="general-heading">
        <div className="attachment-section-heading"><h2 id="general-heading">Thông tin chung</h2>{editButton("general", "Chỉnh sửa thông tin chung")}</div>
        <dl className="attachment-general">{generalFields.map(field => <div key={field.key}><dt>{field.label}</dt><dd>{["skills", "workingForms", "industries", "languages"].includes(field.key) ? <Tags text={general[field.key]} /> : general[field.key]}</dd></div>)}</dl>
      </section>

      <section className="attachment-card" aria-labelledby="letter-heading">
        <div className="attachment-section-heading"><h2 id="letter-heading">Thư giới thiệu bản thân</h2>{editButton("letter", "Chỉnh sửa thư giới thiệu")}</div>
        <div className="attachment-letter" dangerouslySetInnerHTML={{ __html: letter }} />
      </section>

      <dialog ref={dialogRef} className={`attachment-dialog ${editor === "preview" ? "attachment-dialog-preview" : ""}`} onClose={() => setEditor(null)} onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setEditor(null);
      }} aria-labelledby="attachment-dialog-title">
        <div className="attachment-dialog-heading"><h2 id="attachment-dialog-title">{editor === "basic" ? "Thông tin cơ bản" : editor === "general" ? "Thông tin chung" : editor === "letter" ? "Thư giới thiệu bản thân" : "Xem CV"}</h2><button type="button" className="attachment-edit" aria-label="Đóng" onClick={() => setEditor(null)}><FiX aria-hidden="true" /></button></div>
        <div className="attachment-dialog-content">
        {editor === "preview" ? <><div className="attachment-preview attachment-dialog-body">
          {previewLoading && <p role="status">Đang tải bản PDF…</p>}
          {error && <p className="attachment-error" role="alert">{error}</p>}
          {cv && cvUrl && <><iframe src={cvUrl} title="Bản xem trước CV cá nhân" /><a className="attachment-outline" href={cvUrl} download={cv.name}><FiDownload aria-hidden="true" />Tải CV xuống</a></>}
        </div><div className="attachment-dialog-actions"><button type="button" className="attachment-outline" onClick={() => setEditor(null)}>Đóng</button></div></> : <form className="attachment-dialog-form" onSubmit={event => { event.preventDefault(); saveSection(); }}>
          <div className="attachment-dialog-body">
          <div className="attachment-form-grid">
            {editor === "basic" && basicFields.map(field => <label key={field.key}>{field.label}<input type={field.type || "text"} required={field.key === "fullName"} readOnly={field.key === "email"} maxLength={2000} value={draftBasic[field.key]} onChange={event => setDraftBasic({ ...draftBasic, [field.key]: event.target.value })} /></label>)}
            {editor === "general" && generalFields.map(field => {
              const id = `general-${field.key}`;
              const value = draftGeneral[field.key];
              const update = (next: string) => setDraftGeneral(current => ({ ...current, [field.key]: next }));
              return <div key={field.key} className="attachment-general-field">
                <label htmlFor={id}>{field.label}</label>
                {multipleOptions[field.key] ? <ProfileMultiSelect id={id} label={field.label} value={value} options={multipleOptions[field.key]} disabled={busy} onChange={update} />
                  : singleOptions[field.key] ? <select id={id} disabled={busy} value={value} onChange={event => update(event.target.value)}>
                    <option value="" disabled hidden>Chọn {field.label.toLowerCase()}</option>
                    {value && !singleOptions[field.key].includes(value) && <option value={value} hidden>{value}</option>}
                    {singleOptions[field.key].map(option => <option key={option} value={option}>{option}</option>)}
                  </select> : <input id={id} disabled={busy} maxLength={2000} value={value} onChange={event => update(event.target.value)} />}
                {field.key === "languages" && <small>Phân cách các mục bằng dấu phẩy.</small>}
              </div>;
            })}
            {editor === "letter" && <div className="attachment-form-wide"><TinyEditor apiKey={process.env.NEXT_PUBLIC_API_TINYMCE} value={draftLetter} onEditorChange={setDraftLetter} init={{ height: 360, menubar: false, plugins: "lists", toolbar: "undo redo | bold italic underline | bullist numlist | removeformat", formats: { underline: { inline: "u" } }, branding: false, content_style: "body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.7; }" }} /></div>}
          </div>
          </div>
          <div className="attachment-dialog-actions">{error && <p className="attachment-error" role="alert">{error}</p>}<button disabled={busy} type="button" className="attachment-outline" onClick={() => setEditor(null)}>Hủy</button><button disabled={busy} type="submit" className="attachment-primary"><FiCheck aria-hidden="true" />{busy ? "Đang lưu…" : "Lưu thay đổi"}</button></div>
        </form>}
        </div>
      </dialog>
    </div>
  </main>;
};
