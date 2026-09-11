"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { File as FileIcon, UploadCloud, X } from "lucide-react";

const MAX_FILES = 4;
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export function ExamFilesDropzone({ name }: { name: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function syncInput(next: File[]) {
    setFiles(next);
    if (inputRef.current) {
      const dataTransfer = new DataTransfer();
      for (const file of next) dataTransfer.items.add(file);
      inputRef.current.files = dataTransfer.files;
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted) => syncInput([...files, ...accepted].slice(0, MAX_FILES)),
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif"], "application/pdf": [".pdf"] },
    multiple: true,
    maxFiles: MAX_FILES,
    maxSize: MAX_SIZE_BYTES,
  });

  function removeFile(index: number) {
    syncInput(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <input ref={inputRef} type="file" name={name} multiple className="hidden" />

      <div
        {...getRootProps()}
        className={`flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
          isDragActive ? "border-brand-deep bg-brand-light/40" : "border-ink-100 hover:border-brand"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-7 w-7 text-brand-deep" strokeWidth={1.5} />
        <p className="text-sm">
          <span className="font-semibold text-brand-deep">Clique para enviar</span>{" "}
          <span className="text-ink-600">ou arraste e solte</span>
        </p>
        <p className="text-xs text-ink-600">PDF, JPG, PNG ou GIF · até {MAX_FILES} arquivos</p>
      </div>

      {files.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {files.map((file, index) => {
            const isImage = file.type.startsWith("image/");
            return (
              <div
                key={`${file.name}-${file.lastModified}-${file.size}`}
                className="relative h-20 w-20 overflow-hidden rounded-md border border-ink-100"
              >
                {isImage ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    height={80}
                    width={80}
                    unoptimized
                    className="h-20 w-20 object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-surface-soft p-1 text-center">
                    <FileIcon className="h-5 w-5 text-brand-deep" strokeWidth={1.75} />
                    <span className="line-clamp-2 text-[10px] leading-tight text-ink-600">{file.name}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  aria-label={`Remover ${file.name}`}
                  className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900/70 text-white transition-colors hover:bg-ink-900"
                >
                  <X className="h-3 w-3" strokeWidth={2.5} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
