import { useEffect } from "react";

function FaviconSwitcher() {
  useEffect(() => {
    const defaultTitle = document.title;
    const defaultFavicon = document.querySelector("link[rel~='icon']")?.href || "/favicon.ico";
    const loveFavicon = "/favicon-love-16x16.png";
    const sadFavicon = "/favicon-please-16x16.png";

    let timeout;

    const setFavicon = (src) => {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = src;
    };

    const onVisibilityChange = () => {
      clearTimeout(timeout);

      if (document.hidden) {
        setFavicon(sadFavicon);
        document.title = "Come back...";
      } else {
        setFavicon(loveFavicon);
        document.title = "Welcome back!";
        timeout = setTimeout(() => {
          setFavicon(defaultFavicon);
          document.title = defaultTitle;
        }, 2000);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    setFavicon(defaultFavicon); // init

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return null;
}

export default FaviconSwitcher;
