# 彈性習慣 PWA

基於《彈性習慣》的 Mini / Plus / Elite 三層打卡追蹤器，支援 **離線使用 + 安裝到手機桌面**。

## 資料夾結構

```
彈性習慣-PWA/
├── index.html        ← 主程式（所有功能在此）
├── manifest.json     ← PWA 設定
├── sw.js             ← Service Worker（離線快取）
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── README.md
```

---

## 部署方法（免費，5 分鐘完成）

### 方法一：GitHub Pages（推薦）

1. 到 [github.com](https://github.com) 登入或建立帳號
2. 新建一個 Repository（點右上角 `+` → `New repository`）
3. 名稱建議：`flexi-habit`，設為 **Public**，按 `Create repository`
4. 點 `uploading an existing file`，把整個 `彈性習慣-PWA` 資料夾內的**所有檔案和 icons 資料夾**拖入上傳
5. 按 `Commit changes`
6. 到 `Settings` → `Pages` → `Source` 選 `Deploy from a branch`，Branch 選 `main`，按 `Save`
7. 約 1 分鐘後，你的 App 網址就是：`https://你的帳號.github.io/flexi-habit/`

### 方法二：Netlify（拖放上傳，最快）

1. 到 [netlify.com](https://netlify.com) 登入
2. 點 `Add new site` → `Deploy manually`
3. 把 `彈性習慣-PWA` 資料夾**直接拖到網頁**
4. 30 秒內自動產生網址（可自訂）

---

## 安裝到手機

### Android（Chrome）
1. 用 Chrome 開啟 App 網址
2. 畫面下方會出現**「安裝 彈性習慣 App」橫幅**
3. 點「安裝」即完成，App 圖示會出現在桌面

### iPhone / iPad（Safari）
1. 用 **Safari**（必須）開啟 App 網址
2. 點下方**分享按鈕** ⬆
3. 選「**加入主畫面**」
4. 點右上角「**新增**」

> ⚠️ iOS 不支援 Chrome/Edge 的 PWA 安裝，必須用 Safari

---

## 離線功能

首次開啟後，App 會自動快取到裝置。之後**即使沒有網路**也能正常使用。
資料儲存在裝置本機（localStorage），不會上傳到任何伺服器。

---

## 版本

- v1.0 PWA — 2026.04
