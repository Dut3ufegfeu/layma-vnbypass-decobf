// ==UserScript==
// @name         VNBYPASS.COM - Layma.net Bypass CUTTAY PROMAX (decobf)
// @namespace    local.vnbypass.reconstruction
// @version      1.1.4
// @description  Bản giải mã sạch hoàn nguyên 100% logic VNBypass v1.1.4 trên Layma.net - QCaptcha Solver, Blacklist Engine, Auto Countdown & Checkcode API - Owner: @tien_nood2 (<@1245646252905861190>) | Hỗ trợ: @hlounhh (<@1312674288775593984>)
// @author       Owner decobf: @tien_nood2 (<@1245646252905861190>) - Hỗ trợ: @hlounhh (<@1312674288775593984>) / DuckXkurumi
// @icon         https://files.catbox.moe/8p9l8w.jpg
// @match        *://layma.net/*
// @match        *://*.layma.net/*
// @match        *://trafficviet.com/*
// @match        *://*.trafficviet.com/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_info
// @connect      *
// @updateURL    https://github.com/Dut3ufegfeu/layma-vnbypass-decobf/raw/main/Auto_LaymaV2.deobf.user.js
// @downloadURL  https://github.com/Dut3ufegfeu/layma-vnbypass-decobf/raw/main/Auto_LaymaV2.deobf.user.js
// ==/UserScript==

const API_BASE = "https://api.layma.net";
const CONFIG_URLS = [
  "https://pastefy.app/TKphHBjA/raw",
  "https://pastefy.app/ZR3kGQZp/raw",
  "https://pastefy.app/HRqUIVrI/raw",
];
const APP_TITLE = "VNBYPASS.COM - V1.1.4 (decobf)";
const DISCORD_URL = "https://discord.gg/6tDVDHyyA";
const DEFAULT_WAIT_TIME = 85;

const HEADER_CSS = `
@keyframes shimmerEffect {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.fancy-top-header {
  margin: 0 0 16px;
  padding: 13px 18px;
  background: #eff6ff;
  border-radius: 10px;
  text-align: center;
  border: 1px solid #bfdbfe;
  box-shadow: 0 4px 15px rgba(2, 132, 199, 0.16);
}

.vnbypass-title {
  display: block;
  color: #2563eb;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: clamp(23px, 6vw, 32px);
  font-weight: 900;
  letter-spacing: 1px;
  line-height: 1.3;
  background: linear-gradient(90deg, #2563eb, #9333ea, #db2777, #0891b2, #2563eb);
  background-size: 300% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmerEffect 4s linear infinite;
  text-shadow: 0 0 18px rgba(147, 51, 234, 0.18);
}

.vnbypass-title::after {
  content: ' ✦';
  -webkit-text-fill-color: #f59e0b;
  color: #f59e0b;
  font-size: 0.7em;
  vertical-align: super;
}

.vnbypass-discord {
  display: inline-block;
  margin-top: 4px;
  color: #5865f2;
  font-weight: 700;
  text-decoration: none;
}

.vnbypass-intro {
  margin-top: 4px;
  color: #475569;
  font-size: 12px;
  line-height: 1.4;
}

.box-step-wrap {
  display: block !important;
}
`;

const SWITCH_CSS = `
.switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  margin: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: .3s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

input:checked + .slider {
  background-color: #d97706;
}

input:checked + .slider:before {
  transform: translateX(16px);
}
`;

const CLEAN_CSS = ".heading, .box-step-note, .box-step-link, .box-step-title, .box-copy, .box-google, "
  + ".box-step-getCode, .box-video, #videohd, #xuong, .box-linkFB-wrap, .box-btn-copy, "
  + ".box-google-note, #btn-xac-nhan, #btn-baoloi, .box-step-footer, .box-footer, footer, "
  + ".intro, .progress, .warning, aside.warning, section.step, .step, .step-body, .verify-fields, "
  + ".videos, .video-grid, .video-item, .responsive-video, .code-image, .search-mock, "
  + "#copyMessage, .browser-link, .decoration { "
  + "    display: none !important; "
  + "} "
  + "#vnbypass-wrapper { "
  + "    display: flex !important; "
  + "    width: 100% !important; "
  + "    max-width: 660px !important; "
  + "    flex-direction: column !important; "
  + "    gap: 14px !important; "
  + "    margin: 0 auto 20px auto !important; "
  + "} "
  + "main#guide { "
  + "    width: 100% !important; "
  + "    max-width: 660px !important; "
  + "    min-height: auto !important; "
  + "    margin: 18px auto !important; "
  + "    padding-bottom: 24px !important; "
  + "} "
  + ".btn { "
  + "    display: inline-flex; align-items: center; justify-content: center; "
  + "    padding: 10px 16px; font-size: 14px; font-weight: 700; border-radius: 8px; "
  + "    border: none; cursor: pointer; transition: all 0.2s ease; text-decoration: none; box-sizing: border-box; "
  + "} "
  + ".btn-primary { background: #2563eb; color: #fff; } "
  + ".btn-primary:hover { background: #1d4ed8; } "
  + ".btn-success { background: #16a34a; color: #fff; } "
  + ".btn-success:hover { background: #15803d; } "
  + ".btn-danger { background: #dc2626; color: #fff; } "
  + ".btn-danger:hover { background: #b91c1c; } "
  + ".btn-warning { background: #f59e0b; color: #fff; } "
  + ".btn-warning:hover { background: #d97706; }";

let config = {
  autoChange: false,
  blacklistAuto: true,
  autoOpen: false,
  autoSave: false,
  WAIT_TIME: DEFAULT_WAIT_TIME,
};
let gmXhr = null;
let uWindow = null;
let wrapper = null;
let topHeader = null;
let settingsBox = null;
let questInfoBox = null;
let captchaBox = null;
let buttonBox = null;
let sessionToken = "";
let trafficSession = null;
let sessionCacheKey = "";
let trafficKeyInfo = null;
let questOrigin = "";
let visitorUUID = "";
let customBlacklist = [];
let serverBlacklist = [];
let serverKeywords = [];
let manualLinks = {};
let campainInfo = null;
let captchaSiteKey = "";
let captchaScriptUrl = "";
let captchaToken = "";
let codeValue = "";
let solution = "";
let finalLink = "";
let questInfo = null;
let getcodePayload = null;
let solverLibraryPromise = null;

