"use client"
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import { useEffect, useState } from "react";
import MarkdownRenderer from "../MarkdownRender";

interface MDeditorProps {
    value: string;
    onChange: (e: { target: { value: string } }) => void;
}

export default function MDeditor({ value, onChange }: MDeditorProps) {

    const [mode, setMode] = useState("edit")
    const editor = useCreateBlockNote({
        codeBlock: {
            indentLineWithTab: true,
            defaultLanguage: "typescript",
            supportedLanguages: {
                typescript: { name: "TypeScript", aliases: ["ts"] },
                javascript: { name: "JavaScript", aliases: ["js"] },
                python: { name: "Python", aliases: ["py"] },
                java: { name: "Java", aliases: ["java"] },
                c: { name: "C", aliases: ["c"] },
                cpp: { name: "C++", aliases: ["cpp", "c++"] },
                csharp: { name: "C#", aliases: ["cs", "csharp"] },
                go: { name: "Go", aliases: ["go", "golang"] },
                ruby: { name: "Ruby", aliases: ["rb"] },
                php: { name: "PHP", aliases: ["php"] },
                rust: { name: "Rust", aliases: ["rs", "rust"] },
                swift: { name: "Swift", aliases: ["swift"] },
                kotlin: { name: "Kotlin", aliases: ["kt", "kotlin"] },
                scala: { name: "Scala", aliases: ["scala"] },
                dart: { name: "Dart", aliases: ["dart"] },
                shell: { name: "Shell", aliases: ["sh", "bash", "zsh"] },
                sql: { name: "SQL", aliases: ["sql"] },
                html: { name: "HTML", aliases: ["html"] },
                css: { name: "CSS", aliases: ["css"] },
                json: { name: "JSON", aliases: ["json"] },
                yaml: { name: "YAML", aliases: ["yaml", "yml"] },
                markdown: { name: "Markdown", aliases: ["md", "markdown"] },
                plaintext: { name: "Plain Text", aliases: ["text", "plaintext"] },
                xml: { name: "XML", aliases: ["xml"] },
                objectivec: { name: "Objective-C", aliases: ["objc", "objectivec"] },
                perl: { name: "Perl", aliases: ["pl", "perl"] },
                r: { name: "R", aliases: ["r"] },
                powershell: { name: "PowerShell", aliases: ["ps1", "powershell"] },
                matlab: { name: "MATLAB", aliases: ["matlab"] },
                groovy: { name: "Groovy", aliases: ["groovy"] },
                lua: { name: "Lua", aliases: ["lua"] },
                vbnet: { name: "VB.NET", aliases: ["vb", "vbnet"] },
                fortran: { name: "Fortran", aliases: ["fortran", "f90", "f95"] },
                assembly: { name: "Assembly", aliases: ["asm", "assembly"] },
            },
        },
    });

    useEditorChange(async (editor) => {
        const markdown: any = await editor.blocksToMarkdownLossy(editor.document);
        onChange(markdown);
    }, editor);

    useEffect(() => {
        async function loadMarkdown() {
            const blocks = await editor.tryParseMarkdownToBlocks(value);
            editor.replaceBlocks(editor.document, blocks);
        }
        loadMarkdown();
    }, [editor]);

    return (
        <div className="min-h-72">
            <div className="flex items-center mb-2 gap-2">
                <button
                    type="button"
                    className={`px-2 py-1 rounded text-sm border ${mode === "edit" ? "bg-primary text-white" : "bg-white text-primary border-primary"}`}
                    onClick={() => setMode("edit")}
                    aria-pressed={mode === "edit"}
                >
                    Edit
                </button>
                <button
                    type="button"
                    className={`px-2 py-1 rounded text-sm border ${mode === "view" ? "bg-primary text-white" : "bg-white text-primary border-primary"}`}
                    onClick={() => setMode("view")}
                    aria-pressed={mode === "view"}
                >
                    Preview
                </button>
            </div>

            {mode === "edit" ? (
                <BlockNoteView
                    editor={editor}
                    theme="light"
                    className="min-h-72 border bg-white"
                />
            ) : (
                <div className="min-h-72 border bg-white p-4">
                    <MarkdownRenderer markdown={value} />
                </div>
            )}
        </div>
    );
}