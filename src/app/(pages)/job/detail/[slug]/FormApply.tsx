"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FiCheck, FiFileText, FiMail, FiPhone, FiSend, FiUploadCloud, FiUser, FiX } from "react-icons/fi";
import { Toaster, toast } from "sonner";
import "./apply.css";
import { readResponse, sendApplication } from "./application";

type PersonalCV = { name: string; size: number; updatedAt: string };
const api = process.env.NEXT_PUBLIC_API_URL;

export const FormApply = ({ jobId }: { jobId: string }) => {
  const { infoUser } = useAuth();
  const [personalCV, setPersonalCV] = useState<PersonalCV | null>(null);
  const [source, setSource] = useState<"personal" | "upload" | null>(null);
  const [contact, setContact] = useState({ fullName: "", email: "", phone: "" });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const userId = infoUser?.id;

  useEffect(() => {
    setPersonalCV(null); setSource(null); setProfileError("");
    if (!userId) return;
    const controller = new AbortController();
    fetch(`${api}/user/attachments`, { credentials: "include", cache: "no-store", signal: controller.signal })
      .then(readResponse).then(data => { if (!controller.signal.aborted) setPersonalCV(data.profile.cv); })
      .catch(() => { if (!controller.signal.aborted) setProfileError("Chưa thể tải CV cá nhân. Bạn có thể chọn tải lên một CV khác."); });
    return () => controller.abort();
  }, [userId]);

  const choosePersonalCV = () => {
    if (source === "personal") { setSource(null); setFileError(""); return; }
    setSource("personal"); setFileError("");
    setContact({ fullName: infoUser?.fullName || "", email: infoUser?.email || "", phone: infoUser?.phone || "" });
  };

  const chooseUpload = () => {
    setFileError("");
    if (source === "upload") { setSource(null); return; }
    setSource("upload"); fileInput.current?.click();
  };

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    event.target.value = "";
    if (!selected) return;
    if (!/\.pdf$/i.test(selected.name) || (selected.type && selected.type !== "application/pdf")) {
      setFileError("Vui lòng chọn CV định dạng PDF."); return;
    }
    if (!selected.size || selected.size > 5 * 1024 * 1024) {
      setFileError("Vui lòng chọn file có nội dung, dung lượng tối đa 5 MB."); return;
    }
    setFile(selected); setSource("upload"); setFileError("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    const savedCV = userId ? personalCV : null;
    if (!source || (source === "personal" ? !savedCV : !file)) { setFileError("Vui lòng chọn CV để ứng tuyển."); return; }
    const form = event.currentTarget;
    const values = new FormData(form);
    submitting.current = true; setBusy(true); setFileError("");
    try {
      const data = await sendApplication({ jobId, values, file: source === "upload" ? file : null, personalCV: source === "personal" ? savedCV : null });
      toast.success(data.message || "Đã gửi CV thành công!");
      form.reset(); setFile(null); setSource(null); setContact({ fullName: "", email: "", phone: "" });
    } catch (error) { toast.error(error instanceof Error ? error.message : "Không thể gửi CV. Vui lòng thử lại."); }
    finally { submitting.current = false; setBusy(false); }
  };

  const hasPersonalCV = Boolean(userId && personalCV);
  const currentFile = source === "personal" && hasPersonalCV ? personalCV : source === "upload" ? file : null;

  return <>
    <Toaster richColors position="top-right" offset={{ top: "96px", right: "16px" }} mobileOffset={{ top: "80px", left: "16px", right: "16px" }} />
    <form id="applyForm" className="job-apply-form" onSubmit={submit} aria-busy={busy}>
      <fieldset disabled={busy}>
        <div className="job-apply-fields">
          <div className="job-apply-field job-apply-wide"><label htmlFor="apply-fullName">Họ tên <span>*</span></label><div className="job-apply-input"><FiUser aria-hidden="true" /><input id="apply-fullName" name="fullName" autoComplete="name" value={contact.fullName} onChange={event => setContact(current => ({ ...current, fullName: event.target.value }))} required minLength={5} maxLength={50} placeholder="Nhập họ và tên" /></div></div>
          <div className="job-apply-field"><label htmlFor="apply-email">Email <span>*</span></label><div className="job-apply-input"><FiMail aria-hidden="true" /><input id="apply-email" name="email" type="email" autoComplete="email" value={contact.email} onChange={event => setContact(current => ({ ...current, email: event.target.value }))} required placeholder="Nhập địa chỉ email" /></div></div>
          <div className="job-apply-field"><label htmlFor="apply-phone">Số điện thoại <span>*</span></label><div className="job-apply-input"><FiPhone aria-hidden="true" /><input id="apply-phone" name="phone" type="tel" autoComplete="tel" value={contact.phone} onChange={event => setContact(current => ({ ...current, phone: event.target.value }))} required pattern="(?:0|84)[35789][0-9]{8}" title="Nhập số điện thoại Việt Nam, ví dụ 0912345678" placeholder="Nhập số điện thoại" /></div></div>
        </div>
        <div className="job-apply-cv">
          <h3 id="apply-cv-label">CV ứng tuyển <span>*</span></h3>
          <div className={`job-apply-cv-options ${hasPersonalCV ? "has-personal" : ""}`} role="group" aria-labelledby="apply-cv-label">
            {hasPersonalCV && <button type="button" className={`job-apply-choice ${source === "personal" ? "is-selected" : ""}`} aria-pressed={source === "personal"} onClick={choosePersonalCV}><span className="job-apply-choice-icon"><FiFileText aria-hidden="true" /></span><span><strong>Dùng CV của tôi</strong><small>{personalCV?.name}</small></span><span className="job-apply-choice-check" aria-hidden="true">{source === "personal" && <FiCheck />}</span></button>}
            <button type="button" className={`job-apply-choice ${source === "upload" ? "is-selected" : ""}`} aria-pressed={source === "upload"} onClick={chooseUpload}><span className="job-apply-choice-icon"><FiUploadCloud aria-hidden="true" /></span><span><strong>Tải lên</strong><small>Chọn CV từ thiết bị của bạn</small></span><span className="job-apply-choice-check" aria-hidden="true">{source === "upload" && <FiCheck />}</span></button>
          </div>
          <input ref={fileInput} type="file" accept=".pdf,application/pdf" hidden onChange={chooseFile} aria-label="Chọn CV từ thiết bị" />
          {currentFile && <div className="job-apply-selected-file"><FiFileText aria-hidden="true" /><div><strong>{currentFile.name}</strong><span>{(currentFile.size / 1024).toFixed(0)} KB · PDF</span></div>{source === "upload" && <button type="button" aria-label="Bỏ CV đã chọn" onClick={() => setFile(null)}><FiX aria-hidden="true" /></button>}</div>}
          <p className="job-apply-help">Hỗ trợ PDF, tối đa 5 MB.</p>
          {profileError && <p className="job-apply-help" role="status">{profileError}</p>}
          {fileError && <p className="job-apply-error" role="alert">{fileError}</p>}
        </div>
        <div className="job-apply-actions"><button type="submit"><FiSend aria-hidden="true" />{busy ? "Đang gửi CV…" : "Gửi CV ứng tuyển"}</button></div>
      </fieldset>
    </form>
  </>;
};
