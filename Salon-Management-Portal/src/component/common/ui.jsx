export const STATUS_COLORS = {
  Pending: { background: '#fef9c3', color: '#a16207' },
  Confirmed: { background: '#dbeafe', color: '#1d4ed8' },
  'In Progress': { background: '#e0e7ff', color: '#4338ca' },
  Completed: { background: '#dcfce7', color: '#15803d' },
  Cancelled: { background: '#fee2e2', color: '#b91c1c' },
  Paid: { background: '#dcfce7', color: '#15803d' },
  Unpaid: { background: '#ffedd5', color: '#c2410c' },
  Processing: { background: '#dbeafe', color: '#1d4ed8' },
  Shipped: { background: '#e0e7ff', color: '#4338ca' },
  Delivered: { background: '#dcfce7', color: '#15803d' },
  Approved: { background: '#dcfce7', color: '#15803d' },
  Rejected: { background: '#fee2e2', color: '#b91c1c' },
};

export function StatusBadge({ status }) {
  const style = STATUS_COLORS[status] || { background: '#f3f4f6', color: '#1f2937' };
  return (
    <span className="admin-badge" style={style}>
      {status}
    </span>
  );
}

export function LoadingSpinner({ className = '' }) {
  return (
    <div className={`spinner-container ${className}`}>
      <div className="spinner" />
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ message = 'No data found' }) {
  return (
    <div className="empty-state">
      {message}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-content ${wide ? 'modal-wide' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button type="button" onClick={onClose} className="modal-close">
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export function inputClass(extra = '') {
  return `ui-input ${extra}`;
}

export function btnPrimary(extra = '') {
  return `ui-btn-primary ${extra}`;
}

export function btnSecondary(extra = '') {
  return `ui-btn-secondary ${extra}`;
}
