"use client";

import { useEffect, useRef, useState } from "react";
import { FiCheck, FiEye, FiEyeOff, FiLock, FiShield, FiTrash2, FiX } from "react-icons/fi";

function PasswordField({ id, label, autoComplete }: { id: string; label: string; autoComplete: string }) {
  const [visible, setVisible] = useState(false);
  return <div className="settings-field">
    <label htmlFor={id}>{label}</label>
    <div className="settings-password">
      <FiLock aria-hidden="true" />
      <input id={id} name={id} type={visible ? "text" : "password"} autoComplete={autoComplete} placeholder={label} />
      <button type="button" aria-label={`${visible ? "Ẩn" : "Hiện"} ${label.toLowerCase()}`} aria-pressed={visible} onClick={() => setVisible(current => !current)}>
        {visible ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
      </button>
    </div>
  </div>;
}

// UI prototype: no API calls, persisted preferences, or account mutations.
export function Settings() {
  const [profileVisible, setProfileVisible] = useState(true);
  const deleteDialog = useRef<HTMLDialogElement>(null);
  const passwordDialog = useRef<HTMLDialogElement>(null);
  const [passwordOpen, setPasswordOpen] = useState(false);

  useEffect(() => {
    if (passwordOpen) passwordDialog.current?.showModal();
    else passwordDialog.current?.close();
  }, [passwordOpen]);

  return <>
    <section className="attachment-card" aria-labelledby="password-heading">
      <div className="settings-section-heading"><span className="settings-icon"><FiLock aria-hidden="true" /></span><h2 id="password-heading">Đổi mật khẩu</h2></div>
      <div className="settings-password-row"><p>Thay đổi mật khẩu để bảo vệ tài khoản của bạn.</p><button type="button" className="attachment-primary" onClick={() => setPasswordOpen(true)}><FiLock aria-hidden="true" />Đổi mật khẩu</button></div>
    </section>

    <section className="attachment-card" aria-labelledby="privacy-heading">
      <div className="settings-section-heading"><span className="settings-icon"><FiShield aria-hidden="true" /></span><h2 id="privacy-heading">Quyền riêng tư</h2></div>
      <div className="settings-privacy-row">
        <div><h3 id="profile-visibility-label">Cho phép nhà tuyển dụng xem Hồ sơ đính kèm</h3><p>Quản lý quyền hiển thị hồ sơ cá nhân của bạn.</p></div>
        <button type="button" role="switch" aria-checked={profileVisible} aria-labelledby="profile-visibility-label" className="settings-switch-control" onClick={() => setProfileVisible(current => !current)}>
          <span className={`settings-switch ${profileVisible ? "is-on" : ""}`} aria-hidden="true"><span /></span><span>{profileVisible ? "Bật" : "Tắt"}</span>
        </button>
      </div>
    </section>

    <section className="attachment-card" aria-labelledby="delete-heading">
      <div className="settings-section-heading"><span className="settings-icon"><FiTrash2 aria-hidden="true" /></span><h2 id="delete-heading">Xóa tài khoản</h2></div>
      <div className="settings-delete-row"><p>Tài khoản bị xóa vĩnh viễn sẽ không thể khôi phục. Hãy cân nhắc trước khi tiếp tục.</p><button type="button" className="settings-delete-button" onClick={() => deleteDialog.current?.showModal()}><FiTrash2 aria-hidden="true" />Xóa tài khoản</button></div>
    </section>

    <dialog ref={passwordDialog} className="attachment-dialog settings-password-dialog" aria-labelledby="password-dialog-title" onClose={() => setPasswordOpen(false)} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setPasswordOpen(false);
    }}>
      <div className="attachment-dialog-heading"><h2 id="password-dialog-title">Đổi mật khẩu</h2><button type="button" className="attachment-edit" aria-label="Đóng" onClick={() => setPasswordOpen(false)}><FiX aria-hidden="true" /></button></div>
      {passwordOpen && <form className="attachment-dialog-form" onSubmit={event => event.preventDefault()}>
        <div className="attachment-dialog-body">
          <div className="settings-password-fields">
            <PasswordField id="currentPassword" label="Mật khẩu hiện tại" autoComplete="current-password" />
            <PasswordField id="newPassword" label="Mật khẩu mới" autoComplete="new-password" />
            <PasswordField id="confirmPassword" label="Xác nhận mật khẩu mới" autoComplete="new-password" />
          </div>
          <p className="settings-help">Mật khẩu gồm ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.</p>
        </div>
        <div className="attachment-dialog-actions"><button type="button" className="attachment-outline" onClick={() => setPasswordOpen(false)}>Hủy</button><button type="submit" className="attachment-primary"><FiCheck aria-hidden="true" />Cập nhật</button></div>
      </form>}
    </dialog>

    <dialog ref={deleteDialog} className="attachment-dialog settings-delete-dialog" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description" onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) deleteDialog.current?.close();
    }}>
      <div className="attachment-dialog-heading"><h2 id="delete-dialog-title">Xóa tài khoản vĩnh viễn?</h2><button type="button" className="attachment-edit" aria-label="Đóng" onClick={() => deleteDialog.current?.close()}><FiX aria-hidden="true" /></button></div>
      <div className="settings-confirm-content"><span className="settings-warning-icon"><FiTrash2 aria-hidden="true" /></span><p id="delete-dialog-description">Bạn có chắc chắn muốn xóa tài khoản? Thông tin tài khoản và hồ sơ cá nhân sẽ bị xóa vĩnh viễn. Thao tác này không thể hoàn tác.</p></div>
      <div className="attachment-dialog-actions"><button type="button" className="attachment-outline" autoFocus onClick={() => deleteDialog.current?.close()}>Hủy</button><button type="button" className="settings-delete-button is-solid" onClick={() => deleteDialog.current?.close()}>Xóa vĩnh viễn</button></div>
    </dialog>
  </>;
}