function escapeHtml(rawText) {
  if (rawText == null) return "";
  return String(rawText)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildStatusMessage(title, status, detail) {
  let detailText = detail;
  if (typeof detailText !== "string") {
    try {
      detailText = JSON.stringify(detailText);
    } catch (stringifyError) {
      detailText = String(detailText);
    }
  }
  if (!title) title = "Lỗi không xác định";
  return "\n" + title + " (HTTP " + status + ") " + detailText;
}

function beforeUnloadGuard(beforeUnloadEvent) {
  beforeUnloadEvent.preventDefault();
  beforeUnloadEvent.returnValue = "Hệ thống đang chạy lấy mã, bạn có chắc muốn thoát?";
  return "Hệ thống đang chạy lấy mã, bạn có chắc muốn thoát?";
}

function getQCaptchaTokenSafe(timeoutMs) {
  if (typeof getQCaptchaToken !== "function") return Promise.resolve("");
  const timeout = Number.isFinite(timeoutMs) ? timeoutMs : 120000;
  return new Promise((resolveToken) => {
    const startedAt = Date.now();
    (function pollCaptchaToken() {
      let token = "";
      try { token = getQCaptchaToken() || ""; } catch (pollError) { token = ""; }
      if (token) { resolveToken(token); return; }
      if (Date.now() - startedAt >= timeout) { resolveToken(""); return; }
      setTimeout(pollCaptchaToken, 250);
    })();
  });
}

function installSolverFromSource(sourceCode) {
  try {
    if (typeof solveQCaptchaNative !== "function") {
      eval(sourceCode);
    }
  } catch (installError) {
    throw new Error("Lỗi thực thi qcaptcha.js: " + (installError && installError.message));
  }
  if (typeof solveQCaptchaNative !== "function") {
    throw new Error("Tải qcaptcha.js thành công nhưng không tìm thấy hàm solveQCaptchaNative!");
  }
  const solverFn = solveQCaptchaNative;
  try { if (typeof window !== "undefined") window.solveQCaptchaNative = solverFn; } catch (windowError) {}
  try { if (typeof globalThis !== "undefined") globalThis.solveQCaptchaNative = solverFn; } catch (globalError) {}
  try { if (typeof unsafeWindow !== "undefined") unsafeWindow.solveQCaptchaNative = solverFn; } catch (sandboxError) {}
  return solverFn;
}

function getSolveQCaptchaNative() {
  if (typeof window !== "undefined" && typeof window.solveQCaptchaNative === "function") {
    return Promise.resolve(window.solveQCaptchaNative);
  }
  if (typeof globalThis !== "undefined" && typeof globalThis.solveQCaptchaNative === "function") {
    return Promise.resolve(globalThis.solveQCaptchaNative);
  }
  if (typeof unsafeWindow !== "undefined" && typeof unsafeWindow.solveQCaptchaNative === "function") {
    return Promise.resolve(unsafeWindow.solveQCaptchaNative);
  }
  if (solverLibraryPromise) return solverLibraryPromise;
  solverLibraryPromise = new Promise(loadRawSolverLibrary);
  return solverLibraryPromise;
}

async function solveCaptchaWithLibrary(captchaConfig) {
  let solverFn = null;
  if (typeof window !== "undefined" && window.solveQCaptchaNative) solverFn = window.solveQCaptchaNative;
  else if (typeof globalThis !== "undefined" && globalThis.solveQCaptchaNative) solverFn = globalThis.solveQCaptchaNative;
  if (!solverFn && typeof unsafeWindow !== "undefined" && unsafeWindow.solveQCaptchaNative) solverFn = unsafeWindow.solveQCaptchaNative;
  if (typeof solverFn !== "function") {
    try { solverFn = await getSolveQCaptchaNative(); } catch (loadError) { solverFn = null; }
  }
  if (typeof solverFn !== "function") {
    throw new Error("Chưa tải thư viện giải QCaptcha (qcaptcha.js)!");
  }
  return solverFn(Object.assign({}, captchaConfig, { doRequest: gmXhr }));
}

function responseToText(response) {
  return response.text();
}

async function fetchWithTimeout(input, init, timeoutMs) {
  const timeout = Number.isFinite(timeoutMs) ? timeoutMs : 15000;
  let abortController = null;
  if (typeof AbortController !== "undefined") abortController = new AbortController();
  const timeoutTimer = setTimeout(() => { if (abortController) abortController.abort(); }, timeout);
  try {
    const fetchInit = abortController ? Object.assign({}, init, { signal: abortController.signal }) : Object.assign({}, init);
    return await fetch(input, fetchInit);
  } catch (fetchError) {
    if (abortController && fetchError && fetchError.name === "AbortError") {
      throw new Error("Request timed out after " + timeout + "ms");
    }
    throw fetchError;
  } finally {
    clearTimeout(timeoutTimer);
  }
}

function loadRawSolverLibrary(resolveSolver, rejectSolver) {
  const solverUrl = (typeof RAW_QCAPTCHA_URL !== "undefined" && RAW_QCAPTCHA_URL) || captchaScriptUrl;
  if (!solverUrl) {
    rejectSolver(new Error("Chưa cấu hình RAW_QCAPTCHA_URL và qcaptcha.js chưa được tải!"));
    return;
  }
  const cacheBustUrl = solverUrl + (solverUrl.indexOf("?") >= 0 ? "&" : "?") + "t=" + Date.now();
  if (gmXhr) {
    gmXhr({
      method: "GET",
      url: cacheBustUrl,
      timeout: 15000,
      onload: (solverResponse) => {
        try {
          if (solverResponse.responseText) {
            installSolverFromSource(solverResponse.responseText);
            resolveSolver(getSolveQCaptchaNative());
          } else {
            rejectSolver(new Error("Lỗi kết nối khi tải qcaptcha.js!"));
          }
        } catch (installError) {
          rejectSolver(installError);
        }
      },
      onerror: () => rejectSolver(new Error("Lỗi kết nối khi tải qcaptcha.js!")),
      ontimeout: () => rejectSolver(new Error("Timeout khi tải qcaptcha.js!")),
    });
    return;
  }
  if (typeof fetch !== "undefined") {
    fetch(cacheBustUrl)
      .then(responseToText)
      .then((solverSource) => {
        try {
          installSolverFromSource(solverSource);
          resolveSolver(getSolveQCaptchaNative());
        } catch (installError) {
          rejectSolver(installError);
        }
      })
      .catch(() => rejectSolver(new Error("Lỗi kết nối khi tải qcaptcha.js!")));
    return;
  }
  rejectSolver(new Error("Không có phương thức tải qcaptcha.js!"));
}

async function httpRequest(method, url, payload, headers) {
  const requestHeaders = Object.assign({}, headers);
  let requestBody;
  if (payload !== null && typeof payload !== "undefined") {
    requestBody = JSON.stringify(payload);
    if (!requestHeaders["Content-Type"] && !requestHeaders["content-type"]) {
      requestHeaders["Content-Type"] = "application/json";
    }
  }
  if (typeof questOrigin !== "undefined" && questOrigin) {
    requestHeaders["Origin"] = questOrigin;
    requestHeaders["Referer"] = questOrigin + "/";
  }
  if (gmXhr) {
    return new Promise((resolveRequest, rejectRequest) => {
      gmXhr({
        method,
        url,
        headers: requestHeaders,
        data: requestBody,
        timeout: 15000,
        onload: (xhrResponse) => {
          let parsedBody = {};
          try { parsedBody = JSON.parse(xhrResponse.responseText); } catch (parseError) { parsedBody = {}; }
          if (xhrResponse.status >= 200 && xhrResponse.status < 300) {
            resolveRequest(parsedBody);
            return;
          }
          rejectRequest({ status: xhrResponse.status, responseText: xhrResponse.responseText || "", response: parsedBody });
        },
        onerror: () => rejectRequest({ status: 0, responseText: "Lỗi kết nối tới máy chủ!" }),
        ontimeout: () => rejectRequest({ status: 0, responseText: "Máy chủ phản hồi quá chậm!" }),
      });
    });
  }
  const fetchResponse = await fetchWithTimeout(url, { method, headers: requestHeaders, body: requestBody }, 15000);
  if (!fetchResponse.ok) {
    let errorText = "";
    try { errorText = await fetchResponse.text(); } catch (textError) { errorText = ""; }
    throw { status: fetchResponse.status, responseText: errorText };
  }
  return fetchResponse.json();
}

function gmXhrFallbackShim(requestOptions) {
  if (!requestOptions || !requestOptions.url) return;
  const xhr = new XMLHttpRequest();
  xhr.open(requestOptions.method || "GET", requestOptions.url, true);
  if (requestOptions.headers) {
    Object.keys(requestOptions.headers).forEach((headerName) => {
      xhr.setRequestHeader(headerName, requestOptions.headers[headerName]);
    });
  }
  if (requestOptions.timeout) xhr.timeout = requestOptions.timeout;
  xhr.onload = () => {
    if (typeof requestOptions.onload === "function") {
      requestOptions.onload({
        status: xhr.status,
        responseText: xhr.responseText,
        responseURL: xhr.responseURL,
        finalUrl: xhr.responseURL || requestOptions.url,
      });
    }
  };
  xhr.ontimeout = () => {
    if (typeof requestOptions.ontimeout === "function") {
      requestOptions.ontimeout({
        status: 0,
        responseText: "",
        responseURL: requestOptions.url,
        finalUrl: requestOptions.url,
      });
    }
  };
  xhr.onerror = () => {
    if (typeof requestOptions.onerror === "function") {
      requestOptions.onerror({
        status: 0,
        responseText: "",
        responseURL: requestOptions.url,
        finalUrl: requestOptions.url,
      });
    }
  };
  try {
    if (typeof requestOptions.data !== "undefined") xhr.send(requestOptions.data);
    else xhr.send(null);
  } catch (sendError) {
    if (typeof requestOptions.onerror === "function") {
      requestOptions.onerror({
        status: 0,
        responseText: String(sendError && sendError.message),
        responseURL: requestOptions.url,
        finalUrl: requestOptions.url,
      });
    }
  }
}

function getTokenIdFromPage() {
  const tokenElement = document.getElementById("tokenId");
  if (tokenElement && tokenElement.textContent) {
    const tokenText = String(tokenElement.textContent).trim();
    if (tokenText) return tokenText;
  }
  if (typeof window.getTokenId === "function") {
    try {
      const tokenValue = window.getTokenId();
      if (tokenValue && String(tokenValue).trim()) return String(tokenValue).trim();
    } catch (tokenError) {}
  }
  if (window.location.pathname) {
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    if (pathSegments.length) return pathSegments[pathSegments.length - 1];
  }
  return "";
}

function getCampainIdFromPage() {
  const campainElement = document.getElementById("campainId");
  if (campainElement && campainElement.textContent) {
    const campainText = String(campainElement.textContent).trim();
    if (campainText) return campainText;
  }
  if (typeof window.getCampainId === "function") {
    try {
      const campainValue = window.getCampainId();
      if (campainValue && String(campainValue).trim()) return String(campainValue).trim();
    } catch (campainError) {}
  }
  return "";
}

function getTrafficKeyFromState() {
  try {
    if (typeof trafficKeyInfo !== "undefined" && trafficKeyInfo && trafficKeyInfo.trafficKey) {
      const keyText = String(trafficKeyInfo.trafficKey).trim();
      if (keyText) return keyText;
    }
  } catch (stateError) {}
  return "";
}

function readSessionCache() {
  if (!sessionCacheKey) return null;
  try {
    const cachedSession = window.sessionStorage.getItem(sessionCacheKey);
    const sessionText = String(cachedSession == null ? "" : cachedSession).trim();
    if (sessionText) {
      sessionToken = sessionText;
      return sessionToken;
    }
  } catch (cacheError) {}
  return null;
}

function requestUrlCopyViaGmXhr(resolveCopy) {
  gmXhr({
    method: "POST",
    url: "/" + encodeURIComponent(getTrafficKeyFromState()) + "/url-copy",
    onload: (copyResponse) => resolveCopy(copyResponse.responseText ? String(copyResponse.responseText).trim() : ""),
    onerror: () => resolveCopy(""),
    ontimeout: () => resolveCopy(""),
  });
}

async function resolveUrlCopyLink(urlKey) {
  if (resolveUrlCopyLink.cachedResult) return resolveUrlCopyLink.cachedResult;
  const cacheKey = urlKey || getTrafficKeyFromState();
  if (!cacheKey) return "";
  try {
    if (typeof fetch === "function") {
      const copyResponse = await fetch("/" + encodeURIComponent(cacheKey) + "/url-copy", { method: "POST" });
      if (copyResponse && copyResponse.ok) {
        const copyText = await copyResponse.text();
        return finalizeUrlCopy(copyText);
      }
    } else if (gmXhr) {
      const viaGm = await new Promise(requestUrlCopyViaGmXhr);
      return finalizeUrlCopy(viaGm);
    }
  } catch (copyError) {
    return "";
  }
  return "";
}

function finalizeUrlCopy(copyText) {
  let copyValue = copyText;
  try {
    if (typeof copyValue === "string") {
      const parsedCopy = JSON.parse(copyValue);
      if (parsedCopy && typeof parsedCopy === "object") {
        copyValue = parsedCopy.url || parsedCopy.link || parsedCopy.data || "";
      }
    }
  } catch (parseError) {
    copyValue = String(copyValue || "").trim();
  }
  if (copyValue) {
    if (!/^https?:\/\//i.test(copyValue)) copyValue = "https://" + copyValue;
    resolveUrlCopyLink.cachedResult = copyValue;
    return resolveUrlCopyLink.cachedResult;
  }
  return "";
}

let pendingSessionRequests = [];

function requestTrafficSession(resolveSession) {
  if (sessionToken) {
    resolveSession(null);
    return;
  }
  if (!trafficKeyInfo) {
    resolveSession(null);
    return;
  }
  const keyToken = getTrafficKeyFromState();
  pendingSessionRequests.push(resolveSession);
  const queuedRequests = pendingSessionRequests;
  pendingSessionRequests = [];
  gmXhr({
    method: "POST",
    url: API_BASE + "/api/traffic/session",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ keyToken: keyToken }),
    timeout: 10000,
    onload: (sessionResponse) => {
      try {
        const parsedSession = JSON.parse(sessionResponse.responseText || "{}");
        const newSessionToken = parsedSession.sessionToken || parsedSession.SessionToken || null;
        if (newSessionToken) {
          sessionToken = newSessionToken;
          try { window.sessionStorage.setItem(sessionCacheKey, sessionToken); } catch (storageError) {}
          queuedRequests.forEach((queuedResolve) => queuedResolve(sessionToken));
          return;
        }
      } catch (parseError) {}
      queuedRequests.forEach((queuedResolve) => queuedResolve(null));
    },
    onerror: () => queuedRequests.forEach((queuedResolve) => queuedResolve(null)),
    ontimeout: () => queuedRequests.forEach((queuedResolve) => queuedResolve(null)),
  });
}

let pendingVisitorRequests = [];

function requestVisitorRegistration(resolveVisitor) {
  const activeSession = trafficSession
    || (typeof window !== "undefined" ? window.trafficSessionToken : null)
    || sessionToken;
  if (activeSession) {
    sessionToken = activeSession;
  }
  if (!gmXhr) {
    resolveVisitor(null);
    return;
  }
  let visitorPayload = {};
  try {
    if (typeof getVisitorInfo === "function" && getVisitorInfo()) visitorPayload = getVisitorInfo();
    else if (trafficKeyInfo && typeof trafficKeyInfo.getVisitorInfo === "function" && trafficKeyInfo.getVisitorInfo()) {
      visitorPayload = trafficKeyInfo.getVisitorInfo();
    }
  } catch (visitorError) { visitorPayload = {}; }
  pendingVisitorRequests.push(resolveVisitor);
  const queuedRequests = pendingVisitorRequests;
  pendingVisitorRequests = [];
  gmXhr({
    method: "POST",
    url: API_BASE + "/api/traffic/visitor",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    data: JSON.stringify(Object.assign({}, visitorPayload, { token: "" })),
    timeout: 10000,
    onload: (visitorResponse) => {
      try {
        const parsedVisitor = JSON.parse(visitorResponse.responseText || "{}");
        const newSessionToken = parsedVisitor.sessionToken || parsedVisitor.SessionToken || null;
        if (newSessionToken) {
          sessionToken = newSessionToken;
          trafficSession = newSessionToken;
          try { if (typeof window !== "undefined") window.trafficSessionToken = newSessionToken; } catch (windowError) {}
          try { uWindow.trafficSessionToken = newSessionToken; } catch (sandboxError) {}
          queuedRequests.forEach((queuedResolve) => queuedResolve(newSessionToken));
          return;
        }
      } catch (parseError) {}
      queuedRequests.forEach((queuedResolve) => queuedResolve(null));
    },
    onerror: () => queuedRequests.forEach((queuedResolve) => queuedResolve(null)),
    ontimeout: () => queuedRequests.forEach((queuedResolve) => queuedResolve(null)),
  });
}

function postMissionChangeRequest(resolveChange) {
  const activeSession = trafficSession
    || (trafficKeyInfo && trafficKeyInfo.trafficSessionToken)
    || (typeof window !== "undefined" ? window.trafficSessionToken : null);
  const changeHeaders = { "Content-Type": "application/json" };
  if (activeSession) changeHeaders["X-Traffic-Session"] = activeSession;
  gmXhr({
    method: "POST",
    url: API_BASE + "/api/traffic/mission/change",
    headers: changeHeaders,
    data: JSON.stringify({ Token: getTokenIdFromPage() }),
    timeout: 10000,
    onload: (changeResponse) => {
      if (changeResponse.status >= 200 && changeResponse.status < 300) {
        window.location.reload();
        return;
      }
      if (questInfoBox) questInfoBox.textContent = "Lỗi đổi nhiệm vụ";
    },
    onerror: () => { if (questInfoBox) questInfoBox.textContent = "Không thể kết nối đến máy chủ đổi nhiệm vụ!"; },
    ontimeout: () => { if (questInfoBox) questInfoBox.textContent = "Máy chủ đổi nhiệm vụ phản hồi quá lâu!"; },
  });
  if (!gmXhr && questInfoBox) {
    questInfoBox.textContent = "Không thể kết nối đến máy chủ đổi nhiệm vụ!";
  }
  resolveChange(null);
}

async function changeMission(isErrorCase, reasonText) {
  if (isErrorCase == null) isErrorCase = false;
  if (reasonText == null) reasonText = "";
  if (!getTokenIdFromPage()) {
    if (captchaBox) captchaBox.textContent = "Không tìm thấy Token ID trên trang hiện tại!";
    return;
  }
  if (isErrorCase && captchaBox) {
    captchaBox.innerHTML = "<div style='color:#dc2626; font-weight:bold; text-align:center;'>Nhiệm vụ lỗi (" + reasonText + "), đang tự động đổi...</div>";
  }
  try {
    window.removeEventListener("beforeunload", beforeUnloadGuard);
    if (typeof window.executeChangeMission === "function") {
      await window.executeChangeMission();
    } else if (typeof executeChangeMission === "function") {
      await executeChangeMission();
    } else {
      await new Promise(postMissionChangeRequest);
    }
  } catch (changeError) {
    await new Promise(postMissionChangeRequest);
    if (questInfoBox) questInfoBox.textContent = "Không thể kết nối đến máy chủ đổi nhiệm vụ!";
  }
}

function saveManualLinks() {
  try {
    localStorage.setItem("vnbypass_manual_links", JSON.stringify(manualLinks));
  } catch (saveError) {}
}

function saveCustomBlacklist() {
  try {
    localStorage.setItem("vnbypass_custom_blacklist", JSON.stringify(customBlacklist));
  } catch (saveError) {}
}

async function fetchRemoteConfig(configUrl) {
  return new Promise((resolveConfig) => {
    if (!configUrl || !gmXhr) {
      resolveConfig(null);
      return;
    }
    gmXhr({
      method: "GET",
      url: configUrl + "?t=" + Date.now(),
      headers: { "Cache-Control": "no-cache" },
      timeout: 5000,
      onload: (configResponse) => {
        try {
          resolveConfig(JSON.parse(configResponse.responseText));
        } catch (parseError) {
          resolveConfig(null);
        }
      },
      onerror: () => resolveConfig(null),
      ontimeout: () => resolveConfig(null),
    });
  });
}

