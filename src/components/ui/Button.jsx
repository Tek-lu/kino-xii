const variants = {
    primary: 'bg-hc-red text-tx-white',
    light: 'bg-tx-white text-bg-darkest',
    ghost: 'bg-tint-white text-tx-white',
  }
  
  export default function Button({ variant = 'primary', loading = false, className = '', children, disabled, ...props }) {
    return (
      <button
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 ${variants[variant]} ${className}`}
        {...props}
      >
        {loading && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    )
  }