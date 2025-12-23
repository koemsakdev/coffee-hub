import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface FoldedRange {
    startLine: number;
    endLine: number;
}

type JsonEditorProps = {
    INITIAL_JSON: Record<string, any>;
    onSave: (value: object) => void;
    onReset: () => void;
};



const JsonEditor = ({ INITIAL_JSON, onSave, onReset }: JsonEditorProps) => {
    const router = useRouter();
    const [fullRawContent, setFullRawContent] = useState(JSON.stringify(INITIAL_JSON, null, 4));
    const [foldedRanges, setFoldedRanges] = useState<FoldedRange[]>([]);
    const [error, setError] = useState<string | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const gutterRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Sync scroll between textarea and gutter
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (gutterRef.current) {
            gutterRef.current.scrollTop = e.currentTarget.scrollTop;
        }
    };

    const highlightJSON = (json: string) => {
        if (!json) return "";

        let html = json
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        html = html.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[\[\]{}])/g,
            (match) => {
                let cls = 'text-[#b5cea8]';
                if (/^"/.test(match)) {
                    cls = /:$/.test(match) ? 'text-[#9cdcfe]' : 'text-[#ce9178]';
                } else if (/true|false/.test(match)) {
                    cls = 'text-[#569cd6]';
                } else if (/null/.test(match)) {
                    cls = 'text-[#569cd6]';
                } else if (/[\[\]{}]/.test(match)) {
                    return `<span class="text-[#ffd700]">${match}</span>`;
                }
                return `<span class="${cls}">${match}</span>`;
            }
        );

        return html.split('___FOLD___').map((part, i) => {
            if (i === 0) return part;
            const endTokenIndex = part.indexOf('___');
            const lineIdx = part.substring(0, endTokenIndex);
            const rest = part.substring(endTokenIndex + 3);
            return `<button class="inline-flex items-center justify-center bg-[#3c3c3c] hover:bg-[#4a4a4a] text-[#ccc] hover:text-white rounded px-1 mx-1 text-[11px] h-4 border border-[#555] cursor-pointer font-sans z-10">...</button>${rest}`;
        }).join('');
    };

    const getVisibleData = useCallback(() => {
        const rawLines = fullRawContent.split('\n');
        const textareaLines: string[] = [];
        const highlightLines: string[] = [];
        const lineMap: number[] = [];

        for (let i = 0; i < rawLines.length; i++) {
            const foldedRange = foldedRanges.find(r => i === r.startLine);
            if (foldedRange) {
                const line = rawLines[i];
                const openChar = line.includes('{') ? '{' : '[';
                const charIdx = line.indexOf(openChar);
                const head = line.substring(0, charIdx + 1);
                const tail = rawLines[foldedRange.endLine].trim();

                textareaLines.push(`${head} ... ${tail}`);
                highlightLines.push(`${head} ___FOLD___${i}___ ${tail}`);
                lineMap.push(i);
                i = foldedRange.endLine;
            } else {
                textareaLines.push(rawLines[i]);
                highlightLines.push(rawLines[i]);
                lineMap.push(i);
            }
        }
        return {
            textareaText: textareaLines.join('\n'),
            highlightText: highlightLines.join('\n'),
            lineMap
        };
    }, [fullRawContent, foldedRanges]);

    const toggleFold = (rawLineIndex: number) => {
        const existingIdx = foldedRanges.findIndex(r => r.startLine === rawLineIndex);
        if (existingIdx !== -1) {
            setFoldedRanges(prev => prev.filter(r => r.startLine !== rawLineIndex));
        } else {
            const lines = fullRawContent.split('\n');
            let bracketCount = 0;
            let endLineIndex = -1;
            const openChar = lines[rawLineIndex].includes('{') ? '{' : '[';
            const closeChar = openChar === '{' ? '}' : ']';

            for (let i = rawLineIndex; i < lines.length; i++) {
                const line = lines[i];
                for (const char of line) {
                    if (char === openChar) bracketCount++;
                    if (char === closeChar) bracketCount--;
                }
                if (bracketCount === 0 && i > rawLineIndex) {
                    endLineIndex = i;
                    break;
                }
            }

            if (endLineIndex !== -1) {
                setFoldedRanges(prev => [...prev, { startLine: rawLineIndex, endLine: endLineIndex }]);
            }
        }
    };

    const unfoldLine = useCallback((rawLineIndex: number) => {
        setFoldedRanges(prev => prev.filter(r => r.startLine !== rawLineIndex));
    }, []);

    useEffect(() => {
        const handler = (e: any) => unfoldLine(e.detail);
        window.addEventListener('unfoldLine', handler);
        return () => window.removeEventListener('unfoldLine', handler);
    }, [unfoldLine]);

    useEffect(() => {
        try {
            JSON.parse(fullRawContent);
            setError(null);
        } catch (e: any) {
            setError(e.message);
        }
    }, [fullRawContent]);

    const { textareaText, highlightText, lineMap } = getVisibleData();

    const calculateHeight = () => {
        const lineCount = textareaText.split('\n').length;
        return `${lineCount * 22.4 + 40}px`;
    };


    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullRawContent);
        } catch {
            alert("Copy failed");
        }
    };


    return (
        <div className="flex flex-col w-full max-w-4xl gap-4 mx-auto justify-center">
            {/* Scrollbar Styling Injection */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid transparent;
          background-clip: padding-box;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
          border: 2px solid transparent;
          background-clip: padding-box;
        }
            `}} />

            <div className="flex flex-col rounded-sm border border-slate-700 bg-[#1e1e1e] shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center bg-[#2d2d2d] px-4 py-2 border-b border-[#3c3c3c] shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest font-sans">
                            payment_config.json
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                try {
                                    setFullRawContent(JSON.stringify(JSON.parse(fullRawContent), null, 4));
                                    setFoldedRanges([]);
                                } catch { }
                            }}
                            className="text-[11px] px-3 py-1 bg-[#3c3c3c] hover:bg-[#4a4a4a] text-white rounded transition-colors"
                        >
                            Format
                        </button>
                        <button
                            onClick={handleCopy}
                            className="text-[11px] px-3 py-1 bg-[#3c3c3c] hover:bg-[#4a4a4a] text-white rounded transition-colors"
                        >
                            Copy
                        </button>
                        <button
                            onClick={onReset}
                            className="text-[11px] px-3 py-1 bg-[#3c3c3c] hover:bg-[#4a4a4a] text-white rounded transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 relative overflow-hidden">
                    {/* Gutter */}
                    <div ref={gutterRef} className="w-12 bg-[#1e1e1e] border-r border-[#404040] py-5 flex flex-col items-end select-none text-[#858585] font-mono text-sm leading-[1.57] overflow-hidden shrink-0">
                        {lineMap.map((rawIdx) => {
                            const lines = fullRawContent.split('\n');
                            const isFolded = foldedRanges.some(r => r.startLine === rawIdx);
                            const currentIndent = lines[rawIdx].search(/\S/);
                            const nextLine = lines[rawIdx + 1];
                            const nextIndent = nextLine ? nextLine.search(/\S/) : -1;
                            const canFold = nextIndent > currentIndent && (lines[rawIdx].includes('{') || lines[rawIdx].includes('['));

                            return (
                                <div key={rawIdx} className="h-[22.4px] relative w-full px-3 text-right group flex items-center">
                                    {rawIdx + 1}
                                    {(canFold || isFolded) && (
                                        <span
                                            onClick={() => toggleFold(rawIdx)}
                                            className={`absolute right-1 cursor-pointer text-[10px] transition-transform ${isFolded ? '-rotate-90 opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                        >
                                            <ChevronDown className='size-4' />
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Single Scroll Container */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 relative overflow-hidden bg-[#1e1e1e] custom-scrollbar"
                    >
                        <div style={{ height: calculateHeight() }} className="relative">
                            {/* Syntax Layer */}
                            <div
                                className="absolute top-0 left-0 w-full p-5 m-0 font-mono text-sm leading-[1.57] whitespace-pre-wrap wrap-break-word pointer-events-none text-[#d4d4d4]"
                                dangerouslySetInnerHTML={{ __html: highlightJSON(highlightText) }}
                            />

                            {/* Editor Layer */}
                            <textarea
                                ref={textareaRef}
                                value={textareaText}
                                onChange={(e) => {
                                    setFullRawContent(e.target.value);
                                    setFoldedRanges([]);
                                }}
                                spellCheck={false}
                                className="absolute top-0 left-0 w-full h-full p-5 m-0 font-mono text-sm leading-[1.57] whitespace-pre-wrap wrap-break-word bg-transparent text-transparent caret-white resize-none border-none outline-none z-2 overflow-hidden"
                                onKeyDown={(e) => {
                                    if (e.key === 'Tab') {
                                        e.preventDefault();
                                        const start = e.currentTarget.selectionStart;
                                        const end = e.currentTarget.selectionEnd;
                                        const newVal = fullRawContent.substring(0, start) + "    " + fullRawContent.substring(end);
                                        setFullRawContent(newVal);
                                        setTimeout(() => {
                                            if (textareaRef.current) {
                                                textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
                                            }
                                        }, 0);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                {error && (
                    <div className="bg-[#321111] text-red-400 px-4 py-2 text-xs border-t border-[#522] shrink-0">
                        JSON Error: {error}
                    </div>
                )}
            </div>

            <button
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg font-bold text-white transition-all shadow-lg active:scale-[0.98] shrink-0"
                onClick={() => onSave(JSON.parse(fullRawContent))}
            >
                Save Configuration
            </button>
        </div>
    );
};

export default JsonEditor;