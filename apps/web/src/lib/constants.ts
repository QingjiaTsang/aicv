export const THEME_COLORS = [
    "#7c3aed", // Purple
    "#FF6F61", // Warm Coral
    "#33B679", // Fresh Green
    "#4B9CD3", // Soft Blue
    "#FF6F91", // Bright Magenta
    "#9B59B6", // Rich Purple
    "#1ABC9C", // Mint Green
    "#FF8C00", // Tangerine Orange
    "#B2D300", // Vibrant Lime
    "#8E44AD", // Deep Violet
    "#FF4F81", // Hot Pink
    "#2ECC71", // Light Jade
    "#3498DB", // Calm Sky Blue
    "#A3D550", // Neon Yellow-Green
    "#00BFFF", // Cool Azure
    "#FF6F61", // Coral Orange
    "#8E44AD", // Royal Blue
    "#2ECC71", // Electric Green
    "#5B2C6F", // Indigo Purple
    "#FF4F81", // Crimson Red
    "#2980B9", // Cobalt Blue
    "#E67E22", // Carrot Orange
    "#16A085", // Persian Green
    "#D35400", // Pumpkin Orange
    "#27AE60", // Emerald Green
    "#445D48", // Forest Green
    "#4A55A2", // Navy Blue
    "#1B9C85", // Deep Teal
    "#086788", // Ocean Blue
    "#2D4356", // Charcoal Blue
    "#7A3E65", // Plum Purple
    "#4E6E81", // Steel Blue
    "#6D9886", // Sage Green
    "#735F32", // Bronze
    "#576F72", // Slate Gray
] as const

export const DEFAULT_THEME_COLOR = THEME_COLORS[0]

export const FORM_LABELS = [
  "Personal Info",
  "Summary",
  "Experience",
  "Education",
  "Skills",
] as const

export const QUILL_CONTENT_CLASSES = [
  // 基础文本样式：字体大小、行高和文本换行
  "text-sm leading-[1.6] break-words",

  // 文本对齐方式：居中、居右、两端对齐
  "[&_.ql-align-center]:text-center",
  "[&_.ql-align-right]:text-right",
  "[&_.ql-align-justify]:text-justify",

  // 段落间距
  "[&_p]:my-1",

  // 文本缩进：每级缩进增加 1rem (16px)
  "[&_.ql-indent-1]:pl-4",    // 1rem
  "[&_.ql-indent-2]:pl-8",    // 2rem
  "[&_.ql-indent-3]:pl-12",   // 3rem
  "[&_.ql-indent-4]:pl-16",   // 4rem
  "[&_.ql-indent-5]:pl-20",   // 5rem
  "[&_.ql-indent-6]:pl-24",   // 6rem
  "[&_.ql-indent-7]:pl-28",   // 7rem
  "[&_.ql-indent-8]:pl-32",   // 8rem
  "[&_.ql-indent-9]:pl-36",   // 9rem

  // 列表样式：项目符号和缩进
  "[&_.ql-list-bullet]:list-disc [&_.ql-list-bullet]:ml-4 [&_.ql-list-bullet]:my-1",
  "[&_ul]:list-disc [&_ul]:ml-4",
  "[&_ol>li[data-list='bullet']]:list-disc [&_ol>li[data-list='bullet']]:ml-4",
  "[&_ol>li[data-list='ordered']]:list-decimal [&_ol>li[data-list='ordered']]:ml-4",

  // 文本修饰：粗体、斜体、下划线、删除线
  "[&_strong]:font-bold",
  "[&_em]:italic",
  "[&_u]:underline",
  "[&_s]:line-through",

  // 标题层级样式：大小、粗细和间距
  "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-2",   // 最大标题
  "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-2",    // 二级标题
  "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2",    // 三级标题
  "[&_h4]:text-base [&_h4]:font-bold [&_h4]:my-2",  // 四级标题
  "[&_h5]:text-sm [&_h5]:font-bold [&_h5]:my-2",    // 五级标题
  "[&_h6]:text-xs [&_h6]:font-bold [&_h6]:my-2"     // 最小标题
]