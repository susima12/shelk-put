// Compat shim: re-export TanStack Router APIs with react-router-dom signatures.
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import {
  Link as TLink,
  Outlet as TOutlet,
  useNavigate as tUseNavigate,
  useLocation as tUseLocation,
  useParams as tUseParams,
  useSearch as tUseSearch,
} from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type LinkProps = {
  to: string;
  children?: ReactNode;
  className?: string;
  end?: boolean;
  replace?: boolean;
  state?: unknown;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, children, className, end: _end, replace, state: _state, ...rest },
  ref,
) {
  // Use string href via TanStack Link with `to` as any to bypass typed routes
  return (
    <TLink
      ref={ref as any}
      to={to as any}
      className={className}
      replace={replace}
      {...(rest as any)}
    >
      {children}
    </TLink>
  );
});

type NavLinkClassFn = (args: { isActive: boolean; isPending: boolean }) => string | undefined;

type NavLinkProps = Omit<LinkProps, "className"> & {
  className?: string | NavLinkClassFn;
  end?: boolean;
};

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { to, className, end, children, ...rest },
  ref,
) {
  return (
    <TLink
      ref={ref as any}
      to={to as any}
      activeOptions={{ exact: !!end }}
      {...(rest as any)}
    >
      {(state: any) => {
        const isActive = !!state?.isActive;
        const cls = typeof className === "function" ? className({ isActive, isPending: false }) : className;
        return <span className={cn(cls)}>{typeof children === "function" ? (children as any)({ isActive, isPending: false, isTransitioning: false }) : children}</span>;
      }}
    </TLink>
  );
});

export const Outlet = TOutlet;

// react-router useNavigate returns (to | number, options?) => void
export function useNavigate() {
  const nav = tUseNavigate();
  return (to: string | number, opts?: { replace?: boolean; state?: unknown }) => {
    if (typeof to === "number") {
      if (typeof window !== "undefined") window.history.go(to);
      return;
    }
    nav({ to: to as any, replace: opts?.replace });
  };
}

export function useLocation() {
  const loc = tUseLocation();
  return {
    pathname: loc.pathname,
    search: loc.searchStr,
    hash: loc.hash,
    state: (loc as any).state,
    key: (loc as any).key ?? "default",
  };
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T {
  return (tUseParams as any)({ strict: false }) as T;
}

// Minimal useSearchParams shim
export function useSearchParams(): [URLSearchParams, (next: URLSearchParams | Record<string, string>) => void] {
  const search = tUseSearch({ strict: false }) as Record<string, any>;
  const nav = tUseNavigate();
  const params = new URLSearchParams();
  Object.entries(search ?? {}).forEach(([k, v]) => {
    if (v != null) params.set(k, String(v));
  });
  const setParams = (next: URLSearchParams | Record<string, string>) => {
    const obj: Record<string, string> = {};
    if (next instanceof URLSearchParams) {
      next.forEach((v, k) => (obj[k] = v));
    } else {
      Object.assign(obj, next);
    }
    nav({ to: "." as any, search: obj as any });
  };
  return [params, setParams];
}
