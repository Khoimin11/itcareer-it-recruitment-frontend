/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const useAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [infoUser, setInfoUser] = useState<any>();
  const [infoCompany, setInfoCompany] = useState<any>();
  const pathname = usePathname(); // Lấy URL hiện tại

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
      credentials: "include", // Gửi kèm cookie
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Auth check failed: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (controller.signal.aborted) return;

        if(data.code == "error") {
          setIsLogin(false);
          setInfoUser(null);
          setInfoCompany(null);
        }

        if(data.code == "success") {
          setIsLogin(true);

          if(data.infoUser) {
            setInfoUser(data.infoUser);
            setInfoCompany(null);
          }

          if(data.infoCompany) {
            setInfoCompany(data.infoCompany);
            setInfoUser(null);
          }
        }
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setIsLogin(false);
        setInfoUser(null);
        setInfoCompany(null);
      });

    return () => controller.abort();
  }, [pathname]);

  return { isLogin, infoUser, infoCompany };
}
