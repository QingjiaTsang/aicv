import { useEffect, useLayoutEffect, useRef } from "react"
import Quill from "quill"
import { cn } from "@/web/lib/utils"

import "quill/dist/quill.snow.css"

// Custom icon of undo and redo actions
const UndoIcon = `<svg viewBox="0 0 18 18">
  <polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
  <path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9" />
</svg>`;

const RedoIcon = `<svg viewBox="0 0 18 18">
  <polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
  <path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5" />
</svg>`;

const toolbarOptions = [
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'font': [] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'align': [] }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  ['link'],
  ['clean'],
  // Define custom undo/redo buttons which will bring back elements with ql-undo and ql-redo classes
  // like <button class="ql-undo"></button>
  ['undo', 'redo']
]

type EditorProps = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
  readOnly?: boolean
}

export default function Editor({
  value = '',
  onChange,
  placeholder = '',
  className,
  minHeight = '120px',
  readOnly = false
}: EditorProps) {
  const quillRef = useRef<Quill | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef(value)
  const onChangeRef = useRef(onChange)

  // Make sure it always can receive the latest onChange and value when props change
  useLayoutEffect(() => {
    onChangeRef.current = onChange
    valueRef.current = value
  })

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const container = containerRef.current
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div')
    )

    // Register custom undo/redo handlers
    const undoChange = function (this: Quill) {
      this.history.undo();
    };

    const redoChange = function (this: Quill) {
      this.history.redo();
    };

    // Initialize Quill
    const quill = new Quill(editorContainer, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: {
          container: toolbarOptions,
          handlers: {
            undo: undoChange,
            redo: redoChange
          }
        },
        history: {
          delay: 500,
          maxStack: 100,
          userOnly: true
        }
      }
    })

    quillRef.current = quill

    // Bind custom undo/redo handlers to the custom buttons defined in toolbar
    const toolbar = quill.getModule('toolbar') as any;
    toolbar.addHandler('undo', undoChange.bind(quill));
    toolbar.addHandler('redo', redoChange.bind(quill));

    // Apply custom icons to the innerHTML content of custom undo/redo buttons
    const undo = container.querySelector('.ql-undo');
    const redo = container.querySelector('.ql-redo');
    if (undo) {
      undo.innerHTML = UndoIcon;
    }
    if (redo) {
      redo.innerHTML = RedoIcon;
    }

    // Set initial content
    if (valueRef.current) {
      quill.root.innerHTML = valueRef.current
    }

    // Listen for content changes
    quill.on('text-change', () => {
      onChangeRef.current?.(quill.root.innerHTML)
    })

    return () => {
      if (quillRef.current) {
        quillRef.current = null
      }
      container.innerHTML = ''
    }
  }, [])

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!readOnly)
    }
  }, [readOnly])

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-background text-sm ring-offset-background",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        "break-all",
        className
      )}
    >
      <div
        ref={containerRef}
        style={{ minHeight }}
      />
    </div>
  )
}
