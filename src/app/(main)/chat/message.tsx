import { Check, Copy } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

import Bounce from '@/components/animated/uibeats/bounce';

export type MessageProps = {
  content: string
  role: string
  isStreaming?: boolean
}

export const Message: React.FC<MessageProps> = ({
  content,
  role,
  isStreaming,
}) => {
  const [copied, setCopied] = useState<Record<string, boolean>>({})
  const { theme } = useTheme()

  const handleCopy = (code: string, index: string) => {
    navigator.clipboard.writeText(code)
    setCopied({ ...copied, [index]: true })
    setTimeout(() => {
      setCopied({ ...copied, [index]: false })
    }, 2000)
  }

  if (role === "user") {
    return (
      <Bounce className="relative ml-auto w-fit max-w-xl rounded-3xl bg-muted px-5 py-2.5">
        <div className="whitespace-pre-wrap">{content}</div>
      </Bounce>
    )
  }

  const components: Partial<Components> = {
    table: ({ children }) => (
      <div className="my-4 overflow-x-auto">
        <table className="w-full border-collapse border border-border">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-border">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="border-r border-border p-2 text-left font-semibold last:border-r-0">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-r border-border p-2 last:border-r-0">{children}</td>
    ),
    code({ className, children, node, ...props }) {
      const match = /language-(\w+)/.exec(className || "")
      const code = String(children).replace(/\n$/, "")

      if (match && node?.position?.start.line !== node?.position?.end.line) {
        const language = match[1]
        const codeId = `${language}-${code.slice(0, 20)}`

        const SyntaxHighlighterComponent =
          SyntaxHighlighter as unknown as React.ComponentType<any>

        return (
          <div className="group relative">
            <div className="absolute right-2 top-2 z-10">
              <button
                onClick={() => handleCopy(code, codeId)}
                className="rounded bg-muted p-1 transition-colors hover:bg-muted/80"
                aria-label="Copy code"
              >
                {copied[codeId] ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <SyntaxHighlighterComponent
              language={language}
              style={darcula}
              PreTag="div"
              className="!mt-0 rounded-md"
              customStyle={{
                margin: 0,
                padding: "1rem",
                background:
                  theme === "dark" ? "hsl(var(--muted))" : "hsl(var(--muted))",
              }}
            >
              {code}
            </SyntaxHighlighterComponent>
          </div>
        )
      }

      return (
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm" {...props}>
          {children}
        </code>
      )
    },
    p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
    ul: ({ children }) => (
      <ul className="mb-4 list-disc pl-6 last:mb-0">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 list-decimal pl-6 last:mb-0">{children}</ol>
    ),
    li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
    h1: ({ children }) => (
      <h1 className="mb-4 text-2xl font-bold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 text-xl font-bold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 text-lg font-bold">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mb-4 border-l-4 border-muted pl-4 italic">
        {children}
      </blockquote>
    ),
  }

  return (
    <Bounce className="rounded-lg bg-background p-4 text-foreground">
      {isStreaming && (
        <div className="mb-2 animate-pulse text-sm text-muted-foreground">
          Pandorra is thinking...
        </div>
      )}
      <div className={`${isStreaming ? "animate-fade-in" : ""}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </div>
    </Bounce>
  )
}

export default Message
