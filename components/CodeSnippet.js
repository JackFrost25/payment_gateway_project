export default function CodeSnippet({ language, title, code }) {
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-block-lang">{language}</span>
        {title && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{title}</span>}
      </div>
      <div className="code-block-body">
        <pre dangerouslySetInnerHTML={{ __html: code }} />
      </div>
    </div>
  );
}
