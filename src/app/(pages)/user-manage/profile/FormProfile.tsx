/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { FiCheck, FiMail, FiPhone, FiUser } from "react-icons/fi";
import JustValidate from "just-validate";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Toaster, toast } from "sonner";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export const FormProfile = () => {
  const { infoUser } = useAuth();
  const [avatars, setAvatars] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const validatorRef = useRef<InstanceType<typeof JustValidate> | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!infoUser) return;
    setAvatars(infoUser.avatar ? [{ source: infoUser.avatar }] : []);
    const validator = new JustValidate("#profileForm");
    validatorRef.current = validator;
    validator
      .addField("#fullName", [
        { rule: "required", errorMessage: "Vui lòng nhập họ tên!" },
        { rule: "minLength", value: 5, errorMessage: "Họ tên phải có ít nhất 5 ký tự!" },
        { rule: "maxLength", value: 50, errorMessage: "Họ tên không được vượt quá 50 ký tự!" },
      ])
      .addField("#email", [
        { rule: "required", errorMessage: "Vui lòng nhập email của bạn!" },
        { rule: "email", errorMessage: "Email không đúng định dạng!" },
      ]);
    return () => { validator.destroy(); validatorRef.current = null; };
  }, [infoUser]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;
    const values = new FormData(event.currentTarget);
    submittingRef.current = true;
    try {
      if (!await validatorRef.current?.revalidate()) return;
      setIsSaving(true);
      const formData = new FormData();
      formData.append("fullName", String(values.get("fullName") || ""));
      formData.append("email", String(values.get("email") || ""));
      formData.append("phone", String(values.get("phone") || ""));
      const avatar = avatars[0]?.file;
      if (avatar instanceof Blob) formData.append("avatar", avatar);
      const promise = fetch(process.env.NEXT_PUBLIC_API_URL + "/user/profile", {
        method: "PATCH", body: formData, credentials: "include",
      }).then(async response => {
        const data = await response.json();
        if (!response.ok || data.code !== "success") throw new Error(data.message || "Chưa thể cập nhật thông tin.");
        return data;
      });
      toast.promise(promise, {
        loading: "Đang lưu thông tin…",
        success: data => data.message || "Đã cập nhật thông tin cá nhân.",
        error: error => error.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
      await promise.catch(() => undefined);
    } finally { submittingRef.current = false; setIsSaving(false); }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      {infoUser ? (
        <form onSubmit={handleSubmit} id="profileForm" className="personal-profile-form" noValidate aria-busy={isSaving}>
          <section className="attachment-card personal-identity" aria-labelledby="identity-heading">
            <div className="personal-avatar">
              <FilePond
                name="avatar"
                allowMultiple={false}
                allowRemove={true}
                labelIdle='<span class="filepond--label-action">Chọn ảnh</span>'
                acceptedFileTypes={["image/*"]}
                files={avatars}
                onupdatefiles={setAvatars}
                imagePreviewHeight={120}
                stylePanelLayout="compact"
                stylePanelAspectRatio="1:1"
                disabled={isSaving}
                credits={false}
                labelFileTypeNotAllowed="Vui lòng chọn tệp ảnh"
                fileValidateTypeLabelExpectedTypes="Chỉ hỗ trợ định dạng ảnh"
              />
            </div>
            <div className="personal-identity-content">
              <span className="attachment-eyebrow">Ảnh đại diện</span>
              <h2 id="identity-heading">{infoUser.fullName}</h2>
              <span className="personal-role"><FiUser aria-hidden="true" />Ứng viên</span>
            </div>
          </section>

          <section className="attachment-card" aria-labelledby="contact-heading">
            <div className="personal-section-heading">
              <span className="personal-section-icon"><FiUser aria-hidden="true" /></span>
              <div><h2 id="contact-heading">Thông tin cơ bản</h2></div>
            </div>
            <fieldset disabled={isSaving} className="personal-fields">
              <div className="personal-field personal-field-wide">
                <label htmlFor="fullName">Họ tên <span aria-hidden="true">*</span></label>
                <div className="personal-input-wrap">
                  <FiUser aria-hidden="true" />
                  <input type="text" name="fullName" defaultValue={infoUser.fullName} id="fullName" autoComplete="name" placeholder="Nhập họ và tên" aria-required="true" />
                </div>
              </div>
              <div className="personal-field">
                <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
                <div className="personal-input-wrap">
                  <FiMail aria-hidden="true" />
                  <input type="email" name="email" defaultValue={infoUser.email} id="email" autoComplete="email" placeholder="Nhập địa chỉ email" aria-required="true" />
                </div>
              </div>
              <div className="personal-field">
                <label htmlFor="phone">Số điện thoại</label>
                <div className="personal-input-wrap">
                  <FiPhone aria-hidden="true" />
                  <input type="tel" name="phone" defaultValue={infoUser.phone || ""} id="phone" autoComplete="tel" placeholder="Nhập số điện thoại" />
                </div>
              </div>
            </fieldset>
            <div className="personal-save-row">
              <button type="submit" className="attachment-primary" disabled={isSaving}><FiCheck aria-hidden="true" />{isSaving ? "Đang lưu…" : "Lưu thay đổi"}</button>
            </div>
          </section>
        </form>
      ) : (
        <section className="attachment-card personal-empty">
          <span className="personal-section-icon"><FiUser aria-hidden="true" /></span>
          <h2>Thông tin tài khoản của bạn</h2>
          <p>Đăng nhập để xem và cập nhật thông tin cá nhân.</p>
          <Link href="/user/login?returnTo=%2Fuser-manage%2Fprofile" className="attachment-primary">Đăng nhập</Link>
        </section>
      )}
    </>
  );
};
