"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import clsx from "clsx";
import { mediaApi } from "@/lib/api/media/api";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import type { RichTextEditorProps } from "./types";

/**
 * TipTap 기반 리치 텍스트 에디터 컴포넌트
 *
 * HTML 형식의 텍스트 편집을 지원하는 WYSIWYG 에디터
 *
 * @example
 * ```tsx
 * <RichTextEditor
 *   value={content}
 *   onChange={setContent}
 *   placeholder="내용을 입력하세요..."
 * />
 * ```
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "내용을 입력하세요...",
  disabled = false,
  className = "",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // 코드 블록 비활성화
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        // 클립보드에서 이미지 파일 찾기
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            event.preventDefault();
            const file = items[i].getAsFile();
            if (file) {
              handleImageUpload(file);
            }
            return true;
          }
        }
        return false;
      },
    },
  });

  const handleImageUpload = async (file: File) => {
    try {
      // 이미지 업로드
      const { cloudFrontUrl } = await mediaApi.upload(file);

      // 에디터에 이미지 삽입
      if (editor) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'image',
            attrs: {
              src: cloudFrontUrl,
              alt: 'uploaded image',
            },
          })
          .run();
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  // value가 외부에서 변경되면 에디터 내용 업데이트
  // 단, 현재 포커스가 있으면 업데이트하지 않음 (타이핑 중일 때)
  if (editor && value !== editor.getHTML() && !editor.isFocused) {
    editor.commands.setContent(value);
  }

  if (!editor) {
    return null;
  }

  return (
    <div className={clsx("border border-neutral-80 rounded-lg", className)}>
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b border-neutral-80 bg-neutral-98 rounded-t-lg flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={clsx(
            "p-2 rounded transition-colors cursor-pointer",
            editor.isActive("bold")
              ? "bg-neutral-20 text-white"
              : "bg-white text-neutral-40 hover:bg-neutral-95"
          )}
          title="굵게"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={clsx(
            "p-2 rounded transition-colors cursor-pointer",
            editor.isActive("italic")
              ? "bg-neutral-20 text-white"
              : "bg-white text-neutral-40 hover:bg-neutral-95"
          )}
          title="기울임"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={disabled}
          className={clsx(
            "p-2 rounded transition-colors cursor-pointer",
            editor.isActive("strike")
              ? "bg-neutral-20 text-white"
              : "bg-white text-neutral-40 hover:bg-neutral-95"
          )}
          title="취소선"
        >
          <Strikethrough size={18} />
        </button>

        <div className="w-px h-8 bg-neutral-80 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={disabled}
          className={clsx(
            "p-2 rounded transition-colors cursor-pointer",
            editor.isActive("heading", { level: 1 })
              ? "bg-neutral-20 text-white"
              : "bg-white text-neutral-40 hover:bg-neutral-95"
          )}
          title="제목 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          className={clsx(
            "p-2 rounded transition-colors cursor-pointer",
            editor.isActive("heading", { level: 2 })
              ? "bg-neutral-20 text-white"
              : "bg-white text-neutral-40 hover:bg-neutral-95"
          )}
          title="제목 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
          className={clsx(
            "p-2 rounded transition-colors cursor-pointer",
            editor.isActive("heading", { level: 3 })
              ? "bg-neutral-20 text-white"
              : "bg-white text-neutral-40 hover:bg-neutral-95"
          )}
          title="제목 3"
        >
          <Heading3 size={18} />
        </button>

        <div className="w-px h-8 bg-neutral-80 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={clsx(
            "p-2 rounded transition-colors cursor-pointer",
            editor.isActive("bulletList")
              ? "bg-neutral-20 text-white"
              : "bg-white text-neutral-40 hover:bg-neutral-95"
          )}
          title="글머리 기호"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={clsx(
            "p-2 rounded transition-colors cursor-pointer",
            editor.isActive("orderedList")
              ? "bg-neutral-20 text-white"
              : "bg-white text-neutral-40 hover:bg-neutral-95"
          )}
          title="번호 매기기"
        >
          <ListOrdered size={18} />
        </button>

        <div className="w-px h-8 bg-neutral-80 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          className={clsx(
            "p-2 rounded transition-colors cursor-pointer",
            editor.isActive("blockquote")
              ? "bg-neutral-20 text-white"
              : "bg-white text-neutral-40 hover:bg-neutral-95"
          )}
          title="인용"
        >
          <Quote size={18} />
        </button>
      </div>

      {/* Editor Content */}
      <div className="p-4">
        <EditorContent
          editor={editor}
          className={clsx(
            "prose prose-sm max-w-none min-h-[200px]",
            "[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px]",
            "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6",
            "[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6",
            "[&_.ProseMirror_li]:my-1",
            "[&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:my-4",
            "[&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:my-3",
            "[&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_h3]:my-2",
            "[&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-neutral-80 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:my-4 [&_.ProseMirror_blockquote]:text-neutral-40 [&_.ProseMirror_blockquote]:italic",
            "[&_.ProseMirror_p]:my-2",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      </div>
    </div>
  );
};
