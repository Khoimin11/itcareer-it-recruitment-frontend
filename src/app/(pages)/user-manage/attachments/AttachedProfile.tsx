"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { FiArrowLeft, FiCalendar, FiCheck, FiDownload, FiEdit, FiEye, FiFileText, FiGlobe, FiMail, FiMapPin, FiPhone, FiUpload, FiUser, FiX } from "react-icons/fi";
import "./attachments.css";

const sampleBasic = {
  fullName: "Đỗ Minh Khôi", title: "Full-stack Developer", email: "mail.dominhkhoi@gmail.com",
  phone: "0377418527", birthday: "2005-04-11", gender: "Nam", address: "Thủ Đức, Hồ Chí Minh",
  linkedin: "linkedin.com/in/do-minh-khoi",
};
const sampleGeneral = {
  experience: "< 1 năm", level: "Fresher", education: "Đại học Công nghệ Thông tin — ĐHQG TP.HCM",
  major: "Hệ thống thông tin", skills: "JavaScript, TypeScript, ReactJS, Next.js, Node.js, MongoDB",
  workingForms: "Tại văn phòng, Linh hoạt", industries: "Phát triển phần mềm, Sản phẩm phần mềm và dịch vụ web",
  salary: "5.000.000 – 12.000.000 VND/tháng", languages: "Tiếng Việt, Tiếng Anh", availability: "Có thể bắt đầu trong 2 tuần",
};
const sampleLetter = "Xin chào nhà tuyển dụng,\n\nTôi là Đỗ Minh Khôi, một lập trình viên Full-stack yêu thích xây dựng các sản phẩm web dễ sử dụng. Tôi có kinh nghiệm thực hiện các dự án với ReactJS, Next.js, Node.js và MongoDB, từ thiết kế giao diện đến xây dựng API và quản lý dữ liệu.\n\nTôi mong muốn gia nhập một đội ngũ có tinh thần học hỏi và chia sẻ, nơi tôi có thể đóng góp kỹ năng lập trình, phát triển tư duy giải quyết vấn đề và cùng tạo ra những sản phẩm có giá trị.\n\nCảm ơn anh/chị đã dành thời gian xem hồ sơ của tôi. Tôi rất mong có cơ hội trao đổi thêm về vị trí phù hợp.";
type Editor = "basic" | "general" | "letter" | "preview" | null;

