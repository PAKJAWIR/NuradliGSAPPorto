// utils/scrollLock.js

let scrollPosition = 0;

export function lockScroll() {
  if (typeof document !== "undefined") {
    scrollPosition = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }
}

export function unlockScroll() {
  if (typeof document !== "undefined") {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    window.scrollTo(0, scrollPosition);
  }
}