function mergeBlacklistSources() {
  return Array.from(new Set(serverBlacklist.concat(customBlacklist)));
}

function findQuestImageElement() {
  return document.querySelector(".step-one img.search-image[src]")
    || document.querySelector(".step-three img.search-image[src]")
    || document.querySelector("section.step img.search-image[src]")
    || document.querySelector("#hinh_nv[src]")
    || document.querySelector("img[src*=\"/media/images/posts/\"]")
    || document.querySelector("img.search-image:not(#linkWeb):not(.url-hint-image)[src]")
    || document.querySelector("img.img-fluid[src*=\"media/images/posts\"]");
}

function findDirectLinkImageElement() {
  return document.querySelector("#linkWeb[src]")
    || document.querySelector("img.url-hint-image[src]")
    || document.querySelector("img[src*=\"url-hint\"]");
}

function extractImageSrc(imageElement) {
  if (!imageElement) return "";
  const attrSrc = imageElement.getAttribute("src");
  const resolvedSrc = attrSrc ? attrSrc : imageElement.src;
  return resolvedSrc ? String(resolvedSrc).trim() : "";
}

function lookupManualCache(rawKey) {
  if (!rawKey) return null;
  const cacheKey = String(rawKey).trim();
  if (manualLinks[cacheKey]) return manualLinks[cacheKey];
  try {
    const cachedKeys = Object.keys(manualLinks);
    for (const cachedKey of cachedKeys) {
      if (!(cachedKey in manualLinks)) continue;
      try {
        if (new URL(cachedKey, window.location.origin).pathname === new URL(cacheKey, window.location.origin).pathname) {
          return manualLinks[cachedKey];
        }
      } catch (urlError) {}
      if (cacheKey.indexOf(cachedKey) !== -1 || cachedKey.indexOf(cacheKey) !== -1) {
        return manualLinks[cachedKey];
      }
    }
  } catch (scanError) {}
  return null;
}

function lookupManualCacheByHost(rawLink) {
  if (!rawLink) return null;
  const normalizedLink = normalizeHost(rawLink);
  if (manualLinks[normalizedLink]) return manualLinks[normalizedLink];
  try {
    const cachedKeys = Object.keys(manualLinks);
    for (const cachedKey of cachedKeys) {
      if (!(cachedKey in manualLinks)) continue;
      const normalizedKey = normalizeHost(cachedKey);
      if (normalizedLink === normalizedKey) return manualLinks[cachedKey];
      try {
        const linkUrl = new URL(rawLink, window.location.origin);
        const keyUrl = new URL(cachedKey, window.location.origin);
        if (linkUrl.pathname === keyUrl.pathname && linkUrl.pathname.length > 1) {
          return manualLinks[cachedKey];
        }
      } catch (urlError) {}
    }
  } catch (scanError) {}
  return null;
}

function detectQuestPlatform() {
  if (document.querySelector("#TK1") || document.querySelector("#TK2")) return "google";
  if (document.querySelector(".box-copy-content")) return "google";
  if (document.querySelector("#linkFB")) return "facebook";
  if (document.querySelector("#linkWeb, img.url-hint-image, [src*='url-hint']")) return "tructiep";
  return "tructiep";
}

