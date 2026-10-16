"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight WYSIWYG editor (contentEditable) with an HTML source view.
 * Output is sanitized on the server before it is stored and again when rendered.
 */
export function RichTextEditor({ value, onChange, id, inline = false, labelledBy }: { value: string; onChange: (html: string) => void; id: string; inline?: boolean; labelledBy?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [source, setSource] = useState(false);

  useEffect(() => {
    if (ref.current && !source && ref.current.innerHTML !== value) ref.current.innerHTML = value || "";
  }, [value, source]);

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    onChange(ref.current?.innerHTML ?? "");
  };
  const link = () => {
    const url = window.prompt("Link address (https://… or /page):");
    if (url) exec("createLink", url);
  };

  return (
    <div>
      <div className="a-editor-toolbar" role="toolbar" aria-label="Formatting">
        {!source && (
          <>
            <button type="button" onClick={() => exec("bold")} title="Bold"><b>B</b></button>
            <button type="button" onClick={() => exec("italic")} title="Italic"><i>I</i></button>
            <button type="button" onClick={link} title="Link">Link</button>
            <button type="button" onClick={() => exec("unlink")} title="Remove link">Unlink</button>
            {!inline && (
              <>
                <button type="button" onClick={() => exec("formatBlock", "<p>")}>Paragraph</button>
                <button type="button" onClick={() => exec("formatBlock", "<h2>")}>H2</button>
                <button type="button" onClick={() => exec("formatBlock", "<h3>")}>H3</button>
                <button type="button" onClick={() => exec("formatBlock", "<h4>")}>H4</button>
                <button type="button" onClick={() => exec("insertUnorderedList")}>• List</button>
                <button type="button" onClick={() => exec("insertOrderedList")}>1. List</button>
                <button type="button" onClick={() => exec("formatBlock", "<blockquote>")}>Quote</button>
              </>
            )}
            {inline && <button type="button" onClick={() => exec("insertLineBreak")}>Line break</button>}
            <button type="button" onClick={() => exec("removeFormat")}>Clear</button>
          </>
        )}
        <button type="button" onClick={() => setSource((s) => !s)} aria-pressed={source} style={{ marginLeft: "auto" }}>
          {source ? "Visual" : "HTML"}
        </button>
      </div>
      {source ? (
        <textarea id={id} aria-labelledby={labelledBy} className="a-editor" style={{ fontFamily: "monospace", fontSize: 12, width: "100%" }} value={value} onChange={(e) => onChange(e.target.value)} rows={inline ? 4 : 12} />
      ) : (
        <div
          id={id}
          ref={ref}
          className="a-editor"
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline={!inline}
          aria-labelledby={labelledBy}
          style={inline ? { minHeight: 60 } : undefined}
          onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
          onBlur={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        />
      )}
    </div>
  );
}
