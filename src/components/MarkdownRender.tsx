import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
    markdown: string;
    className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    markdown,
    className = "",
}) => {
    return (
        <div
            className={`
        prose prose-lg max-w-none 
        dark:prose-invert 
        prose-headings:scroll-m-20 
        prose-headings:tracking-tight
        prose-h1:text-4xl prose-h1:font-extrabold prose-h1:lg:text-5xl
        prose-h2:text-3xl prose-h2:font-semibold prose-h2:first:mt-0
        prose-h3:text-2xl prose-h3:font-semibold
        prose-h4:text-xl prose-h4:font-semibold
        prose-p:leading-7 prose-p:text-muted-foreground
        prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic
        prose-code:relative prose-code:rounded prose-code:bg-muted 
        prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono 
        prose-code:text-sm prose-code:font-semibold
        prose-lead:text-xl prose-lead:text-muted-foreground
        prose-img:rounded-lg prose-img:shadow-lg
        prose-hr:border-border
        prose-table:my-6 prose-th:border prose-th:px-4 prose-th:py-2 
        prose-th:text-left prose-th:font-bold prose-td:border 
        prose-td:px-4 prose-td:py-2
        ${className}
      `}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';

                        if (!inline) {
                            return (
                                <Card className="my-6 gap-0 overflow-hidden">
                                    {language && (
                                        <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b">
                                            <Badge variant="secondary" className="font-mono text-xs">
                                                {language}
                                            </Badge>
                                        </div>
                                    )}
                                    <pre
                                        className={`
                                    ${className}
                                    bg-background
                                    p-4
                                    overflow-x-auto
                                    text-sm
                                    leading-relaxed
                                    scrollbar-thin scrollbar-track-muted scrollbar-thumb-muted-foreground
                                `}
                                        {...props}
                                    >
                                        <code className={className}>{children}</code>
                                    </pre>
                                </Card>
                            );
                        }

                        return (
                            <code
                                className="
                  relative rounded bg-muted px-[0.3rem] py-[0.2rem]
                  font-mono text-sm font-semibold text-foreground
                "
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },

                    a({ children, href, ...props }) {
                        return (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                  font-medium text-primary underline underline-offset-4
                  hover:text-primary/80 transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary/20
                  focus:rounded-sm
                "
                                {...props}
                            >
                                {children}
                            </a>
                        );
                    },

                    img({ src, alt, ...props }) {
                        return (
                            <Card className="my-8 overflow-hidden">
                                <img
                                    src={src}
                                    alt={alt}
                                    className="w-full h-auto object-cover transition-transform duration-200 hover:scale-[1.02]"
                                    loading="lazy"
                                    {...props}
                                />
                            </Card>
                        );
                    },

                    blockquote({ children, ...props }) {
                        return (
                            <Card className="my-6 border-l-4 border-primary">
                                <CardContent className="pt-6">
                                    <blockquote
                                        className="text-muted-foreground italic font-medium leading-relaxed"
                                        {...props}
                                    >
                                        {children}
                                    </blockquote>
                                </CardContent>
                            </Card>
                        );
                    },

                    table({ children, ...props }) {
                        return (
                            <Card className="my-8 p-0 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table
                                        className="w-full caption-bottom text-sm"
                                        {...props}
                                    >
                                        {children}
                                    </table>
                                </div>
                            </Card>
                        );
                    },

                    thead({ children, ...props }) {
                        return (
                            <thead className="[&_tr]:border-b bg-muted/50" {...props}>
                                {children}
                            </thead>
                        );
                    },

                    th({ children, ...props }) {
                        return (
                            <th
                                className="
                  h-12 px-4 text-left align-middle font-semibold
                  text-muted-foreground border-b border-border
                "
                                {...props}
                            >
                                {children}
                            </th>
                        );
                    },

                    tbody({ children, ...props }) {
                        return (
                            <tbody className="[&_tr:last-child]:border-0" {...props}>
                                {children}
                            </tbody>
                        );
                    },

                    tr({ children, ...props }) {
                        return (
                            <tr
                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                {...props}
                            >
                                {children}
                            </tr>
                        );
                    },

                    td({ children, ...props }) {
                        return (
                            <td
                                className="p-4 align-middle text-foreground"
                                {...props}
                            >
                                {children}
                            </td>
                        );
                    },

                    h1({ children, ...props }) {
                        return (
                            <>
                                <h1
                                    className="
                    scroll-m-20 text-4xl font-extrabold tracking-tight
                    lg:text-5xl mt-12 mb-8 first:mt-0
                  "
                                    {...props}
                                >
                                    {children}
                                </h1>
                                <Separator className="mb-8" />
                            </>
                        );
                    },

                    h2({ children, ...props }) {
                        return (
                            <h2
                                className="
                  scroll-m-20  pb-2 text-3xl font-semibold
                  tracking-tight first:mt-0 mt-12 mb-6
                "
                                {...props}
                            >
                                {children}
                            </h2>
                        );
                    },

                    h3({ children, ...props }) {
                        return (
                            <h3
                                className="
                  scroll-m-20 text-2xl font-semibold tracking-tight
                  mt-10 mb-4
                "
                                {...props}
                            >
                                {children}
                            </h3>
                        );
                    },

                    h4({ children, ...props }) {
                        return (
                            <h4
                                className="
                  scroll-m-20 text-xl font-semibold tracking-tight
                  mt-8 mb-3
                "
                                {...props}
                            >
                                {children}
                            </h4>
                        );
                    },

                    h5({ children, ...props }) {
                        return (
                            <h5
                                className="
                  scroll-m-20 text-lg font-semibold tracking-tight
                  mt-6 mb-2
                "
                                {...props}
                            >
                                {children}
                            </h5>
                        );
                    },

                    h6({ children, ...props }) {
                        return (
                            <h6
                                className="
                  scroll-m-20 text-base font-semibold tracking-tight
                  mt-4 mb-2
                "
                                {...props}
                            >
                                {children}
                            </h6>
                        );
                    },

                    p({ children, ...props }) {
                        return (
                            <p
                                className="leading-7 text-muted-foreground mb-6 first:mt-0"
                                {...props}
                            >
                                {children}
                            </p>
                        );
                    },

                    ul({ children, ...props }) {
                        return (
                            <ul
                                className="my-6 ml-6 list-disc -space-y-5"
                                {...props}
                            >
                                {children}
                            </ul>
                        );
                    },

                    ol({ children, ...props }) {
                        return (
                            <ol
                                className="my-6 ml-6 list-decimal -space-y-5"
                                {...props}
                            >
                                {children}
                            </ol>
                        );
                    },

                    li({ children, ...props }) {
                        return (
                            <li
                                className="leading-7 text-muted-foreground"
                                {...props}
                            >
                                {children}
                            </li>
                        );
                    },

                    hr({ ...props }) {
                        return <Separator className="my-8" {...props} />;
                    },

                    strong({ children, ...props }) {
                        return (
                            <strong
                                className="font-semibold text-foreground"
                                {...props}
                            >
                                {children}
                            </strong>
                        );
                    },

                    em({ children, ...props }) {
                        return (
                            <em
                                className="italic text-muted-foreground"
                                {...props}
                            >
                                {children}
                            </em>
                        );
                    },
                }}
            >
                {markdown}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;