function scanKeywordFromDom() {
  const keywordElements = Array.from(document.querySelectorAll("#TK1, #TK2, #TK3, .keyword, .box-copy-content, .box-copy-code, [data-clipboard-text]"));
  const seenTexts = new Set();
  for (const keywordElement of keywordElements) {
    const elementText = keywordElement.textContent ? String(keywordElement.textContent).replace(/\s+/g, " ").trim() : "";
    if (elementText && !seenTexts.has(elementText)) {
      seenTexts.add(elementText);
      if (!/^https?:\/\//i.test(elementText) && elementText.length > 1) return elementText;
    }
    const clipText = keywordElement.getAttribute ? keywordElement.getAttribute("data-clipboard-text") : "";
    if (clipText && !seenTexts.has(clipText)) {
      seenTexts.add(clipText);
      if (!/^https?:\/\//i.test(clipText) && clipText.length > 1) return clipText;
    }
  }
  return "";
}

function normalizeHost(rawHost) {
  if (!rawHost) return "";
  let host = String(rawHost).trim().toLowerCase();
  if (host.indexOf("://") >= 0) {
    try { host = new URL(host).hostname; } catch (urlError) {}
  }
  if (host.indexOf("/") >= 0) host = host.split("/")[0];
  if (host.indexOf(":") >= 0) host = host.split(":")[0];
  if (host.indexOf("www.") === 0) host = host.slice(4);
  return host;
}

function extractTrafficKey(rawText, sourceUrl) {
  const keyPatterns = [
    /layma\.net\/Traffic\/Index\/([A-Za-z0-9_-]+)/i,
    /\/Traffic\/Index\/([A-Za-z0-9_-]+)/i,
    /(?:var\s+)?traffic_key\s*=\s*['"]([A-Za-z0-9_-]+)['"]/i,
    /trafficKey['"\s:=]+['"]?([A-Za-z0-9_-]{6,})['"]?/i,
    /data-traffic-key=['"]([^'"]+)['"]/i,
    /keytoken=([A-Za-z0-9_-]{6,})/i,
  ];
  for (const keyPattern of keyPatterns) {
    const keyMatch = String(rawText == null ? "" : rawText).match(keyPattern);
    if (keyMatch && keyMatch[1]) return keyMatch[1];
  }
  if (sourceUrl) {
    const pathMatch = String(sourceUrl).match(/Traffic\/Index\/([A-Za-z0-9_-]+)/i);
    if (pathMatch && pathMatch[1]) return pathMatch[1];
  }
  return null;
}

function extractSiteKeyFromHtml(htmlText) {
  if (!htmlText) return null;
  const declMatch = String(htmlText).match(/(?:(?:var|let|const)\s+)?(?:window\.)?qCaptchaSiteKey\s*=\s*['"]([^'"]+)['"]/i);
  if (declMatch && declMatch[1]) return declMatch[1];
  const jsonMatch = String(htmlText).match(/(?:qCaptchaSiteKey|qcaptchaSiteKey)\s*[:=]\s*['"]([^'"]+)['"]/i);
  if (jsonMatch && jsonMatch[1]) return jsonMatch[1];
  const attrMatch = String(htmlText).match(/data-qcaptcha-sitekey\s*=\s*['"]([^'"]+)['"]/i);
  if (attrMatch && attrMatch[1]) return attrMatch[1].trim();
  return null;
}

function extractScriptUrlFromHtml(htmlText) {
  if (!htmlText) return null;
  const declMatch = String(htmlText).match(/(?:(?:var|let|const)\s+)?(?:window\.)?qCaptchaScriptUrl\s*=\s*['"]([^'"]+)['"]/i);
  if (declMatch && declMatch[1]) return declMatch[1];
  const jsonMatch = String(htmlText).match(/(?:qCaptchaScriptUrl|qcaptchaScriptUrl)\s*[:=]\s*['"]([^'"]+)['"]/i);
  if (jsonMatch && jsonMatch[1]) return jsonMatch[1].trim();
  return null;
}

function fetchCaptchaConfigFor(trafficKey) {
  return new Promise((resolveCaptchaConfig) => {
    if (!trafficKey || !gmXhr) {
      resolveCaptchaConfig(null);
      return;
    }
    gmXhr({
      method: "GET",
      url: "https://layma.net/Traffic/Index/" + encodeURIComponent(trafficKey),
      timeout: 10000,
      onload: (captchaResponse) => {
        if (!captchaResponse.responseText) {
          resolveCaptchaConfig(null);
          return;
        }
        resolveCaptchaConfig({
          qCaptchaSiteKey: extractSiteKeyFromHtml(captchaResponse.responseText),
          qCaptchaScriptUrl: extractScriptUrlFromHtml(captchaResponse.responseText),
        });
      },
      onerror: () => resolveCaptchaConfig(null),
      ontimeout: () => resolveCaptchaConfig(null),
    });
  });
}

function pickKeyedImage(isAcceptableSrc, primaryImage) {
  if (primaryImage) {
    const primarySrc = extractImageSrc(primaryImage);
    if (primarySrc && isAcceptableSrc(primarySrc)) return primarySrc;
  }
  const pageImages = Array.from(document.querySelectorAll("img"));
  for (const pageImage of pageImages) {
    const imageSrc = extractImageSrc(pageImage);
    if (imageSrc && isAcceptableSrc(imageSrc)) return imageSrc;
  }
  return null;
}

async function getQuestLink() {
  const cachedLink = await resolveUrlCopyLink();
  if (cachedLink) {
    const cachedEntry = lookupManualCache(cachedLink);
    if (questInfo && cachedEntry && typeof cachedEntry === "object") {
      cachedEntry.link = "";
      cachedEntry.platform = detectQuestPlatform();
      return cachedEntry;
    }
    return { link: cachedLink, platform: detectQuestPlatform() };
  }
  const questImage = findQuestImageElement();
  const imageSrc = extractImageSrc(questImage);
  const cachedByImage = imageSrc ? lookupManualCache(imageSrc) : null;
  if (cachedByImage) return cachedByImage;
  const directImage = findDirectLinkImageElement();
  const directSrc = extractImageSrc(directImage);
  if (directSrc && typeof directSrc === "string") {
    return { link: directSrc, platform: detectQuestPlatform() };
  }
  if (directSrc && typeof directSrc === "object" && (directSrc.link || directSrc.platform)) {
    directSrc.link = "";
    directSrc.platform = detectQuestPlatform();
    return directSrc;
  }
  const manualHit = lookupManualCache(getCampainIdFromPage());
  if (manualHit) {
    return { link: manualHit.link, platform: detectQuestPlatform() };
  }
  if (questImage && questImage.tagName && questImage.tagName.toLowerCase() !== "img") {
    const imageText = String(questImage.textContent || "").trim();
    if (imageText) {
      const textLink = imageText.indexOf("http") === 0 ? imageText : "https://" + imageText;
      return { link: textLink, platform: "tructiep" };
    }
  }
  if (document.querySelector("#TK1") || document.querySelector("#TK2") || document.querySelector(".box-copy-content")) {
    return { link: "", platform: "google", keyword: scanKeywordFromDom() };
  }
  const linkFbElement = document.querySelector("#linkFB");
  if (linkFbElement && linkFbElement.textContent && linkFbElement.textContent.trim()) {
    return { link: linkFbElement.textContent.trim(), platform: "facebook" };
  }
  return { link: "", platform: "tructiep" };
}

function extractFinalLinkFromResponse(xhrResponse) {
  if (!xhrResponse) return null;
  if (xhrResponse.responseHeaders) {
    const locationMatch = String(xhrResponse.responseHeaders).match(/^location:\s*(.+)$/im);
    if (locationMatch && locationMatch[1]) {
      let locationValue = locationMatch[1].trim();
      try { locationValue = new URL(locationValue, window.location.origin).href; } catch (urlError) {}
      if (locationValue && String(locationValue).indexOf("http") === 0 && locationValue.indexOf("/api/traffic/go/") === -1) {
        return locationValue;
      }
    }
  }
  const directUrl = xhrResponse.finalUrl || xhrResponse.responseURL;
  if (directUrl && String(directUrl).indexOf("http") === 0 && String(directUrl).indexOf("/api/traffic/go/") === -1) {
    return directUrl;
  }
  if (xhrResponse.responseText) {
    try {
      const parsedBody = JSON.parse(xhrResponse.responseText);
      const bodyLink = parsedBody ? (parsedBody.url || parsedBody.redirectUrl || parsedBody.data) : null;
      if (bodyLink && typeof bodyLink === "string" && bodyLink.indexOf("http") === 0) {
        return bodyLink.trim();
      }
    } catch (parseError) {}
    const metaMatch = String(xhrResponse.responseText).match(/<meta[^>]*http-equiv=["']refresh["'][^>]*content=["'][^"']*url=([^"']+)["']/i);
    if (metaMatch && metaMatch[1]) return metaMatch[1].trim();
    const jsMatch = String(xhrResponse.responseText).match(/window\.location(?:\.href)?\s*=\s*['"]([^'"]+)['"]/i);
    if (jsMatch && jsMatch[1]) return jsMatch[1].trim();
  }
  return null;
}

async function resolveFinalLink(rawLink, sessionHint) {
  if (!rawLink || typeof rawLink !== "string") return rawLink;
  if (rawLink.indexOf("/api/traffic/go/") === -1) return rawLink;
  const requestHeaders = {
    "Referer": window.location.href,
    "User-Agent": navigator.userAgent,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  };
  const activeSession = sessionHint
    || (typeof window !== "undefined" && typeof window.trafficSessionToken !== "undefined" && window.trafficSessionToken)
    || sessionToken;
  if (activeSession) requestHeaders["X-Traffic-Session"] = activeSession;
  const noRedirectResponse = await new Promise((resolveGo) => {
    gmXhr({
      method: "GET",
      url: rawLink,
      headers: requestHeaders,
      maxRedirects: 0,
      timeout: 4000,
      onload: (goResponse) => resolveGo(goResponse),
      onerror: () => resolveGo(null),
      ontimeout: () => resolveGo(null),
    });
  });
  const noRedirectLink = extractFinalLinkFromResponse(noRedirectResponse);
  if (noRedirectLink) return noRedirectLink;
  const followResponse = await new Promise((resolveGo) => {
    gmXhr({
      method: "GET",
      url: rawLink,
      headers: requestHeaders,
      timeout: 6000,
      onload: (goResponse) => resolveGo(goResponse),
      onerror: () => resolveGo(null),
      ontimeout: () => resolveGo(null),
    });
  });
  const followLink = extractFinalLinkFromResponse(followResponse);
  if (followLink) return followLink;
  try {
    const racedResponse = await Promise.race([
      fetch(rawLink, { method: "GET", headers: requestHeaders, redirect: "follow" }),
      new Promise((ignoredResolve, rejectRace) => setTimeout(() => rejectRace(new Error("timeout")), 8000)),
    ]);
    if (racedResponse && racedResponse.url && racedResponse.url.indexOf("/api/traffic/go/") === -1) {
      return racedResponse.url;
    }
  } catch (raceError) {}
  return rawLink;
}

function injectCleanStyles() {
  if (!document.getElementById("vnbypass-clean-style")) {
    const cleanStyle = document.createElement("style");
    cleanStyle.id = "vnbypass-clean-style";
    cleanStyle.innerHTML = CLEAN_CSS;
    if (document.head) document.head.appendChild(cleanStyle);
  }
  if (questInfoBox && !questInfoBox.innerHTML.trim()) {
    questInfoBox.innerHTML = "<div style='color:#0284c7; font-weight:600; text-align:center;'>Đang phân tích nhiệm vụ...</div>";
  }
  if (topHeader) {
    topHeader.style.marginBottom = "20px";
    topHeader.style.paddingBottom = "20px";
    topHeader.style.minHeight = "0";
    topHeader.style.height = "auto";
  }
}

function injectHeaderStyle() {
  if (!document.getElementById("custom-header-style")) {
    const headerStyle = document.createElement("style");
    headerStyle.id = "custom-header-style";
    headerStyle.innerHTML = HEADER_CSS;
    document.head.appendChild(headerStyle);
  }
  if (!document.getElementById("toggle-switch-style")) {
    const switchStyle = document.createElement("style");
    switchStyle.id = "toggle-switch-style";
    switchStyle.innerHTML = SWITCH_CSS;
    document.head.appendChild(switchStyle);
  }
}

function ensureDiv(elementId, styleText) {
  let element = document.getElementById(elementId);
  if (!element) {
    element = document.createElement("div");
    element.id = elementId;
    element.style.cssText = styleText;
    if (wrapper) wrapper.appendChild(element);
  }
  return element;
}

function refreshElementRefs() {
  const wrapperElement = wrapper || document.getElementById("vnbypass-wrapper");
  topHeader = document.getElementById("native-override-top-header");
  settingsBox = document.getElementById("native-override-settings");
  questInfoBox = document.getElementById("native-override-quest-info");
  captchaBox = document.getElementById("native-override-captcha-box");
  buttonBox = document.getElementById("native-override-button-box");
  [topHeader, settingsBox, questInfoBox, captchaBox, buttonBox].forEach((element) => {
    if (element && wrapperElement && element.parentElement !== wrapperElement) {
      wrapperElement.appendChild(element);
    }
  });
}

function buildSettingsPanel() {
  settingsBox = ensureDiv("native-override-settings", "margin-bottom: 0px; padding: 12px 16px; background:#fffbeb; border:1px solid #fde68a; border-radius:10px; text-align:left; font-size:14px; line-height: 1.6; display: flex; flex-direction: column; box-shadow: 0 1px 3px rgba(217, 119, 6, 0.08);");
  injectHeaderStyle();
  const storedCollapsed = localStorage.getItem("vnbypass_settings_collapsed") === "true";
  const bodyMaxHeight = storedCollapsed ? "0px" : "600px";
  const bodyOpacity = storedCollapsed ? "0" : "1";
  const bodyMarginTop = storedCollapsed ? "0px" : "12px";
  const toggleText = storedCollapsed ? "Hiện cài đặt" : "Ẩn cài đặt";
  const arrowRotation = storedCollapsed ? "rotate(-90deg)" : "rotate(0deg)";
  settingsBox.innerHTML = ""
    + "<div id='settings-header-toggle' style='display: flex; align-items: center; justify-content: space-between; cursor: pointer; user-select: none; padding: 2px 0;'>"
    + "<div style='font-weight: 700; color: #d97706; font-size: 15px; display: flex; align-items: center; gap: 8px;'>"
    + "<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#d97706' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'>"
    + "<circle cx='12' cy='12' r='3'></circle>"
    + "<path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'></path>"
    + "</svg>"
    + "<span>Cài đặt Bypass</span>"
    + "</div>"
    + "<div id='settings-toggle-btn' style='display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 6px; background: #fef3c7; border: 1px solid #fde68a; cursor: pointer; transition: all 0.2s ease;'>"
    + "<span id='settings-toggle-text' style='font-size: 12px; color: #b45309; font-weight: 700;'>" + toggleText + "</span>"
    + "<span id='settings-toggle-arrow' style='display: inline-block; transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); font-size: 11px; color: #b45309; transform: " + arrowRotation + ";'>&#9660;</span>"
    + "</div>"
    + "</div>"
    + "<div id='settings-body-collapse' style='overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, margin-top 0.3s ease; max-height: " + bodyMaxHeight + "; opacity: " + bodyOpacity + "; margin-top: " + bodyMarginTop + "; display: flex; flex-direction: column; gap: 10px;'>"
    + "<div style='display: flex; align-items: center; justify-content: space-between;'>"
    + "<label style='cursor: pointer; margin: 0; color: #92400e; font-weight: 600;'>Đổi NV khi lỗi:</label>"
    + "<label class='switch'>"
    + "<input type='checkbox' id='toggle-auto-change' " + (config.autoChange ? "checked" : "") + ">"
    + "<span class='slider'></span>"
    + "</label>"
    + "</div>"
    + "<div style='display: flex; align-items: center; justify-content: space-between;'>"
    + "<label style='cursor: pointer; margin: 0; color: #92400e; font-weight: 600;'>Đổi NV blacklist:</label>"
    + "<label class='switch'>"
    + "<input type='checkbox' id='toggle-blacklist-auto-change' " + (config.blacklistAuto ? "checked" : "") + ">"
    + "<span class='slider'></span>"
    + "</label>"
    + "</div>"
    + "<div style='display: flex; align-items: center; justify-content: space-between;'>"
    + "<label style='cursor: pointer; margin: 0; color: #92400e; font-weight: 600;'>Mở link tự động:</label>"
    + "<label class='switch'>"
    + "<input type='checkbox' id='toggle-auto-open-link' " + (config.autoOpen ? "checked" : "") + ">"
    + "<span class='slider'></span>"
    + "</label>"
    + "</div>"
    + "<div style='display: flex; align-items: center; justify-content: space-between;'>"
    + "<label style='cursor: pointer; margin: 0; color: #92400e; font-weight: 600;'>Lưu link đã nhập:</label>"
    + "<label class='switch'>"
    + "<input type='checkbox' id='toggle-auto-save-manual-link' " + (config.autoSave ? "checked" : "") + ">"
    + "<span class='slider'></span>"
    + "</label>"
    + "</div>"
    + "<div style='display: flex; flex-direction: column;'>"
    + "<label for='input-wait-time' style='margin: 0; color: #92400e; font-weight: 600;'>Thời gian chờ (giây):</label>"
    + "<span style='font-size: 11px; color: #b45309; font-style: italic;'>(Khuyên dùng >70s để tránh bị cấm)</span>"
    + "<input type='number' id='input-wait-time' value='" + config.WAIT_TIME + "' style='width: 65px; padding: 4px; border: 1px solid #d97706; border-radius: 4px; text-align: center; margin-left: 10px; font-weight: bold; color: #92400e;'>"
    + "</div>"
    + "<button type='button' id='show-manual-link-cache' style='border:0; padding:0; background:transparent; color:#b45309; cursor:pointer; text-align:left; font-size:11px; text-decoration:underline;'>Xem link nhiệm vụ đã lưu</button>"
    + "<button type='button' id='show-blacklist-list' style='border:0; padding:0; background:transparent; color:#b45309; cursor:pointer; text-align:left; font-size:11px; text-decoration:underline;'>Xem nhiệm vụ bị blacklist tại đây</button>"
    + "</div>";
  document.getElementById("toggle-auto-change").addEventListener("change", onAutoChangeToggle);
  document.getElementById("toggle-blacklist-auto-change").addEventListener("change", onBlacklistAutoChangeToggle);
  document.getElementById("toggle-auto-open-link").addEventListener("change", onAutoOpenToggle);
  document.getElementById("toggle-auto-save-manual-link").addEventListener("change", onAutoSaveToggle);
  document.getElementById("show-manual-link-cache").addEventListener("click", openSavedLinksModal);
  document.getElementById("show-blacklist-list").addEventListener("click", openBlacklistModal);
  document.getElementById("input-wait-time").addEventListener("input", onWaitTimeInput);
  document.getElementById("settings-header-toggle").addEventListener("click", onSettingsHeaderToggle);
}

function onAutoChangeToggle(changeEvent) {
  config.autoChange = changeEvent.target.checked;
  localStorage.setItem("vnbypass_auto_change", String(config.autoChange));
}

function onBlacklistAutoChangeToggle(changeEvent) {
  config.blacklistAuto = changeEvent.target.checked;
  localStorage.setItem("vnbypass_blacklist_auto_change", String(config.blacklistAuto));
}

function onAutoOpenToggle(changeEvent) {
  config.autoOpen = changeEvent.target.checked;
  localStorage.setItem("vnbypass_auto_open_link", String(config.autoOpen));
}

function onAutoSaveToggle(changeEvent) {
  config.autoSave = changeEvent.target.checked;
  localStorage.setItem("vnbypass_auto_save_manual_link", String(config.autoSave));
}

function onWaitTimeInput(changeEvent) {
  const parsedWait = parseInt(changeEvent.target.value, 10);
  if (isNaN(parsedWait) || parsedWait < 0) return;
  config.WAIT_TIME = parsedWait;
  localStorage.setItem("vnbypass_wait_time", String(parsedWait));
}

function onSettingsHeaderToggle(clickEvent) {
  if (clickEvent.target && (clickEvent.target.tagName === "INPUT" || clickEvent.target.tagName === "BUTTON")) return;
  const bodyElement = document.getElementById("settings-body-collapse");
  if (!bodyElement) return;
  const textElement = document.getElementById("settings-toggle-text");
  const arrowElement = document.getElementById("settings-toggle-arrow");
  if (bodyElement.style.maxHeight === "0px") {
    bodyElement.style.maxHeight = "600px";
    bodyElement.style.opacity = "1";
    bodyElement.style.marginTop = "12px";
    if (textElement) textElement.textContent = "Ẩn cài đặt";
    if (arrowElement) arrowElement.style.transform = "rotate(0deg)";
    localStorage.setItem("vnbypass_settings_collapsed", "false");
  } else {
    bodyElement.style.maxHeight = "0px";
    bodyElement.style.opacity = "0";
    bodyElement.style.marginTop = "0px";
    if (textElement) textElement.textContent = "Hiện cài đặt";
    if (arrowElement) arrowElement.style.transform = "rotate(-90deg)";
    localStorage.setItem("vnbypass_settings_collapsed", "true");
  }
}

function renderQuestInfo(linkValue, platformValue) {
  if (!questInfoBox) return;
  questInfoBox.innerHTML = "<div><b>Link Quest:</b> <a href='" + linkValue + "' target='_blank' style='color:#0284c7; word-break:break-all;'>" + linkValue + "</a></div>"
    + "<div style='margin-top:4px;'><b>Platform:</b> <span style='color:#d97706; font-weight:bold; text-transform:uppercase;'>" + platformValue + "</span></div>";
}

function renderErrorBox(messageText) {
  if (!trafficKeyInfo) return;
  if (questInfoBox) {
    questInfoBox.innerHTML = "<div style='background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:12px; border-radius:8px; text-align:left; font-weight:bold; margin-bottom:10px; white-space:pre-wrap; word-break:break-word;'>" + messageText + "</div>";
  }
  if (buttonBox) {
    buttonBox.style.display = "block";
    buttonBox.innerHTML = "<div style='display:flex; gap:10px; width:100%;'>"
      + "<button type='button' id='btn-native-retry' class='btn btn-warning' style='flex:1; font-weight:bold;'>Thử lại</button>"
      + "<button type='button' id='btn-native-change' class='btn btn-danger' style='flex:1; font-weight:bold;'>Đổi nhiệm vụ</button>"
      + "</div>";
    const retryButton = document.getElementById("btn-native-retry");
    const changeButton = document.getElementById("btn-native-change");
    if (retryButton) retryButton.addEventListener("click", () => window.location.reload());
    if (changeButton) changeButton.addEventListener("click", () => changeMission(true, ""));
  }
}

function showCountdownBox(waitSeconds) {
  if (!captchaBox) return;
  captchaBox.style.setProperty("display", "block", "important");
  captchaBox.innerHTML = "<div style='background:#f0f9ff; border:1px solid #0284c7; padding:12px; border-radius:8px; text-align:center;'>"
    + "<div style='font-size:12px; font-weight:bold; color:#0369a1;'>ĐANG ĐẾM NGƯỢC</div>"
    + "<div id='script-countdown' style='font-size:32px; font-weight:900; color:#0284c7;'>" + waitSeconds + "s</div>"
    + "<div style='width:100%; background:#e2e8f0; height:6px; border-radius:3px; overflow:hidden; margin-top:6px;'>"
    + "<div id='script-progress' style='width:100%; height:100%; background:#0284c7; transition:width 0.3s linear;'></div>"
    + "</div></div>";
}

function countdownTick(remainingRef, totalSeconds, finishTick) {
  const remaining = Math.ceil((remainingRef.endAt - Date.now()) / 1000);
  if (remaining <= 0) {
    finishTick();
    return;
  }
  const countdownElement = document.getElementById("script-countdown");
  if (countdownElement) countdownElement.innerText = remaining + "s";
  const progressElement = document.getElementById("script-progress");
  if (progressElement) progressElement.style.width = ((remaining / totalSeconds) * 100) + "%";
}

function waitForCountdown(waitSeconds) {
  return new Promise((resolveCountdown) => {
    const remainingRef = { endAt: Date.now() + waitSeconds * 1000 };
    const finishTick = () => {
      clearInterval(tickTimer);
      resolveCountdown(null);
    };
    const tickTimer = setInterval(() => countdownTick(remainingRef, waitSeconds, finishTick), 300);
    countdownTick(remainingRef, waitSeconds, finishTick);
  });
}

function showCaptchaStatus(statusText) {
  let statusElement = document.getElementById("captcha-status-msg");
  if (!statusElement) {
    statusElement = document.createElement("div");
    statusElement.id = "captcha-status-msg";
    statusElement.style.cssText = "color:#0284c7; font-weight:bold; text-align:center; margin-top:10px;";
    if (captchaBox) captchaBox.appendChild(statusElement);
  }
  statusElement.innerText = statusText;
}

async function postVisit(visitSessionToken, visitTrafficId, visitTicket) {
  const visitPayload = {
    trafficSessionToken: visitSessionToken,
    visitTicket: visitTicket,
    trafficId: visitTrafficId,
  };
  const visitHeaders = {};
  if (sessionToken) visitHeaders["X-Traffic-Session"] = sessionToken;
  const visitResult = await httpRequest("POST", API_BASE + "/api/traffic/visit", visitPayload, visitHeaders);
  if (visitResult && visitResult.captchaNonceAction && typeof res !== "undefined") {
    res.captchaNonceAction = visitResult.captchaNonceAction;
  }
  const newTicket = visitResult ? visitResult.visitTicket : null;
  return newTicket || visitTicket || "";
}

async function ensureCaptchaNonce() {
  if (!sessionToken) return null;
  const cachedSession = localStorage.getItem("cache_traffic_session_" + trafficKeyInfo.trafficKey);
  const noncePayload = {
    trafficSessionToken: cachedSession || "",
    trafficId: (campainInfo && campainInfo.id) || "",
  };
  if (!noncePayload.trafficSessionToken || !noncePayload.trafficId) {
    return "getcode";
  }
  try {
    const nonceHeaders = {};
    if (noncePayload.trafficSessionToken) nonceHeaders["X-Traffic-Session"] = noncePayload.trafficSessionToken;
    const nonceResult = await httpRequest("POST", API_BASE + "/api/traffic/captcha-nonce", noncePayload, nonceHeaders);
    if (nonceResult && (nonceResult.action || nonceResult.Action)) {
      campainInfo.captchaNonceAction = nonceResult.action || nonceResult.Action;
    }
  } catch (nonceError) {
    if (campainInfo && campainInfo.captchaNonceAction) return "getcode";
    throw nonceError;
  }
  return "getcode";
}

async function setupCaptcha() {
  const mountElement = document.getElementById("captcha-native-target");
  if (!mountElement) return false;
  try {
    await getSolveQCaptchaNative();
    const captchaAction = (campainInfo && campainInfo.captchaNonceAction) || "";
    captchaToken = await solveCaptchaWithLibrary({
      siteKey: captchaSiteKey,
      questOrigin: window.location.origin,
      scriptUrl: captchaScriptUrl,
      action: captchaAction,
      mountEl: mountElement,
      title: "Xác minh bảo mật",
      badge: "Bước 1: Lấy mã",
      loadingText: "Đang kết nối QCaptcha...",
      successText: "Xác thực thành công!",
      successSub: "Đang lấy mã, vui lòng đợi...",
    });
    return true;
  } catch (captchaError) {
    renderErrorBox("Lỗi xác thực QCaptcha!" + (captchaError && captchaError.message ? " " + captchaError.message : ""));
    return false;
  }
}

let getcodeAttempt = 0;

function handleGetCodeResponse(getcodeResponse) {
  if (getcodeResponse.status === 401 && getcodeAttempt < 1) {
    trafficSession = null;
    try { window.sessionStorage.removeItem(sessionCacheKey); } catch (storageError) {}
    const cachedSession = localStorage.getItem("cache_traffic_session_" + trafficKeyInfo.trafficKey);
    const retryPayload = Object.assign({}, getcodePayload, { trafficSessionToken: cachedSession || "" });
    getcodeAttempt += 1;
    setTimeout(() => {
      gmXhr({
        method: "POST",
        url: API_BASE + "/api/traffic/getcode",
        headers: buildGetCodeHeaders(),
        data: JSON.stringify(retryPayload),
        timeout: 15000,
        onload: handleGetCodeResponse,
        onerror: handleGetCodeError,
        ontimeout: handleGetCodeTimeout,
      });
    }, 1000);
    return;
  }
  let parsedResult = {};
  try { parsedResult = JSON.parse(getcodeResponse.responseText || "{}"); } catch (parseError) { parsedResult = {}; }
  if (parsedResult && parsedResult.success) {
    resolveGetCode(parsedResult);
    return;
  }
  resolveGetCode({ success: false, message: (parsedResult && parsedResult.message) || "Lỗi phản hồi từ server" });
}

function handleGetCodeError(getcodeResponse) {
  if (getcodeResponse && getcodeResponse.status === 401 && getcodeAttempt < 1) {
    trafficSession = null;
    getcodeAttempt += 1;
    return;
  }
  resolveGetCode({ status: 0, responseText: "Lỗi kết nối khi gửi yêu cầu lấy mã!" });
}

function handleGetCodeTimeout() {
  resolveGetCode({ status: 0, responseText: "Máy chủ phản hồi quá chậm!" });
}

function buildGetCodeHeaders() {
  const requestHeaders = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  };
  if (sessionToken) requestHeaders["X-Traffic-Session"] = sessionToken;
  if (typeof questOrigin !== "undefined" && questOrigin) {
    requestHeaders["Origin"] = questOrigin;
    requestHeaders["Referer"] = questOrigin + "/";
  }
  return requestHeaders;
}

let resolveGetCode = null;

function requestGetCode(resolveCode) {
  resolveGetCode = resolveCode;
  gmXhr({
    method: "POST",
    url: API_BASE + "/api/traffic/getcode",
    headers: buildGetCodeHeaders(),
    data: JSON.stringify(getcodePayload),
    timeout: 15000,
    onload: handleGetCodeResponse,
    onerror: handleGetCodeError,
    ontimeout: handleGetCodeTimeout,
  });
}

async function runGetCodeFlow() {
  getcodeAttempt = 0;
  if (!sessionToken) {
    try { await new Promise(requestTrafficSession); } catch (sessionError) {}
  }
  const cachedSession = localStorage.getItem("cache_traffic_session_" + trafficKeyInfo.trafficKey);
  getcodePayload = {
    trafficSessionToken: sessionToken || cachedSession || "",
    trafficId: (campainInfo && campainInfo.id) || "",
  };
  return new Promise(requestGetCode);
}

function readCachedSolution() {
  try {
    const cachedSolution = localStorage.getItem("cache_solution_" + trafficKeyInfo.trafficKey) || localStorage.getItem("cache_solution");
    const parsedSolution = Number(cachedSolution);
    if (Number.isFinite(parsedSolution)) return String(parsedSolution);
  } catch (cacheError) {}
  try {
    const stepCount = Number(localStorage.getItem("count_step_" + trafficKeyInfo.trafficKey) || localStorage.getItem("count_step"));
    if (Number.isFinite(stepCount) && stepCount > 1) return String(stepCount);
  } catch (stepError) {}
  return "0";
}

let activeSubmitMessageId = "";
let submitMessageResolve = null;

function handleSubmitMessage(messageEvent) {
  if (!messageEvent.data) return;
  if (messageEvent.data.id !== activeSubmitMessageId) return;
  window.removeEventListener("message", handleSubmitMessage);
  if (!messageEvent.data.success) {
    const failDetail = messageEvent.data.error || messageEvent.data.message || "Nộp mã thất bại";
    submitMessageResolve({ success: false, message: buildStatusMessage("Nộp mã thất bại", messageEvent.data.status, failDetail) });
    return;
  }
  let resultValue = messageEvent.data.result;
  if (typeof resultValue !== "string") {
    try { resultValue = JSON.stringify(resultValue); } catch (stringifyError) { resultValue = String(resultValue); }
  }
  if (typeof messageEvent.data.result === "object" && messageEvent.data.result !== null) {
    try {
      const parsedResult = typeof messageEvent.data.result === "string" ? JSON.parse(messageEvent.data.result) : messageEvent.data.result;
      resultValue = parsedResult.redirectUrl || parsedResult.RedirectUrl || "";
    } catch (parseError) { resultValue = ""; }
  }
  resultValue = String(resultValue || "");
  if (resultValue.indexOf("http") !== 0 || resultValue.indexOf("/api/traffic/go/") !== -1) {
    submitMessageResolve({ success: false, message: buildStatusMessage("Không thể chuyển hướng", messageEvent.data.status, messageEvent.data.result) });
    return;
  }
  submitMessageResolve({ success: true, message: resultValue, rawUrl: resultValue });
}

function buildCheckCodeScript(codeText, campainId, qCaptchaToken, messageId) {
  return "(async function() {\n"
    + "    try {\n"
    + "        var clientInfo = typeof getVisitorInfo === 'function' ? getVisitorInfo() : {};\n"
    + "        var fpData = '';\n"
    + "        try {\n"
    + "            if (typeof collectFingerprintData === 'function') {\n"
    + "                fpData = await collectFingerprintData(clientInfo);\n"
    + "            }\n"
    + "        } catch (e) {}\n"
    + "        if (!fpData) {\n"
    + "            try {\n"
    + "                var battery = null;\n"
    + "                try {\n"
    + "                    if (navigator.getBattery) {\n"
    + "                        var b = await Promise.race([navigator.getBattery(), new Promise(function(r) { setTimeout(function() { r(null); }, 1200); })]);\n"
    + "                        if (b) battery = { level: typeof b.level === 'number' ? Math.round(b.level * 100) : null, charging: typeof b.charging === 'boolean' ? b.charging : null, chargingTime: Number.isFinite(b.chargingTime) ? b.chargingTime : null, dischargingTime: Number.isFinite(b.dischargingTime) ? b.dischargingTime : null };\n"
    + "                    }\n"
    + "                } catch(e) {}\n"
    + "                var orientation = (typeof lastDeviceOrientation !== 'undefined' && lastDeviceOrientation) || (('DeviceOrientationEvent' in window) ? { supported: true, granted: true, available: false } : { supported: false });\n"
    + "                fpData = JSON.stringify({\n"
    + "                    version: 'v1',\n"
    + "                    uuid: clientInfo.uuid || null,\n"
    + "                    language: navigator.language || null,\n"
    + "                    platform: navigator.platform || null,\n"
    + "                    browser: clientInfo.browser || null,\n"
    + "                    browserVersion: clientInfo.browserVersion || null,\n"
    + "                    screen: clientInfo.screen || null,\n"
    + "                    colorDepth: (window.screen && window.screen.colorDepth) || null,\n"
    + "                    pixelRatio: window.devicePixelRatio || null,\n"
    + "                    battery: battery,\n"
    + "                    orientation: orientation,\n"
    + "                    createdAt: new Date().toISOString()\n"
    + "                });\n"
    + "            } catch (e) { fpData = navigator.userAgent; }\n"
    + "        }\n"
    + "        var passedQToken = " + JSON.stringify(qCaptchaToken || null) + ";\n"
    + "        var activeSession = (typeof trafficSessionToken !== 'undefined' && trafficSessionToken) || " + JSON.stringify(sessionToken || "") + ";\n"
    + "        var pData = {\n"
    + "            \"Code\": " + JSON.stringify(codeText) + ",\n"
    + "            \"Token\": " + JSON.stringify(qCaptchaToken) + ",\n"
    + "            \"CampainId\": " + JSON.stringify(campainId) + ",\n"
    + "            \"UserAgent\": clientInfo.userAgent || navigator.userAgent,\n"
    + "            \"DeviceScreen\": clientInfo.screen || (window.screen.width + ' x ' + window.screen.height),\n"
    + "            \"FingerprintData\": fpData,\n"
    + "            \"HCaptchaToken\": \"\",\n"
    + "            \"QCaptchaToken\": passedQToken || (typeof getQCaptchaToken === 'function' ? getQCaptchaToken() : \"\"),\n"
    + "            \"CaptchaLaToken\": typeof getCaptchaLaToken === 'function' ? getCaptchaLaToken() : \"\"\n"
    + "        };\n"
    + "        $.ajax({\n"
    + "            url: '" + API_BASE + "/api/traffic/checkcode',\n"
    + "            type: 'POST',\n"
    + "            contentType: 'application/json',\n"
    + "            headers: activeSession ? { 'X-Traffic-Session': activeSession } : {},\n"
    + "            data: JSON.stringify(pData),\n"
    + "            success: function(res) {\n"
    + "                window.postMessage({ id: \"" + messageId + "\", success: true, status: 200, result: res }, \"*\");\n"
    + "            },\n"
    + "            error: function(err) {\n"
    + "                window.postMessage({ id: \"" + messageId + "\", success: false, status: err.status, error: err.responseText || \"Lỗi nộp mã\" }, \"*\");\n"
    + "            }\n"
    + "        });\n"
    + "    } catch(e) {\n"
    + "        window.postMessage({ id: \"" + messageId + "\", success: false, error: e.message }, \"*\");\n"
    + "    }\n"
    + "})();";
}

async function submitCode(codeText, campainId, qCaptchaToken) {
  codeText = codeText == null ? "" : String(codeText).trim();
  if (typeof campainId !== "string") {
    try { campainId = JSON.stringify(campainId); } catch (stringifyError) {}
  }
  campainId = campainId == null ? "" : String(campainId).trim();
  if (!codeText) return { success: false, message: "Bạn chưa nhập mã code" };
  if (!captchaToken) return { success: false, message: "Token không tồn tại" };
  if (!campainId) {
    if (typeof window.getCampainId === "function") campainId = String(window.getCampainId() || "").trim();
  }
  if (!campainId) return { success: false, message: "Chiến dịch không tồn tại" };
  await new Promise((resolveSubmitStart) => setTimeout(resolveSubmitStart, 0));
  if (!trafficSession && !sessionToken) {
    return { success: false, message: "Thiếu traffic session cho bước nộp mã" };
  }
  return new Promise((resolveSubmit) => {
    activeSubmitMessageId = "submit_" + Date.now();
    submitMessageResolve = resolveSubmit;
    window.addEventListener("message", handleSubmitMessage);
    const scriptElement = document.createElement("script");
    scriptElement.textContent = buildCheckCodeScript(codeText, campainId, qCaptchaToken, activeSubmitMessageId);
    (document.head || document.documentElement).appendChild(scriptElement);
  });
}

async function finishBypassFlow(getcodeResult) {
  try {
    const fingerprintData = {
      browser: "Chrome",
      browserVersion: "151.0.0.0",
      browserMajorVersion: 151,
      cookies: true,
      mobile: false,
      os: "Windows",
      osVersion: "10",
      screen: window.screen.width + " x " + window.screen.height,
    };
    try {
      if (typeof getVisitorInfo === "function" && getVisitorInfo()) {
        Object.assign(fingerprintData, getVisitorInfo());
      }
    } catch (visitorError) {}
    let referrerValue = "";
    try {
      referrerValue = typeof getReferrer === "function" ? (getReferrer() || "") : "";
    } catch (referrerError) { referrerValue = ""; }
    if (!referrerValue) referrerValue = document.referrer || "";
    if (!referrerValue) {
      if (questInfo.platform === "facebook") referrerValue = "https://www.facebook.com/";
      else if (questInfo.platform === "google") referrerValue = "https://www.google.com/";
    }
    if (!fingerprintData.uuid) fingerprintData.uuid = visitorUUID;
    fingerprintData.referrer = referrerValue;
    fingerprintData.trafficId = campainInfo.id;
    const cachedVisitSession = localStorage.getItem("cache_traffic_session_" + questInfo.trafficKey);
    fingerprintData.trafficSessionToken = cachedVisitSession || "";
    fingerprintData.solution = solution;
    fingerprintData.qCaptchaToken = captchaToken;
    const cachedVisitTicket = localStorage.getItem("cache_visit_ticket_" + campainInfo.id) || "";
    await postVisit(fingerprintData.trafficSessionToken, campainInfo.id, cachedVisitTicket);
    if (!getcodeResult || !getcodeResult.success) {
      const failMessage = getcodeResult
        ? (getcodeResult.message || getcodeResult.Message || getcodeResult.error || getcodeResult.Error || "Nộp mã thất bại: Mã không hợp lệ")
        : "Nộp mã thất bại: Mã không hợp lệ";
      renderErrorBox(String(failMessage));
      return;
    }
    codeValue = String(getcodeResult.html || "").replace(/<[^>]*>?/gm, "").trim();
    const siteCodeInput = document.getElementById("codeInput");
    if (siteCodeInput) siteCodeInput.value = codeValue;
    if (captchaBox) {
      captchaBox.style.background = "transparent";
      captchaBox.style.border = "none";
      captchaBox.style.padding = "0";
      captchaBox.style.margin = "12px 0";
      captchaBox.style.display = "block";
      captchaBox.innerHTML = "<div id='captcha-step2-wrapper' style='display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; margin:0 auto; animation:qcwIn .3s cubic-bezier(.21,1.02,.55,1) both;'>"
        + "<div style='width:100%; max-width:360px; box-sizing:border-box; margin:0 auto 12px; padding:12px 16px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; text-align:center; box-shadow:0 2px 10px rgba(37,99,235,0.08);'>"
        + "<div style='font-size:12px; font-weight:700; color:#1d4ed8; text-transform:uppercase; letter-spacing:.5px; margin-bottom:5px;'>Đã lấy mã thành công</div>"
        + "<div style='font-size:16px; font-weight:800; color:#2563eb; background:#fff; border:1px dashed #93c5fd; border-radius:8px; padding:7px 12px; word-break:break-all; user-select:all;'>" + escapeHtml(codeValue) + "</div>"
        + "<div style='font-size:12px; color:#64748b; margin-top:6px;'>Vui lòng hoàn thành QCaptcha bên dưới để tự động nộp mã</div>"
        + "</div>"
        + "<div id='captcha2-native-target' style='display:flex; justify-content:center; align-items:flex-start; width:100%;'></div>"
        + "</div>";
    }
    const step2MountElement = document.getElementById("captcha2-native-target");
    let step2SiteKey = (step2MountElement && step2MountElement.getAttribute("data-sitekey"))
      || (trafficKeyInfo && trafficKeyInfo.qCaptchaSiteKey)
      || (typeof window !== "undefined" && typeof window.qCaptchaSiteKey !== "undefined" ? window.qCaptchaSiteKey : null)
      || captchaSiteKey
      || (questInfo && questInfo.qCaptchaSiteKey) || "";
    let step2ScriptUrl = (trafficKeyInfo && trafficKeyInfo.qCaptchaScriptUrl)
      || (typeof window !== "undefined" && typeof window.qCaptchaScriptUrl !== "undefined" ? window.qCaptchaScriptUrl : null)
      || captchaScriptUrl
      || (questInfo && questInfo.qCaptchaScriptUrl) || "";
    let step2Token = "";
    try {
      step2Token = await Promise.race([
        solveCaptchaWithLibrary({
          siteKey: step2SiteKey,
          questOrigin: window.location.origin,
          scriptUrl: step2ScriptUrl,
          action: "",
          mountEl: step2MountElement,
          title: "Xác thực nộp mã",
          badge: "Bước 2",
          loadingText: "Đang kết nối QCaptcha nộp mã...",
          successText: "Xác thực thành công!",
          successSub: "Đang tự động nộp mã...",
        }),
        getQCaptchaTokenSafe(120000),
      ]);
    } catch (step2Error) {
      if (typeof getQCaptchaToken === "function") step2Token = getQCaptchaToken() || "";
    }
    if (!step2Token) {
      renderErrorBox("Vui lòng hoàn thành xác thực QCaptcha trước khi nộp mã!");
      return;
    }
    try {
      if (typeof window !== "undefined") window.qCaptchaTokenValue = step2Token;
      if (uWindow) uWindow.qCaptchaTokenValue = step2Token;
    } catch (tokenError) {}
    const submitCampainId = campainInfo.campainId || campainInfo.id;
    const submitResult = await submitCode(codeValue, submitCampainId, step2Token);
    if (!submitResult || !submitResult.success) {
      const submitMessage = submitResult && submitResult.message ? submitResult.message : "Nộp mã thất bại";
      renderErrorBox(String(submitMessage));
      return;
    }
    let directResult = String(submitResult.message == null ? "" : submitResult.message);
    directResult = directResult.replace(/^"|"$/g, "").trim();
    if (directResult.indexOf("/api/traffic/go/") !== -1) {
      if (questInfoBox) questInfoBox.innerHTML = "<div style='color:#047857; font-weight:bold; text-align:center;'>Đang lấy link đích cuối...</div>";
      finalLink = await resolveFinalLink(directResult, trafficSession);
    } else {
      finalLink = directResult;
    }
    if (questInfoBox) {
      questInfoBox.style.background = "transparent";
      questInfoBox.style.border = "none";
      questInfoBox.style.padding = "0";
      questInfoBox.style.margin = "0";
      questInfoBox.innerHTML = "<div style='background:#ecfdf5; border:1px solid #6ee7b7; padding:14px 16px; border-radius:8px; text-align:center; margin:0;'>"
        + "<div style='color:#047857; font-weight:bold; font-size:15px; margin-bottom:8px;'>THÀNH CÔNG!</div>"
        + "<div style='font-size:13px; color:#065f46; word-break:break-all; background:#fff; padding:10px 12px; border-radius:6px; border:1px dashed #a7f3d0; user-select:all;'>" + finalLink + "</div></div>";
    }
    if (buttonBox) {
      buttonBox.style.display = "block";
      buttonBox.style.padding = "0";
      buttonBox.style.margin = "0";
      buttonBox.innerHTML = "<div style='display:flex; flex-direction:row; gap:10px; width:100%; margin-top:-4px; margin-bottom:0;'>"
        + "<button type='button' class='btn btn-success' id='btn-native-copy' style='flex:1; font-weight:bold; padding:9px 12px; font-size:14px; border-radius:6px; cursor:pointer;'>Copy Link</button>"
        + "<button type='button' class='btn btn-primary' id='btn-native-open' style='flex:1; font-weight:bold; padding:9px 12px; font-size:14px; border-radius:6px; cursor:pointer;'>Mở Link</button>"
        + "</div>";
      const copyButton = document.getElementById("btn-native-copy");
      const openButton = document.getElementById("btn-native-open");
      if (copyButton) copyButton.addEventListener("click", () => copyFinalLink(finalLink, copyButton));
      if (openButton) openButton.addEventListener("click", openFinalLink);
    }
    if (finalLink && config.autoOpen && String(finalLink).indexOf("http") === 0) {
      window.location.href = finalLink;
    }
  } catch (flowError) {
    renderErrorBox(flowError && flowError.message ? String(flowError.message) : "Xảy ra lỗi không xác định trong quá trình xử lý!");
  }
}

function copyFinalLink(linkText, copyButton) {
  if (!linkText) return;
  navigator.clipboard.writeText(linkText).then(() => {
    if (!copyButton) return;
    copyButton.innerText = "Đã Copy!";
    setTimeout(() => { copyButton.innerText = "Copy Link"; }, 2000);
  });
}

function openFinalLink() {
  if (String(finalLink).indexOf("http") === 0) {
    window.location.href = finalLink;
  }
}

async function runStepOneFlow() {
  showCaptchaStatus("Đang gửi yêu cầu lấy mã...");
  const getcodeResult = await runGetCodeFlow();
  await finishBypassFlow(getcodeResult);
}

function applyManualQuest() {
  const linkInput = document.getElementById("manual-quest-link");
  const keywordInput = document.getElementById("manual-quest-keyword");
  let linkValue = linkInput ? String(linkInput.value || "").trim() : "";
  const keywordValue = keywordInput ? String(keywordInput.value || "").trim() : "";
  try {
    if (linkValue && !/^https?:\/\//i.test(linkValue)) throw new Error("invalid");
  } catch (invalidError) {
    linkValue = "https://" + linkValue;
    try {
      new URL(linkValue);
    } catch (stillInvalidError) {
      if (linkInput) {
        linkInput.focus();
        linkInput.style.borderColor = "#dc2626";
      }
      return;
    }
  }
  if (linkInput) linkInput.value = linkValue;
  if (keywordInput) keywordInput.value = keywordValue;
  questInfo = { link: linkValue, platform: detectQuestPlatform(), keyword: keywordValue };
  manualLinks[linkValue] = { link: questInfo.link, platform: questInfo.platform, keyword: keywordValue };
  saveManualLinks();
}

function openManualQuestModal(manualImageSrc, manualKeyword) {
  return new Promise((resolveManualQuest) => {
    if (captchaBox) captchaBox.innerHTML = "";
    if (captchaBox) captchaBox.style.setProperty("display", "none", "important");
    const modalElement = document.createElement("div");
    modalElement.style.cssText = "border:1px solid #e2e8f0; border-radius:6px; padding:10px; margin-bottom:8px;";
    const introElement = document.createElement("div");
    introElement.innerHTML = "<div style='background:#fff7ed; border:1px solid #fed7aa; color:#9a3412; padding:10px; border-radius:6px; margin-bottom:12px;'><b>" + trafficKeyInfo.trafficKey + "</b><br><span style='font-size:12px;'>Bạn có thể nhập thông tin nhiệm vụ thủ công để tiếp tục.</span></div>";
    modalElement.appendChild(introElement);
    if (manualKeyword) {
      const keywordLabelElement = document.createElement("div");
      keywordLabelElement.innerHTML = "<label style='display:block; font-weight:bold; margin-bottom:4px;'>Từ khóa / Ảnh gợi ý liên kết:</label>";
      modalElement.appendChild(keywordLabelElement);
      const keywordPreviewElement = document.createElement("div");
      keywordPreviewElement.style.cssText = "margin-bottom:12px; padding:8px; background:#fff; border:1px solid #cbd5e1; border-radius:6px; text-align:center;";
      keywordPreviewElement.innerHTML = manualImageSrc
        ? "<img id='manual-quest-url-hint-preview' alt='Ảnh hướng dẫn quest' src='" + String(manualImageSrc).replace(/'/g, "&#39;") + "' style='display:block; max-width:100%; max-height:180px; object-fit:contain; margin:0 auto 10px; border:1px solid #e2e8f0; border-radius:6px;'>"
        : "";
      modalElement.appendChild(keywordPreviewElement);
    }
    const imageLabelElement = document.createElement("div");
    imageLabelElement.innerHTML = "<label for='manual-quest-image' style='display:block; font-weight:bold; margin-bottom:4px;'>Link ảnh nhiệm vụ</label>";
    modalElement.appendChild(imageLabelElement);
    const imageInput = document.createElement("input");
    imageInput.id = "manual-quest-image";
    imageInput.type = "url";
    imageInput.value = manualImageSrc || "";
    imageInput.placeholder = "https://...";
    imageInput.autocomplete = "off";
    imageInput.readOnly = true;
    imageInput.style.cssText = "width:100%; box-sizing:border-box; padding:9px; border:1px solid #cbd5e1; border-radius:6px; margin-bottom:10px; background:#f1f5f9; color:#64748b; cursor:not-allowed;";
    modalElement.appendChild(imageInput);
    const imagePreview = document.createElement("img");
    imagePreview.id = "manual-quest-image-preview";
    imagePreview.alt = "Ảnh hướng dẫn quest";
    imagePreview.src = String(manualImageSrc || "").replace(/'/g, "&#39;");
    imagePreview.style.cssText = "display:" + (manualImageSrc ? "block" : "none") + "; max-width:100%; max-height:180px; object-fit:contain; margin:0 auto 10px; border:1px solid #e2e8f0; border-radius:6px;";
    modalElement.appendChild(imagePreview);
    const linkLabelElement = document.createElement("div");
    linkLabelElement.innerHTML = "<label for='manual-quest-link' style='display:block; font-weight:bold; margin-bottom:4px;'>Link Quest thủ công</label>";
    modalElement.appendChild(linkLabelElement);
    const linkInput = document.createElement("input");
    linkInput.id = "manual-quest-link";
    linkInput.type = "url";
    linkInput.value = "";
    linkInput.placeholder = "https://...";
    linkInput.autocomplete = "off";
    linkInput.style.cssText = "width:100%; box-sizing:border-box; padding:9px; border:1px solid #cbd5e1; border-radius:6px; margin-bottom:12px;";
    modalElement.appendChild(linkInput);
    const continueButton = document.createElement("button");
    continueButton.type = "button";
    continueButton.id = "btn-manual-quest";
    continueButton.className = "btn btn-primary";
    continueButton.textContent = "Tiếp tục với link này";
    continueButton.style.cssText = "width:100%; font-weight:bold;";
    continueButton.addEventListener("click", () => {
      try {
        applyManualQuest();
        modalElement.remove();
        resolveManualQuest(questInfo);
      } catch (manualError) {}
    });
    modalElement.appendChild(continueButton);
    const changeButton = document.createElement("button");
    changeButton.type = "button";
    changeButton.id = "btn-manual-change-quest";
    changeButton.className = "btn btn-danger";
    changeButton.textContent = "Đổi nhiệm vụ";
    changeButton.style.cssText = "width:100%; margin-top:10px; font-weight:bold;";
    changeButton.addEventListener("click", () => {
      modalElement.remove();
      changeMission(true, "");
    });
    modalElement.appendChild(changeButton);
    if (wrapper) wrapper.appendChild(modalElement);
  });
}

function openSavedLinksModal() {
  const existingModal = document.getElementById("manual-link-cache-modal");
  if (existingModal) existingModal.remove();
  const modalElement = document.createElement("div");
  modalElement.id = "manual-link-cache-modal";
  modalElement.style.cssText = "position:fixed; inset:0; z-index:10000; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(15,23,42,.55);";
  const panelElement = document.createElement("div");
  panelElement.style.cssText = "width:min(520px, 100%); max-height:80vh; overflow:auto; padding:18px; background:#fff; border-radius:8px; box-shadow:0 8px 30px rgba(0,0,0,.25); color:#1e293b;";
  const titleElement = document.createElement("div");
  titleElement.textContent = "Link đã lưu";
  titleElement.style.cssText = "font-weight:700; font-size:16px; margin-bottom:12px;";
  panelElement.appendChild(titleElement);
  const savedEntries = Object.keys(manualLinks).filter((savedKey) => savedKey && manualLinks[savedKey]);
  if (!savedEntries.length) {
    const emptyElement = document.createElement("div");
    emptyElement.textContent = "Chưa có link nhiệm vụ nào được lưu.";
    emptyElement.style.color = "#64748b";
    panelElement.appendChild(emptyElement);
  } else {
    const listElement = document.createElement("ul");
    listElement.style.cssText = "margin:0; padding:0; list-style:none; color:#475569; font-size:13px; line-height:1.5;";
    savedEntries.forEach((savedKey) => {
      const rowElement = document.createElement("li");
      rowElement.style.cssText = "border:1px solid #e2e8f0; border-radius:6px; padding:10px; margin-bottom:8px;";
      const linkTextElement = document.createElement("div");
      linkTextElement.textContent = (manualLinks[savedKey] && typeof manualLinks[savedKey] === "object" && manualLinks[savedKey].link) ? manualLinks[savedKey].link : savedKey;
      linkTextElement.style.cssText = "word-break:break-all; color:#0f766e; font-weight:600; margin-bottom:8px;";
      rowElement.appendChild(linkTextElement);
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "Xóa mục này";
      deleteButton.style.cssText = "border:0; background:#fee2e2; color:#991b1b; cursor:pointer; padding:5px 8px; border-radius:4px; font-weight:600;";
      deleteButton.addEventListener("click", () => {
        delete manualLinks[savedKey];
        saveManualLinks();
        rowElement.remove();
      });
      rowElement.appendChild(deleteButton);
      listElement.appendChild(rowElement);
    });
    panelElement.appendChild(listElement);
  }
  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.textContent = "Xóa toàn bộ link đã lưu";
  clearButton.style.cssText = "display:block; width:100%; margin-top:12px; padding:8px 12px; border:0; border-radius:5px; background:#dc2626; color:#fff; cursor:pointer; font-weight:600;";
  clearButton.addEventListener("click", () => {
    manualLinks = {};
    localStorage.removeItem("vnbypass_manual_links");
    modalElement.remove();
  });
  panelElement.appendChild(clearButton);
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "Đóng";
  closeButton.style.cssText = "display:block; width:100%; margin-top:8px; padding:8px 12px; border:0; border-radius:5px; background:#d97706; color:#fff; cursor:pointer; font-weight:600;";
  closeButton.addEventListener("click", () => modalElement.remove());
  panelElement.appendChild(closeButton);
  modalElement.appendChild(panelElement);
  document.body.appendChild(modalElement);
}

function openBlacklistModal() {
  const existingModal = document.getElementById("blacklist-list-modal");
  if (existingModal) existingModal.remove();
  const modalElement = document.createElement("div");
  modalElement.id = "blacklist-list-modal";
  modalElement.style.cssText = "position:fixed; inset:0; z-index:10000; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(15,23,42,.55);";
  const panelElement = document.createElement("div");
  panelElement.style.cssText = "width:min(420px, 100%); max-height:80vh; overflow:auto; padding:18px; background:#fff; border-radius:8px; box-shadow:0 8px 30px rgba(0,0,0,.25); color:#1e293b;";
  const titleElement = document.createElement("div");
  titleElement.textContent = "Blacklist link nhiệm vụ";
  titleElement.style.cssText = "font-weight:700; font-size:16px; margin-bottom:12px;";
  panelElement.appendChild(titleElement);
  const serverTitleElement = document.createElement("div");
  serverTitleElement.textContent = "Blacklist từ server (không thể xóa)";
  serverTitleElement.style.cssText = "font-weight:700; font-size:13px; margin:8px 0; color:#991b1b;";
  panelElement.appendChild(serverTitleElement);
  const serverListElement = document.createElement("ul");
  serverListElement.style.cssText = "margin:0 0 12px; padding-left:20px; color:#475569; font-size:13px; line-height:1.7;";
  serverListElement.innerHTML = serverBlacklist.length
    ? serverBlacklist.map((blockedEntry) => "<li>" + escapeHtml(String(blockedEntry)) + "</li>").join("")
    : "<li>Chưa có blacklist từ server.</li>";
  panelElement.appendChild(serverListElement);
  const customTitleElement = document.createElement("div");
  customTitleElement.textContent = "Blacklist tự thêm";
  customTitleElement.style.cssText = "font-weight:700; font-size:13px; margin:8px 0; color:#92400e;";
  panelElement.appendChild(customTitleElement);
  const customListElement = document.createElement("ul");
  customListElement.style.cssText = "margin:0; padding-left:20px; color:#475569; font-size:13px; line-height:1.7;";
  if (customBlacklist.length) {
    customBlacklist.forEach((blockedEntry) => {
      const rowElement = document.createElement("li");
      rowElement.style.cssText = "display:flex; justify-content:space-between; gap:8px; align-items:center;";
      const keywordTextElement = document.createElement("span");
      keywordTextElement.textContent = String(blockedEntry);
      rowElement.appendChild(keywordTextElement);
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.textContent = "Xóa";
      removeButton.style.cssText = "border:0; background:#fee2e2; color:#991b1b; cursor:pointer; padding:3px 7px; border-radius:4px;";
      removeButton.addEventListener("click", () => {
        customBlacklist = customBlacklist.filter((keptEntry) => String(keptEntry).toLowerCase() !== String(blockedEntry).toLowerCase());
        saveCustomBlacklist();
        rowElement.remove();
      });
      rowElement.appendChild(removeButton);
      customListElement.appendChild(rowElement);
    });
  } else {
    customListElement.innerHTML = "<li>Chưa có blacklist tự thêm.</li>";
  }
  panelElement.appendChild(customListElement);
  const keywordInput = document.createElement("input");
  keywordInput.type = "text";
  keywordInput.placeholder = "Nhập từ khóa hoặc link cần blacklist";
  keywordInput.style.cssText = "width:100%; box-sizing:border-box; margin-top:12px; padding:8px; border:1px solid #cbd5e1; border-radius:5px;";
  panelElement.appendChild(keywordInput);
  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.textContent = "Thêm blacklist";
  addButton.style.cssText = "display:block; width:100%; margin-top:8px; padding:8px 12px; border:0; border-radius:5px; background:#b45309; color:#fff; cursor:pointer; font-weight:600;";
  addButton.addEventListener("click", () => {
    const keywordValue = String(keywordInput.value || "").trim();
    if (!keywordValue) return;
    const alreadyBlocked = serverBlacklist.some((blockedEntry) => String(blockedEntry).toLowerCase() === keywordValue.toLowerCase())
      || customBlacklist.some((blockedEntry) => String(blockedEntry).toLowerCase() === keywordValue.toLowerCase());
    if (alreadyBlocked) return;
    customBlacklist.push(keywordValue);
    saveCustomBlacklist();
    const addedRow = document.createElement("li");
    addedRow.style.cssText = "display:flex; justify-content:space-between; gap:8px; align-items:center;";
    const addedText = document.createElement("span");
    addedText.textContent = keywordValue;
    addedRow.appendChild(addedText);
    const addedRemoveButton = document.createElement("button");
    addedRemoveButton.type = "button";
    addedRemoveButton.textContent = "Xóa";
    addedRemoveButton.style.cssText = "border:0; background:#fee2e2; color:#991b1b; cursor:pointer; padding:3px 7px; border-radius:4px;";
    addedRemoveButton.addEventListener("click", () => {
      customBlacklist = customBlacklist.filter((keptEntry) => String(keptEntry).toLowerCase() !== keywordValue.toLowerCase());
      saveCustomBlacklist();
      addedRow.remove();
    });
    addedRow.appendChild(addedRemoveButton);
    customListElement.appendChild(addedRow);
  });
  panelElement.appendChild(addButton);
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "Đóng";
  closeButton.style.cssText = "display:block; width:100%; margin-top:16px; padding:8px 12px; border:0; border-radius:5px; background:#d97706; color:#fff; cursor:pointer; font-weight:600;";
  closeButton.addEventListener("click", () => modalElement.remove());
  panelElement.appendChild(closeButton);
  modalElement.appendChild(panelElement);
  document.body.appendChild(modalElement);
}

async function initBlacklistAndManualLinks() {
  try {
    customBlacklist = JSON.parse(localStorage.getItem("vnbypass_custom_blacklist") || "[]").filter(Boolean).map(String);
  } catch (blacklistError) { customBlacklist = []; }
  try {
    manualLinks = JSON.parse(localStorage.getItem("vnbypass_manual_links") || "{}");
    if (typeof manualLinks !== "object" || manualLinks === null) manualLinks = {};
  } catch (linksError) { manualLinks = {}; }
}

async function resolveVisitorUUID() {
  if (typeof getVisitorInfo === "function" && getVisitorInfo() && getVisitorInfo().uuid) {
    return getVisitorInfo().uuid;
  }
  if (typeof getVisitorUUID === "function") {
    try {
      const visitorUuid = await getVisitorUUID();
      if (visitorUuid) return visitorUuid;
    } catch (uuidError) {}
  }
  if (typeof uuidv4 === "function") {
    try { return uuidv4(); } catch (uuidError) {}
  }
  try {
    const storedVisitor = localStorage.getItem("vnbypass_visitor_uuid");
    if (storedVisitor) return storedVisitor;
    const newVisitor = "vnb-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("vnbypass_visitor_uuid", newVisitor);
    return newVisitor;
  } catch (storageError) {}
  return "";
}

async function main(deps) {
  const isUserscript = typeof g !== "undefined" || typeof window !== "undefined";
  config.autoChange = deps.AUTO_CHANGE_MISSION_ON_ERROR === true;
  const storedAutoChange = localStorage.getItem("vnbypass_auto_change");
  if (storedAutoChange !== null) config.autoChange = storedAutoChange === "true" || storedAutoChange === "1";
  config.blacklistAuto = true;
  const storedBlacklistAuto = localStorage.getItem("vnbypass_blacklist_auto_change");
  if (storedBlacklistAuto !== null) config.blacklistAuto = storedBlacklistAuto === "true" || storedBlacklistAuto === "1";
  config.autoOpen = false;
  const storedAutoOpen = localStorage.getItem("vnbypass_auto_open_link");
  if (storedAutoOpen !== null) config.autoOpen = storedAutoOpen === "true" || storedAutoOpen === "1";
  config.autoSave = false;
  const storedAutoSave = localStorage.getItem("vnbypass_auto_save_manual_link");
  if (storedAutoSave !== null) config.autoSave = storedAutoSave === "true" || storedAutoSave === "1";
  config.WAIT_TIME = typeof config.WAIT_TIME !== "undefined" ? config.WAIT_TIME : DEFAULT_WAIT_TIME;
  const storedWaitTime = parseInt(localStorage.getItem("vnbypass_wait_time"), 10);
  if (!isNaN(storedWaitTime)) config.WAIT_TIME = storedWaitTime;
  gmXhr = deps.gmXhr || (typeof window !== "undefined" && window.GM_xmlhttpRequest) || gmXhrFallbackShim;
  uWindow = deps.uWindow || (typeof window !== "undefined" && window.unsafeWindow) || window;
  const remoteConfigs = await Promise.all(CONFIG_URLS.map((configUrl) => fetchRemoteConfig(configUrl)));
  remoteConfigs.forEach((remoteConfig) => {
    if (remoteConfig && Array.isArray(remoteConfig.blacklist)) {
      serverBlacklist = Array.from(new Set(serverBlacklist.concat(remoteConfig.blacklist.map(String))));
    }
    if (remoteConfig && Array.isArray(remoteConfig.keywords)) {
      serverKeywords = Array.from(new Set(serverKeywords.concat(remoteConfig.keywords.map(String))));
    }
  });
  const pageRoot = document.querySelector("main#guide")
    || document.querySelector(".box-step-wrap")
    || document.querySelector("main")
    || document.body;
  wrapper = document.getElementById("vnbypass-wrapper");
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.id = "vnbypass-wrapper";
    wrapper.style.cssText = "width: 100%; max-width: 660px; margin: 0 auto 20px auto; display: flex; flex-direction: column; gap: 14px;";
  }
  if (wrapper.parentElement !== pageRoot) pageRoot.insertBefore(wrapper, pageRoot.firstChild);
  captchaBox = ensureDiv("native-override-captcha-box", "margin: 0; padding: 10px; background: #f8fafc; border: 1px solid #dbeafe; border-radius: 8px; min-height: 60px;");
  buttonBox = ensureDiv("native-override-button-box", "display: none; width: 100%;");
  sessionToken = "";
  trafficKeyInfo = null;
  trafficSession = null;
  finalLink = "";
  codeValue = "";
  captchaToken = "";
  visitorUUID = await resolveVisitorUUID();
  await Promise.all([initBlacklistAndManualLinks(), Promise.resolve(injectCleanStyles())]);
  injectHeaderStyle();
  topHeader = ensureDiv("native-override-top-header", "fancy-top-header");
  topHeader.innerHTML = "<span class='vnbypass-title'>" + APP_TITLE + "</span>"
    + "<a class='vnbypass-discord' href='" + DISCORD_URL + "' target='_blank' rel='noopener noreferrer'>Tham gia Discord (discord.gg/6tDVDHyyA)</a>"
    + "<div class='vnbypass-intro'>Cộng Đồng Chia Sẻ Và Hỗ Trợ Nhanh. Tool Bypass Link VN Siêu Nhanh</div>";
  buildSettingsPanel();
  questInfoBox = ensureDiv("native-override-quest-info", "margin-bottom: 0px; padding: 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; text-align:left; font-size:14px; line-height: 1.6;");
  questInfoBox.innerHTML = "<div style='color:#64748b; font-weight:600; text-align:center;'>Đang kiểm tra thông tin Quest...</div>";
  window.addEventListener("beforeunload", beforeUnloadGuard);
  questInfo = await getQuestLink();
  if (!questInfo || !questInfo.link) {
    captchaBox.style.setProperty("display", "block", "important");
    captchaBox.textContent = "Không lấy được link Quest tự động!";
    return;
  }
  captchaBox.innerHTML = "";
  let blacklisted = false;
  let blacklistReason = "";
  for (let entryIndex = 0; entryIndex < customBlacklist.length; entryIndex++) {
    const blockedKeyword = customBlacklist[entryIndex];
    if (!blockedKeyword) continue;
    if (questInfo.link.toLowerCase().indexOf(String(blockedKeyword).toLowerCase()) !== -1) {
      blacklisted = true;
      blacklistReason = "Link chứa từ khóa \"" + blockedKeyword + "\"";
      break;
    }
  }
  if (blacklisted) {
    captchaBox.textContent = "Nhiệm vụ nằm trong blacklist: " + blacklistReason;
    if (config.blacklistAuto) return changeMission(true, "_0x4b1683");
    return;
  }
  renderQuestInfo(questInfo.link, questInfo.platform);
  captchaBox.innerHTML = "<div style='color:#0284c7; font-weight:bold; text-align:center;'>Đang lấy thông tin Traffic Key...</div>";
  await new Promise((resolveTrafficKey) => {
    gmXhr({
      method: "GET",
      url: questInfo.link,
      headers: {
        "Referer": document.location.origin,
        "User-Agent": navigator.userAgent,
      },
      timeout: 10000,
      onload: (questResponse) => {
        const questHtml = questResponse.responseText || questResponse.finalUrl || questResponse.responseURL || "";
        const extractedKey = extractTrafficKey(questHtml, questInfo.link);
        if (!extractedKey) {
          captchaBox.textContent = "Không tìm thấy Traffic Key!";
          resolveTrafficKey(null);
          return;
        }
        trafficKeyInfo = {
          link: questInfo.link,
          trafficKey: extractedKey,
          platform: questInfo.platform,
        };
        trafficKeyInfo.qCaptchaSiteKey = extractSiteKeyFromHtml(questHtml);
        trafficKeyInfo.qCaptchaScriptUrl = extractScriptUrlFromHtml(questHtml);
        resolveTrafficKey(trafficKeyInfo);
      },
      onerror: () => {
        captchaBox.textContent = "Lỗi kết nối tới trang nhiệm vụ!";
        resolveTrafficKey(null);
      },
      ontimeout: () => {
        captchaBox.textContent = "Trang nhiệm vụ phản hồi quá lâu, vui lòng thử lại!";
        resolveTrafficKey(null);
      },
    });
  });
  if (!trafficKeyInfo) return;
  try { questOrigin = new URL(trafficKeyInfo.link).origin; } catch (originError) {}
  sessionCacheKey = "layma_widget_session_" + trafficKeyInfo.trafficKey;
  trafficSession = null;
  await new Promise((resolveSessionRestore) => {
    trafficSession = localStorage.getItem(sessionCacheKey);
    resolveSessionRestore(trafficSession);
  });
  let keyBlacklisted = false;
  let keyBlacklistReason = "";
  for (let entryIndex = 0; entryIndex < customBlacklist.length; entryIndex++) {
    const blockedKeyword = customBlacklist[entryIndex];
    if (!blockedKeyword) continue;
    if (trafficKeyInfo.trafficKey.toLowerCase().indexOf(String(blockedKeyword).toLowerCase()) !== -1) {
      keyBlacklisted = true;
      keyBlacklistReason = "Traffic Key chứa từ khóa \"" + blockedKeyword + "\"";
      break;
    }
  }
  if (keyBlacklisted) {
    captchaBox.textContent = "Nhiệm vụ nằm trong blacklist: " + keyBlacklistReason;
    if (config.blacklistAuto) return changeMission(true, "_0x1aab20");
    return;
  }
  try {
    let campainResponse = undefined;
    try {
      const campainHeaders = {};
      if (trafficSession) campainHeaders["X-Traffic-Session"] = trafficSession;
      campainResponse = await httpRequest("GET",
        API_BASE + "/api/admin/campain?keytoken=" + encodeURIComponent(trafficKeyInfo.trafficKey)
          + "&flatform=" + encodeURIComponent(trafficKeyInfo.platform)
          + "&waitMode=1&requiredPageVisits=1",
        null, campainHeaders);
    } catch (campainError) {
      if (campainError && !campainError.responseText && campainError.message) {
        captchaBox.textContent = buildStatusMessage("Server Lỗi: ", campainError.status, campainError.message);
      }
      if (!campainError || !campainError.status) return;
    }
    if (!campainResponse || !campainResponse.trafficSessionToken) {
      renderErrorBox("Khởi tạo Campaign thất bại!");
      return;
    }
    sessionToken = campainResponse.trafficSessionToken;
    if (campainResponse.visitTicket) {
      localStorage.setItem("cache_visit_ticket_" + (campainResponse.id || ""), campainResponse.visitTicket);
    }
    campainInfo = campainResponse;
    const responseDomain = campainResponse.domain || campainResponse.Domain;
    if (!responseDomain && trafficKeyInfo.link) {
      try { questOrigin = new URL(trafficKeyInfo.link).origin; } catch (domainError) {}
    } else if (responseDomain) {
      try { questOrigin = new URL(String(responseDomain).indexOf("https://") === 0 ? responseDomain : "https://" + String(responseDomain).trim()).origin; } catch (domainError) {}
    }
    if (config.autoSave && manualLinks && questInfo && questInfo.link) {
      manualLinks[questInfo.link] = { link: questInfo.link, platform: questInfo.platform, keyword: questInfo.keyword || "" };
      saveManualLinks();
    }
    const serverDelay = Math.max(Number(campainResponse.delay) || 0, 0);
    const waitSeconds = Math.max(Number(campainResponse.requiredWaitSeconds) || config.WAIT_TIME, serverDelay);
    showCountdownBox(waitSeconds);
    await waitForCountdown(waitSeconds);
    captchaSiteKey = campainResponse.qCaptchaSiteKey || campainResponse.qcaptchaSiteKey;
    captchaScriptUrl = campainResponse.qCaptchaScriptUrl || campainResponse.qcaptchaScriptUrl;
    if (!captchaSiteKey && captchaScriptUrl === undefined) {
      const cachedCaptchaConfig = await fetchCaptchaConfigFor(trafficKeyInfo.trafficKey);
      if (cachedCaptchaConfig) {
        captchaSiteKey = captchaSiteKey || cachedCaptchaConfig.qCaptchaSiteKey;
        captchaScriptUrl = captchaScriptUrl || cachedCaptchaConfig.qCaptchaScriptUrl;
      }
    }
    await ensureCaptchaNonce();
    const captchaReady = await setupCaptcha();
    if (!captchaReady) return;
    if (!campainResponse.captchaNonceAction) campainResponse.captchaNonceAction = "";
    if (!captchaSiteKey && !captchaScriptUrl) {
      renderErrorBox("Không tìm thấy QCaptcha Site Key của nhiệm vụ!");
      return;
    }
    if (!captchaScriptUrl) {
      renderErrorBox("Không tìm thấy QCaptcha Script URL của nhiệm vụ!");
      return;
    }
    captchaBox.style.background = "transparent";
    captchaBox.style.border = "none";
    captchaBox.style.padding = "0";
    captchaBox.innerHTML = "<div id='captcha-native-target' style='display:flex; justify-content:center; align-items:flex-start; width:100%;'></div>";
    solution = readCachedSolution();
    await runStepOneFlow();
  } catch (mainError) {
    renderErrorBox(mainError && mainError.message ? String(mainError.message) : "Xảy ra lỗi không xác định trong quá trình xử lý!");
  }
}

console.log('[Layma Bypass] Khởi động phiên bản giải mã hoàn chỉnh v1.1.4 (decobf)');
console.log('[Layma Bypass] Owner decobf: @tien_nood2 (<@1245646252905861190>) | Hỗ trợ: @hlounhh (<@1312674288775593984>)');

function startVNByPass() {
  const request = typeof GM_xmlhttpRequest === "function"
    ? GM_xmlhttpRequest
    : gmXhrFallbackShim;
  const pageWindow = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  main({ gmXhr: request, uWindow: pageWindow }).catch((error) => {
    console.error("VNByPass initialization failed:", error);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startVNByPass, { once: true });
} else {
  startVNByPass();
}
