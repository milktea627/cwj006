# 小猫百科 · 关于猫的一切（课程网页作业）

一个介绍猫的静态网站：**6 个页面**（1 个首页 + 5 个分页面），
纯手写 HTML + CSS + JavaScript，无框架、无构建、无第三方依赖，双击 `index.html` 即可打开。

在线地址：<https://milktea627.github.io/miao213/>

---

## 一、内容结构

| 页面 | 标题 | 内容 |
| --- | --- | --- |
| `index.html` | 小猫百科 · 关于猫的一切 | 首页：主题介绍、数字速览、五个章节入口、品种与行为预览、养护要点 |
| `web/breeds.html` | 品种图鉴 · 小猫百科 | 狸花、英短、布偶、暹罗、橘猫、黑猫，含对照表 |
| `web/behavior.html` | 行为语言 · 小猫百科 | 尾巴、耳朵、呼噜、踩奶、蹭头、翻肚、叼玩具，附常见误读 |
| `web/care.html` | 养护指南 · 小猫百科 | 每日/每周清单、环境布置、疫苗驱虫表、禁忌食物 |
| `web/gallery.html` | 猫的相册 · 小猫百科 | 五张原创插画，点击可放大 |
| `web/message.html` | 喵一声 · 小猫百科 | 留言板，本地存储，可删除 |

```
miao213/                  ← 主文件夹（按要求改为 姓名首字母+学号后三位）
├── index.html            首页（必须放在主文件夹下）
├── image/                14 个原创 SVG 插画
│   ├── logo.svg          爪印标志
│   ├── hero.svg          客厅里的猫
│   ├── breed-1~6.svg     六个品种头像
│   └── gallery-*.svg     五张相册插画
├── web/                  分页面与样式脚本
│   ├── breeds.html  behavior.html  care.html
│   ├── gallery.html message.html
│   ├── style.css         全站唯一样式表
│   └── script.js         全站唯一脚本
├── .nojekyll
└── README.md
```

页面之间全部使用**相对路径**（`../index.html`、`style.css`、`../image/hero.svg`），
整个文件夹可以任意改名、拷贝，不会断链掉图。

---

## 二、本地预览

- 直接双击 `index.html` 用浏览器打开；
- 或在本文件夹内执行 `python -m http.server 8000`，访问 <http://localhost:8000>。

---

## 三、修改后如何更新线上

```bash
cd miao213
git add -A
git commit -m "更新内容"
git push
```

推送后 GitHub Pages 会自动重建，大约 1 分钟生效。

---

## 四、内容修改指引

| 想改 | 改哪里 |
| --- | --- |
| 站点名、标语 | 六个页面的 `<title>`、`.logo`、页脚 |
| 品种内容 | `web/breeds.html` 的卡片与对照表 |
| 行为条目 | `web/behavior.html` 的 `.behavior` 区块 |
| 养护清单 | `web/care.html` 的 `.check` / `.warn` 列表 |
| 相册图片 | 替换 `image/gallery-*.svg`（换照片时同步改 `gallery.html` 的 `src/width/height`） |
| 配色 | `web/style.css` 顶部 `:root` 变量（`--orange` 主色、`--cream` 背景） |

---

## 五、作业要求自查

- [x] 页面数量 ≥ 5 —— 共 6 个
- [x] 图文并茂、内容正面 —— 每页均有插画/图鉴/表格
- [x] 全部使用相对路径
- [x] 有主页 `index.html`，首页链接所有分页面
- [x] 每个分页面均可返回首页（页头 + 页脚 + 正文按钮）
- [x] 主文件夹下含 `image/` 与 `web/` 两个子文件夹
- [x] 总大小远低于 100MB（全部文件不到 200KB）
- [x] 原创代码与原创插画，未使用现成模板

---

## 六、许可

课程作业作品，仅供学习交流，不作商业用途。
