interface AILoadingIndicatorProps {
  message?: string;
}

export default function AILoadingIndicator({ message = 'Sakhi is analyzing your symptoms...' }: AILoadingIndicatorProps) {
  return (
    <div className="ai-loading" aria-live="polite">
      <div className="ai-loading-spinner" />
      <p className="ai-loading-text">{message}</p>
      <div className="ai-loading-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}
