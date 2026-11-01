import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }

  override render() {
    if (this.state.hasError) {
      let displayDetail = this.state.errorMessage;
      try {
        const parsed = JSON.parse(this.state.errorMessage) as {
          error?: string;
          operationType?: string;
          path?: string;
        };
        if (parsed && parsed.error) {
          displayDetail = `${parsed.error} (${parsed.operationType ?? 'op'} on ${parsed.path ?? 'db'})`;
        }
      } catch {
        // Plain text error
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-[#D3E3FC]/35 px-6 py-16">
          <div className="w-full max-w-lg rounded-xl border border-[#77A6F7]/50 bg-[#FFFFFF] p-8">
            <div className="flex items-center gap-3 text-[#00887A]">
              <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold text-brand-ink">
                Произошла техническая ошибка / Техникалық қате орын алды
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-brand-muted">{displayDetail}</p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, errorMessage: '' });
                window.location.reload();
              }}
              className="mt-6 rounded-lg bg-[#00887A] px-4 py-2.5 text-sm font-semibold text-[#FFFFFF] transition-colors hover:bg-brand-teal-hover whitespace-nowrap shrink-0"
            >
              Обновить страницу / Бетті жаңарту
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