function Detail({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <div className="attachment-detail"><span aria-hidden="true">{icon}</span><span>{children}</span></div>;
}
function Tags({ text }: { text: string }) {
  return <div className="attachment-tags">{text.split(",").map(item => item.trim()).filter(Boolean).map(item => <span key={item}>{item}</span>)}</div>;
}

export const AttachedProfile = () => {
  const [basic, setBasic] = useState(sampleBasic);
  const [general, setGeneral] = useState(sampleGeneral);
  const [letter, setLetter] = useState(sampleLetter);
  const [draftBasic, setDraftBasic] = useState(sampleBasic);
  const [draftGeneral, setDraftGeneral] = useState(sampleGeneral);
  const [draftLetter, setDraftLetter] = useState(sampleLetter);
  const [editor, setEditor] = useState<Editor>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState("");
  const [cvDate, setCvDate] = useState("01/08/2026");
  const [fileError, setFileError] = useState("");
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!cv) return;
    const url = URL.createObjectURL(cv);
    setCvUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [cv]);
  useEffect(() => {
    if (editor) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [editor]);

  const startEdit = (section: Editor) => {
    setDraftBasic({ ...basic }); setDraftGeneral({ ...general }); setDraftLetter(letter);
    setEditor(section);
  };
  const chooseCV = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!/\.(pdf|doc|docx)$/i.test(file.name)) { setFileError("Vui lòng chọn tệp .pdf, .doc hoặc .docx."); return; }
    if (file.size >= 3 * 1024 * 1024) { setFileError("Dung lượng CV phải dưới 3 MB."); return; }
    if (!file.size) { setFileError("Tệp đang trống. Vui lòng chọn một CV khác."); return; }
    setCv(file); setCvDate(new Date().toLocaleDateString("vi-VN")); setFileError("");
    setNotice("Đã chọn CV mới cho hồ sơ.");
  };
  const saveSection = () => {
    if (editor === "basic") setBasic(draftBasic);
    if (editor === "general") setGeneral(draftGeneral);
    if (editor === "letter") setLetter(draftLetter);
    setEditor(null); setNotice("Đã cập nhật nội dung hồ sơ.");
  };
  const editButton = (section: Editor, label: string) => <button type="button" className="attachment-edit" aria-label={label} onClick={() => startEdit(section)}><FiEdit aria-hidden="true" /></button>;
  const basicFields: { key: keyof typeof sampleBasic; label: string; type?: string }[] = [
    { key: "fullName", label: "Họ tên" }, { key: "title", label: "Chức danh" },
    { key: "email", label: "Email", type: "email" }, { key: "phone", label: "Số điện thoại", type: "tel" },
    { key: "birthday", label: "Ngày sinh", type: "date" }, { key: "gender", label: "Giới tính" },
    { key: "address", label: "Địa điểm" }, { key: "linkedin", label: "LinkedIn / website" },
  ];
  const generalFields: { key: keyof typeof sampleGeneral; label: string }[] = [
    { key: "experience", label: "Tổng số năm kinh nghiệm" }, { key: "level", label: "Cấp bậc hiện tại" },
    { key: "education", label: "Học vấn" }, { key: "major", label: "Chuyên ngành" },
    { key: "skills", label: "Kỹ năng" }, { key: "workingForms", label: "Hình thức làm việc mong muốn" },
    { key: "industries", label: "Lĩnh vực đã làm việc" }, { key: "salary", label: "Mức lương mong muốn" },
    { key: "languages", label: "Ngoại ngữ" }, { key: "availability", label: "Thời gian có thể bắt đầu" },
  ];
  const cvName = cv?.name || "DoMinhKhoi_Fullstack_Developer_Resume.pdf";

  return <main className="attached-profile">
    <div className="attachment-container">
      <Link href="/" className="attachment-back"><FiArrowLeft aria-hidden="true" /> Trang chủ</Link>
      <div className="attachment-page-heading"><div><h1>Hồ sơ đính kèm</h1><p>Giới thiệu bản thân và năng lực của bạn với nhà tuyển dụng.</p></div><span className="attachment-sample">Hồ sơ mẫu</span></div>
      <p className="attachment-notice" role="status" aria-live="polite">{notice}</p>

      <section className="attachment-card" aria-labelledby="basic-heading">
        {editButton("basic", "Chỉnh sửa thông tin cơ bản")}
        <div className="attachment-person"><div className="attachment-avatar" aria-hidden="true">MK</div><div><h2 id="basic-heading">{basic.fullName}</h2><p>{basic.title}</p></div></div>
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
        <div className="attachment-cv-file"><span className="attachment-file-icon"><FiFileText aria-hidden="true" /></span><div className="attachment-file-info"><button type="button" onClick={() => startEdit("preview")}>{cvName}</button><p>Cập nhật lần cuối: {cvDate}{cv && ` · ${(cv.size / 1024).toFixed(0)} KB`}</p></div><button type="button" className="attachment-edit" aria-label="Xem CV" onClick={() => startEdit("preview")}><FiEye aria-hidden="true" /></button></div>
        <div className="attachment-upload-row"><input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="attachment-file-input" aria-label="Chọn CV cá nhân" onChange={chooseCV} /><button type="button" className="attachment-outline" onClick={() => fileRef.current?.click()}><FiUpload aria-hidden="true" />{cv ? "Thay CV khác" : "Tải CV lên"}</button><span>Chỉ giữ một CV. Tệp mới sẽ thay thế tệp hiện tại.</span></div>
        <p className="attachment-help">Hỗ trợ .doc, .docx hoặc .pdf, dưới 3 MB. Vui lòng sử dụng tệp không có mật khẩu bảo vệ.</p>
        {fileError && <p className="attachment-error" role="alert">{fileError}</p>}
      </section>

      <section className="attachment-card" aria-labelledby="general-heading">
        <div className="attachment-section-heading"><h2 id="general-heading">Thông tin chung</h2>{editButton("general", "Chỉnh sửa thông tin chung")}</div>
        <dl className="attachment-general">{generalFields.map(field => <div key={field.key}><dt>{field.label}</dt><dd>{["skills", "workingForms", "industries", "languages"].includes(field.key) ? <Tags text={general[field.key]} /> : general[field.key]}</dd></div>)}</dl>
      </section>

      <section className="attachment-card" aria-labelledby="letter-heading">
        <div className="attachment-section-heading"><h2 id="letter-heading">Thư giới thiệu bản thân</h2>{editButton("letter", "Chỉnh sửa thư giới thiệu")}</div>
        <div className="attachment-letter">{letter || "Thêm một vài dòng giới thiệu về bạn và định hướng nghề nghiệp."}</div>
      </section>

      <dialog ref={dialogRef} className={`attachment-dialog ${editor === "preview" ? "attachment-dialog-preview" : ""}`} onClose={() => setEditor(null)} onClick={event => { if (event.target === event.currentTarget) setEditor(null); }} aria-labelledby="attachment-dialog-title">
        <div className="attachment-dialog-heading"><h2 id="attachment-dialog-title">{editor === "basic" ? "Thông tin cơ bản" : editor === "general" ? "Thông tin chung" : editor === "letter" ? "Thư giới thiệu bản thân" : "Xem CV"}</h2><button type="button" className="attachment-edit" aria-label="Đóng" onClick={() => setEditor(null)}><FiX aria-hidden="true" /></button></div>
        {editor === "preview" ? <div className="attachment-preview">
          {cv && cvUrl ? <>{/\.pdf$/i.test(cv.name) ? <iframe src={cvUrl} title="Bản xem trước CV cá nhân" /> : <p>Tệp Word đã được chọn. Tải tệp xuống để xem bằng ứng dụng hỗ trợ.</p>}<a className="attachment-outline" href={cvUrl} download={cv.name}><FiDownload aria-hidden="true" />Tải CV xuống</a></> : <article className="attachment-resume"><span className="attachment-eyebrow">Bản xem trước CV mẫu</span><h3>{basic.fullName}</h3><p>{basic.title}</p><p>{basic.email} · {basic.phone}</p><hr /><h4>Giới thiệu</h4><p>Lập trình viên Full-stack với định hướng xây dựng ứng dụng web hiện đại, có khả năng làm việc với ReactJS, Next.js và Node.js.</p><h4>Học vấn</h4><p>{general.education}<br />{general.major}</p><h4>Kỹ năng</h4><Tags text={general.skills} /><h4>Dự án tiêu biểu</h4><p><strong>ITcareer — Nền tảng tuyển dụng IT</strong><br />Xây dựng giao diện tìm kiếm việc làm, hồ sơ ứng viên và trang quản lý dành cho nhà tuyển dụng.</p></article>}
        </div> : <form onSubmit={event => { event.preventDefault(); saveSection(); }}>
          <div className="attachment-form-grid">
            {editor === "basic" && basicFields.map(field => <label key={field.key}>{field.label}<input type={field.type || "text"} required value={draftBasic[field.key]} onChange={event => setDraftBasic({ ...draftBasic, [field.key]: event.target.value })} /></label>)}
            {editor === "general" && generalFields.map(field => <label key={field.key}>{field.label}<input value={draftGeneral[field.key]} onChange={event => setDraftGeneral({ ...draftGeneral, [field.key]: event.target.value })} />{["skills", "industries", "workingForms", "languages"].includes(field.key) && <small>Phân cách các mục bằng dấu phẩy.</small>}</label>)}
            {editor === "letter" && <label className="attachment-form-wide">Nội dung thư giới thiệu<textarea rows={12} maxLength={5000} value={draftLetter} onChange={event => setDraftLetter(event.target.value)} /><small>{draftLetter.length}/5.000 ký tự</small></label>}
          </div>
          <div className="attachment-dialog-actions"><button type="button" className="attachment-outline" onClick={() => setEditor(null)}>Hủy</button><button type="submit" className="attachment-primary"><FiCheck aria-hidden="true" />Lưu thay đổi</button></div>
        </form>}
      </dialog>
    </div>
  </main>;
};
